import { FileText, Info, UploadCloud } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Badge, Button, Card } from '../../../design-system/components'
import { AuthApiError } from '../../auth/api/authApi'
import {
  createCvAnalysis,
  getCvAnalysis,
  listCvAnalyses,
  listApplicantCvs,
  uploadApplicantCv,
} from '../api/cvAnalyzerApi'
import type { CvAnalysisResponse } from '../api/cvAnalyzerApi'
import { AnalyzerSidebar } from '../components/AnalyzerSidebar'
import { FailureView } from '../components/FailureView'
import { HistoryView } from '../components/HistoryView'
import { ProcessingView } from '../components/ProcessingView'
import { ResultView } from '../components/ResultView'
import { UploadZone } from '../components/UploadZone'
import type {
  AnalysisRecord,
  CvAnalysisResult,
  CvAnalyzerScreen,
  CvAnalyzerView,
  CvDocument,
  CvFileError,
  CvSource,
} from '../types/cvAnalyzer'
import { formatCvFileSize } from '../utils/cvFormatters'
import styles from './CvAnalyzerPage.module.css'

const MAX_CV_FILE_SIZE = 10 * 1024 * 1024
const MAX_SAVED_CVS = 5
const HISTORY_PAGE_SIZE = 10

function isSupportedFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension === 'pdf' || extension === 'docx'
}

function toFailure(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : 'Analisis CV tidak dapat diselesaikan. Silakan coba kembali.'
  const status =
    error instanceof AuthApiError && error.status
      ? `HTTP ${error.status}`
      : 'Permintaan ke backend gagal.'

  return { message, details: status }
}

export default function CvAnalyzerPage() {
  const [view, setView] = useState<CvAnalyzerView>('analyzer')
  const [screen, setScreen] = useState<CvAnalyzerScreen>('choose')
  const [source, setSource] = useState<CvSource>('saved')
  const [cvDocuments, setCvDocuments] = useState<CvDocument[]>([])
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<CvFileError | null>(null)
  const [cvListLoading, setCvListLoading] = useState(true)
  const [cvListError, setCvListError] = useState<string | null>(null)
  const [reloadCvs, setReloadCvs] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCvId, setActiveCvId] = useState<string | null>(null)
  const [activeDocumentName, setActiveDocumentName] = useState('')
  const [analysisResult, setAnalysisResult] =
    useState<CvAnalysisResult | null>(null)
  const [analyzedAt, setAnalyzedAt] = useState('')
  const [analysisFailure, setAnalysisFailure] = useState<{
    message: string
    details: string
  } | null>(null)
  const [showingHistoryDetail, setShowingHistoryDetail] = useState(false)
  const [history, setHistory] = useState<CvAnalysisResponse[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [historyReload, setHistoryReload] = useState(0)
  const [historyDetailLoadingId, setHistoryDetailLoadingId] = useState<
    string | null
  >(null)

  useEffect(() => {
    let active = true

    void listApplicantCvs()
      .then((documents) => {
        if (!active) return
        setCvDocuments(documents)
        setSelectedSavedId((selectedId) =>
          documents.some(({ id }) => id === selectedId)
            ? selectedId
            : (documents[0]?.id ?? null),
        )
      })
      .catch((error: unknown) => {
        if (!active) return
        setCvListError(
          error instanceof Error
            ? error.message
            : 'Daftar CV tidak dapat dimuat.',
        )
      })
      .finally(() => {
        if (active) setCvListLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadCvs])

  useEffect(() => {
    let active = true
    void listCvAnalyses(historyPage, HISTORY_PAGE_SIZE)
      .then(({ analyses, pagination }) => {
        if (!active) return
        setHistory(analyses)
        setHistoryTotal(pagination.total)
        setHistoryTotalPages(pagination.totalPages)
        setHistoryError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        setHistoryError(
          error instanceof Error
            ? error.message
            : 'Riwayat analisis tidak dapat dimuat.',
        )
      })
      .finally(() => {
        if (active) setHistoryLoading(false)
      })

    return () => {
      active = false
    }
  }, [historyPage, historyReload])

  const selectedSavedDocument =
    cvDocuments.find(({ id }) => id === selectedSavedId) ?? null
  const historyRecords: AnalysisRecord[] = history.map((analysis) => {
    const cv = cvDocuments.find(({ id }) => id === analysis.cvId)
    return {
      analysisId: analysis.id,
      cvId: analysis.cvId,
      name: cv?.name ?? `CV ${analysis.cvId}`,
      analyzedAt: analysis.requestedAt,
      status: analysis.status,
    }
  })
  const canUploadCv =
    !cvListLoading &&
    !cvListError &&
    cvDocuments.length < MAX_SAVED_CVS
  const canStartAnalysis =
    !isSubmitting &&
    !cvListLoading &&
    !cvListError &&
    (source === 'saved'
      ? Boolean(selectedSavedDocument)
      : canUploadCv && Boolean(selectedFile) && fileError === null)

  function handleFileSelect(file: File | null) {
    setSelectedFile(file)
    setFileError(
      !file
        ? null
        : !isSupportedFile(file)
          ? 'unsupported-format'
          : file.size > MAX_CV_FILE_SIZE
            ? 'too-large'
            : null,
    )
  }

  async function runAnalysis(
    savedDocument: Pick<CvDocument, 'id' | 'name'> | null,
    fileToUpload?: File,
    fromHistory = false,
  ) {
    if (!savedDocument && !fileToUpload) return

    setIsSubmitting(true)
    setAnalysisResult(null)
    setAnalysisFailure(null)
    setActiveCvId(savedDocument?.id ?? null)
    setActiveDocumentName(savedDocument?.name ?? fileToUpload?.name ?? '')
    setShowingHistoryDetail(fromHistory)
    setView('analyzer')
    setScreen('processing')

    try {
      let document = savedDocument
      if (!document && fileToUpload) {
        const uploadedDocument = await uploadApplicantCv(fileToUpload)
        document = uploadedDocument
        setCvDocuments((documents) => [
          uploadedDocument,
          ...documents.filter(({ id }) => id !== uploadedDocument.id),
        ])
        setSelectedSavedId(document.id)
        setSource('saved')
        setSelectedFile(null)
        setActiveCvId(document.id)
        setActiveDocumentName(document.name)
      }

      if (!document) {
        throw new Error('CV belum tersedia untuk dianalisis.')
      }

      const analysis = await createCvAnalysis(document.id)
      if (analysis.status !== 'COMPLETED' || !analysis.result) {
        throw new AuthApiError(
          'Backend belum mengembalikan hasil analisis yang selesai.',
          503,
        )
      }

      setAnalysisResult(analysis.result)
      setAnalyzedAt(analysis.requestedAt)
      setScreen('result')
      setHistoryReload((count) => count + 1)
    } catch (error) {
      setAnalysisFailure(toFailure(error))
      setScreen('failure')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStartAnalysis() {
    if (source === 'saved') {
      void runAnalysis(selectedSavedDocument)
      return
    }
    if (selectedFile && !fileError && canUploadCv) {
      void runAnalysis(null, selectedFile)
    }
  }

  function retryAnalysis() {
    if (activeCvId) {
      void runAnalysis(
        { id: activeCvId, name: activeDocumentName },
        undefined,
        showingHistoryDetail,
      )
      return
    }
    if (selectedFile && !fileError && canUploadCv) {
      void runAnalysis(null, selectedFile)
    }
  }

  function resetForNewDocument() {
    setScreen('choose')
    setSource(cvDocuments.length < MAX_SAVED_CVS ? 'upload' : 'saved')
    setSelectedFile(null)
    setFileError(null)
    setAnalysisFailure(null)
    setAnalysisResult(null)
    setActiveCvId(null)
    setActiveDocumentName('')
    setShowingHistoryDetail(false)
    setView('analyzer')
  }

  function returnToSelection() {
    setView('analyzer')
    setScreen('choose')
    setAnalysisFailure(null)
    setAnalysisResult(null)
    setShowingHistoryDetail(false)
  }

  function cancelSelection() {
    setSource('saved')
    setSelectedFile(null)
    setFileError(null)
  }

  function retryLoadingCvs() {
    setCvListLoading(true)
    setCvListError(null)
    setReloadCvs((count) => count + 1)
  }

  function openHistory() {
    setView('history')
  }

  function retryHistory() {
    setHistoryLoading(true)
    setHistoryError(null)
    setHistoryReload((count) => count + 1)
  }

  function changeHistoryPage(page: number) {
    setHistoryLoading(true)
    setHistoryError(null)
    setHistoryPage(page)
  }

  async function openHistoryRecord(record: AnalysisRecord) {
    setView('history')
    setHistoryDetailLoadingId(record.analysisId)
    setHistoryError(null)
    try {
      const analysis = await getCvAnalysis(record.analysisId)
      const cv = cvDocuments.find(({ id }) => id === analysis.cvId)
      const documentName = cv?.name ?? record.name
      setActiveCvId(analysis.cvId)
      setActiveDocumentName(documentName)
      setShowingHistoryDetail(true)
      setAnalyzedAt(analysis.requestedAt)

      if (analysis.status === 'COMPLETED' && analysis.result) {
        setAnalysisResult(analysis.result)
        setAnalysisFailure(null)
        setScreen('result')
      } else if (analysis.status === 'PROCESSING') {
        setAnalysisResult(null)
        setAnalysisFailure(null)
        setScreen('processing')
      } else {
        setAnalysisResult(null)
        setAnalysisFailure({
          message:
            analysis.status === 'FAILED'
              ? 'Analisis CV ini berstatus gagal dari backend.'
              : 'Backend tidak menyediakan hasil untuk analisis ini.',
          details: `Status analisis: ${analysis.status}`,
        })
        setScreen('failure')
      }
      setView('analyzer')
    } catch (error) {
      setHistoryError(
        error instanceof Error
          ? error.message
          : 'Detail analisis tidak dapat dimuat.',
      )
    } finally {
      setHistoryDetailLoadingId(null)
    }
  }

  function returnFromHistoryDetail() {
    setView('history')
    retryHistory()
  }

  return (
    <section className={styles.page} aria-labelledby="cv-analyzer-title">
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>Ruang karier pelamar</div>
          <h1 id="cv-analyzer-title">AI CV Analyzer</h1>
          <p>
            Tinjau CV dan temukan peluang untuk menyempurnakan profil
            profesionalmu.
          </p>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.primaryColumn}>
          {view === 'history' ? (
            <HistoryView
              error={historyError}
              history={historyRecords}
              loading={historyLoading}
              onAnalyzeNew={resetForNewDocument}
              onOpenRecord={openHistoryRecord}
              onPageChange={changeHistoryPage}
              onRetryLoad={retryHistory}
              page={historyPage}
              selectedAnalysisId={historyDetailLoadingId}
              total={historyTotal}
              totalPages={historyTotalPages}
            />
          ) : screen === 'processing' ? (
            <ProcessingView
              documentName={activeDocumentName}
              mode={showingHistoryDetail ? 'history' : 'analysis'}
              onBackToHistory={
                showingHistoryDetail ? returnFromHistoryDetail : undefined
              }
            />
          ) : screen === 'result' && activeCvId && analysisResult ? (
            <ResultView
              analyzedAt={analyzedAt}
              backLabel={
                showingHistoryDetail
                  ? 'Kembali ke riwayat'
                  : 'Kembali ke pilihan CV'
              }
              documentName={activeDocumentName}
              onAnalyzeAgain={() =>
                void runAnalysis(
                  { id: activeCvId, name: activeDocumentName },
                  undefined,
                  showingHistoryDetail,
                )
              }
              onBackToSelection={
                showingHistoryDetail ? returnFromHistoryDetail : returnToSelection
              }
              onUploadNew={resetForNewDocument}
              result={analysisResult}
            />
          ) : screen === 'failure' && analysisFailure ? (
            <FailureView
              details={analysisFailure.details}
              documentName={activeDocumentName}
              message={analysisFailure.message}
              onChooseAnother={
                showingHistoryDetail ? returnFromHistoryDetail : returnToSelection
              }
              onRetry={retryAnalysis}
            />
          ) : (
            <div className={styles.chooseView}>
              <Card className={styles.chooseCard}>
                <header className={styles.cardHeader}>
                  <span className={styles.cardHeaderIcon} aria-hidden="true">
                    <FileText size={20} />
                  </span>
                  <div>
                    <h2>Pilih Dokumen CV</h2>
                    <p>Pilih CV tersimpan atau unggah dokumen baru.</p>
                  </div>
                </header>

                <div className={styles.tabs} role="tablist" aria-label="Sumber CV">
                  <button
                    aria-controls="saved-cv-panel"
                    aria-selected={source === 'saved'}
                    className={[
                      styles.tab,
                      source === 'saved' ? styles.tabActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={isSubmitting || cvListLoading}
                    id="saved-cv-tab"
                    onClick={() => setSource('saved')}
                    role="tab"
                    type="button"
                  >
                    CV Tersimpan
                  </button>
                  <button
                    aria-controls="upload-cv-panel"
                    aria-selected={source === 'upload'}
                    className={[
                      styles.tab,
                      source === 'upload' ? styles.tabActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={isSubmitting || !canUploadCv}
                    id="upload-cv-tab"
                    onClick={() => setSource('upload')}
                    role="tab"
                    type="button"
                  >
                    Unggah CV Baru
                  </button>
                </div>

                {source === 'saved' ? (
                  <div
                    aria-labelledby="saved-cv-tab"
                    className={styles.savedPanel}
                    id="saved-cv-panel"
                    role="tabpanel"
                  >
                    {cvListLoading ? (
                      <p role="status">Memuat CV tersimpan...</p>
                    ) : cvListError ? (
                      <div className={styles.validationSummary} role="alert">
                        <p>{cvListError}</p>
                        <Button
                          onClick={retryLoadingCvs}
                          size="small"
                          type="button"
                          variant="outline"
                        >
                          Coba muat ulang
                        </Button>
                      </div>
                    ) : cvDocuments.length === 0 ? (
                      <p>Belum ada CV tersimpan. Unggah CV untuk memulai.</p>
                    ) : (
                      cvDocuments.map((document) => (
                        <label
                          className={[
                            styles.savedDocument,
                            selectedSavedId === document.id
                              ? styles.savedDocumentSelected
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          key={document.id}
                        >
                          <input
                            checked={selectedSavedId === document.id}
                            name="saved-cv"
                            onChange={() => setSelectedSavedId(document.id)}
                            type="radio"
                            value={document.id}
                          />
                          <span className={styles.fileIcon} aria-hidden="true">
                            <FileText size={20} />
                          </span>
                          <span className={styles.savedDocumentInfo}>
                            <strong title={document.name}>{document.name}</strong>
                            <span>
                              {document.format} · {formatCvFileSize(document.size)}
                            </span>
                            <span>Tersimpan di akun</span>
                          </span>
                          <Badge variant="neutral">{document.format}</Badge>
                        </label>
                      ))
                    )}
                    {cvDocuments.length >= MAX_SAVED_CVS && (
                      <p role="status">
                        Batas 5 CV tersimpan tercapai. Hapus CV melalui halaman
                        CV sebelum mengunggah lagi.
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    aria-labelledby="upload-cv-tab"
                    className={styles.uploadPanel}
                    id="upload-cv-panel"
                    role="tabpanel"
                  >
                    <UploadZone
                      file={selectedFile}
                      fileError={fileError}
                      onFileSelect={handleFileSelect}
                    />
                  </div>
                )}

                <Card className={styles.requirementCard} padding="compact">
                  <span className={styles.requirementIcon} aria-hidden="true">
                    <Info size={18} />
                  </span>
                  <div>
                    <strong>Ketentuan Dokumen</strong>
                    <p>
                      Format PDF atau DOCX, maksimum 10 MiB per file dan 5 CV
                      tersimpan.
                    </p>
                    <span>
                      Batas analisis adalah 3 permintaan per 24 jam. Kuota
                      diterapkan backend.
                    </span>
                  </div>
                </Card>

                <div className={styles.chooseActions}>
                  <Button
                    disabled={!canStartAnalysis}
                    leadingIcon={<UploadCloud size={17} />}
                    onClick={handleStartAnalysis}
                    type="button"
                  >
                    Mulai Analisis
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={cancelSelection}
                    type="button"
                    variant="outline"
                  >
                    Batal
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        <AnalyzerSidebar
          error={historyError}
          history={historyRecords}
          loading={historyLoading}
          onOpenHistory={openHistory}
          onOpenRecord={openHistoryRecord}
          onRetryLoad={retryHistory}
          selectedAnalysisId={historyDetailLoadingId}
        />
      </div>

      <Link
        className={styles.backToDashboard}
        to={routePaths.applicant.dashboard}
      >
        Kembali ke Dashboard Pelamar
      </Link>
    </section>
  )
}
