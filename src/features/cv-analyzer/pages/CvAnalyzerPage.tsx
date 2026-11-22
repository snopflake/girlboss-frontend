import { FileText, Info, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import {
  Badge,
  Button,
  Card,
} from '../../../design-system/components'
import { AnalyzerSidebar } from '../components/AnalyzerSidebar'
import { FailureView } from '../components/FailureView'
import { HistoryView } from '../components/HistoryView'
import { ProcessingView } from '../components/ProcessingView'
import { ResultView } from '../components/ResultView'
import { UploadZone } from '../components/UploadZone'
import {
  initialAnalysisHistory,
  MAX_CV_FILE_SIZE,
  mockAnalysisFailure,
  mockAnalysisResult,
  savedCvDocuments,
} from '../mocks/cvAnalyzerMock'
import type {
  AnalysisOutcome,
  AnalysisRecord,
  AnalysisStatus,
  CvAnalyzerScreen,
  CvAnalyzerView,
  CvDocument,
  CvFileError,
  CvSource,
} from '../types/cvAnalyzer'
import { formatCvDate, formatCvFileSize } from '../utils/cvFormatters'
import styles from './CvAnalyzerPage.module.css'

type HistoryStatusFilter = 'ALL' | AnalysisStatus

function isSupportedFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension === 'pdf' || extension === 'docx'
}

function toDocument(file: File): CvDocument {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return {
    id: `upload-${Date.now()}`,
    name: file.name,
    format: extension === 'docx' ? 'DOCX' : 'PDF',
    size: file.size,
    uploadedAt: new Date().toISOString(),
  }
}

export default function CvAnalyzerPage() {
  const [view, setView] = useState<CvAnalyzerView>('analyzer')
  const [screen, setScreen] = useState<CvAnalyzerScreen>('choose')
  const [source, setSource] = useState<CvSource>('saved')
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(
    savedCvDocuments[0]?.id ?? null,
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<CvFileError | null>(null)
  const [history, setHistory] = useState<AnalysisRecord[]>(() => [
    ...initialAnalysisHistory,
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<HistoryStatusFilter>('ALL')
  const [demoOutcome, setDemoOutcome] =
    useState<AnalysisOutcome>('COMPLETED')
  const [activeDocument, setActiveDocument] = useState<CvDocument | null>(null)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(
    null,
  )
  const [analyzedAt, setAnalyzedAt] = useState(new Date().toISOString())
  const [progress, setProgress] = useState(0)
  const [cancelled, setCancelled] = useState(false)

  const selectedSavedDocument = useMemo(
    () => savedCvDocuments.find(({ id }) => id === selectedSavedId) ?? null,
    [selectedSavedId],
  )

  useEffect(() => {
    if (screen !== 'processing' || !activeDocument || !currentAnalysisId) {
      return
    }

    if (progress >= 100) {
      const completionTimer = window.setTimeout(() => {
        const completedAt = new Date().toISOString()
        setAnalyzedAt(completedAt)
        setHistory((records) =>
          records.map((record) =>
            record.analysisId === currentAnalysisId
              ? { ...record, status: demoOutcome, analyzedAt: completedAt }
              : record,
          ),
        )
        setScreen(demoOutcome === 'COMPLETED' ? 'result' : 'failure')
      }, 350)

      return () => window.clearTimeout(completionTimer)
    }

    const progressTimer = window.setTimeout(() => {
      setProgress((current) => Math.min(current + 16, 100))
    }, 350)

    return () => window.clearTimeout(progressTimer)
  }, [
    activeDocument,
    currentAnalysisId,
    demoOutcome,
    progress,
    screen,
  ])

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

  function startAnalysis(
    document: CvDocument | null = source === 'saved'
      ? selectedSavedDocument
      : selectedFile && !fileError
        ? toDocument(selectedFile)
        : null,
    existingAnalysisId?: string,
  ) {
    if (!document) return

    const startedAt = new Date().toISOString()
    const analysisId = existingAnalysisId ?? `analysis-${Date.now()}`
    const processingRecord: AnalysisRecord = {
      ...document,
      analysisId,
      analyzedAt: startedAt,
      status: 'PROCESSING',
    }

    setHistory((records) =>
      existingAnalysisId
        ? records.map((record) =>
            record.analysisId === existingAnalysisId
              ? processingRecord
              : record,
          )
        : [processingRecord, ...records],
    )
    setView('analyzer')
    setActiveDocument(document)
    setCurrentAnalysisId(analysisId)
    setAnalyzedAt(startedAt)
    setProgress(0)
    setCancelled(false)
    setScreen('processing')
  }

  function cancelAnalysis() {
    if (currentAnalysisId) {
      setHistory((records) =>
        records.filter((record) => record.analysisId !== currentAnalysisId),
      )
    }
    setCurrentAnalysisId(null)
    setActiveDocument(null)
    setProgress(0)
    setCancelled(true)
    setScreen('choose')
  }

  function resetForNewDocument() {
    setView('analyzer')
    setScreen('choose')
    setSource('upload')
    setSelectedFile(null)
    setFileError(null)
    setActiveDocument(null)
    setCurrentAnalysisId(null)
    setCancelled(false)
  }

  function cancelSelection() {
    setSource('saved')
    setSelectedFile(null)
    setFileError(null)
    setSelectedSavedId(null)
    setCancelled(false)
  }

  function openRecord(record: AnalysisRecord) {
    setView('analyzer')
    setActiveDocument(record)
    setCurrentAnalysisId(record.analysisId)
    setAnalyzedAt(record.analyzedAt)
    setCancelled(false)

    if (record.status === 'COMPLETED') {
      setScreen('result')
    } else if (record.status === 'FAILED') {
      setScreen('failure')
    } else {
      setProgress(40)
      setScreen('processing')
    }
  }

  function retryRecord(record: AnalysisRecord) {
    startAnalysis(record)
  }

  function handleHistoryStatusChange(value: HistoryStatusFilter) {
    setStatusFilter(value)
  }

  const canStartAnalysis =
    source === 'saved'
      ? Boolean(selectedSavedDocument)
      : Boolean(selectedFile) && fileError === null

  return (
    <section className={styles.page} aria-labelledby="cv-analyzer-title">
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>Ruang karier pelamar</div>
          <h1 id="cv-analyzer-title">
            {view === 'history' ? 'Riwayat Analisis' : 'AI CV Analyzer'}
          </h1>
          <p>
            {view === 'history'
              ? 'Tinjau dan kelola hasil analisis CV simulasi.'
              : 'Tinjau CV dan temukan peluang untuk menyempurnakan profil profesionalmu.'}
          </p>
        </div>
        {view === 'history' && (
          <Button
            leadingIcon={<UploadCloud size={17} />}
            onClick={resetForNewDocument}
            type="button"
          >
            Analisis CV Baru
          </Button>
        )}
      </header>

      {cancelled && view === 'analyzer' && (
        <div className={styles.cancelNotice} role="status">
          Simulasi analisis dibatalkan. Dokumen belum dikirim ke layanan AI.
        </div>
      )}

      <div className={styles.workspace}>
        <div className={styles.primaryColumn}>
          {view === 'history' ? (
            <HistoryView
              history={history}
              onAnalyzeNew={resetForNewDocument}
              onClearDemoHistory={() => setHistory([])}
              onOpenRecord={openRecord}
              onRetry={retryRecord}
              onSearchTermChange={setSearchTerm}
              onStatusFilterChange={handleHistoryStatusChange}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ) : screen === 'processing' && activeDocument ? (
            <ProcessingView
              documentName={activeDocument.name}
              onCancel={cancelAnalysis}
              progress={progress}
            />
          ) : screen === 'result' && activeDocument ? (
            <ResultView
              analyzedAt={analyzedAt}
              documentName={activeDocument.name}
              onAnalyzeAgain={() => startAnalysis(activeDocument)}
              onBackToHistory={() => setView('history')}
              onUploadNew={resetForNewDocument}
              result={mockAnalysisResult}
            />
          ) : screen === 'failure' && activeDocument ? (
            <FailureView
              details={mockAnalysisFailure.details}
              documentName={activeDocument.name}
              message={mockAnalysisFailure.message}
              onChooseAnother={resetForNewDocument}
              onRetry={() => startAnalysis(activeDocument)}
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
                    {savedCvDocuments.map((document) => (
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
                          <span>Diunggah {formatCvDate(document.uploadedAt)}</span>
                        </span>
                        <Badge variant="neutral">{document.format}</Badge>
                      </label>
                    ))}
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
                      Format yang didukung PDF dan DOCX. Ukuran file maksimum
                      5 MB.
                    </p>
                    <span>
                      Validasi ini berjalan lokal dan perlu diselaraskan dengan
                      batas backend.
                    </span>
                  </div>
                </Card>

                <div className={styles.chooseActions}>
                  <Button
                    disabled={!canStartAnalysis}
                    leadingIcon={<UploadCloud size={17} />}
                    onClick={() => startAnalysis()}
                    type="button"
                  >
                    Mulai Analisis
                  </Button>
                  <Button
                    onClick={cancelSelection}
                    type="button"
                    variant="outline"
                  >
                    Batal
                  </Button>
                </div>
                <p className={styles.simulationNotice} role="note">
                  Demo UI saja. Berkas tidak diunggah atau dianalisis oleh AI.
                </p>
              </Card>
            </div>
          )}
        </div>

        <AnalyzerSidebar
          demoOutcome={demoOutcome}
          history={history}
          onDemoOutcomeChange={setDemoOutcome}
          onOpenHistory={() => setView('history')}
          onOpenRecord={openRecord}
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
