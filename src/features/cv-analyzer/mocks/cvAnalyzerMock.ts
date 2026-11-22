import type {
  AnalysisRecord,
  CvAnalysisResult,
  CvDocument,
} from '../types/cvAnalyzer'

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export const MAX_CV_FILE_SIZE = 5 * 1024 * 1024

export const savedCvDocuments: CvDocument[] = [
  {
    id: 'cv-sarah-product',
    name: 'CV_Sarah_Wijaya_Product_Designer.pdf',
    format: 'PDF',
    size: 2_450_000,
    uploadedAt: daysAgo(2),
  },
  {
    id: 'cv-sarah-ux',
    name: 'Sarah_Wijaya_UX_Designer.docx',
    format: 'DOCX',
    size: 1_620_000,
    uploadedAt: daysAgo(9),
  },
  {
    id: 'cv-sarah-general',
    name: 'CV_Sarah_Wijaya_2025.pdf',
    format: 'PDF',
    size: 3_120_000,
    uploadedAt: daysAgo(24),
  },
]

export const initialAnalysisHistory: AnalysisRecord[] = [
  {
    ...savedCvDocuments[0],
    analysisId: 'demo-analysis-completed',
    analyzedAt: daysAgo(1),
    status: 'COMPLETED',
  },
  {
    ...savedCvDocuments[1],
    analysisId: 'demo-analysis-processing',
    analyzedAt: daysAgo(3),
    status: 'PROCESSING',
  },
  {
    ...savedCvDocuments[2],
    analysisId: 'demo-analysis-failed',
    analyzedAt: daysAgo(7),
    status: 'FAILED',
  },
]

export const mockAnalysisResult: CvAnalysisResult = {
  score: 82,
  summary:
    'Contoh evaluasi simulasi. CV menampilkan pengalaman relevan dan struktur yang jelas; hasil ini bukan analisis AI sungguhan.',
  strengths: [
    'Pengalaman kerja disusun dengan urutan yang mudah dipahami.',
    'Portofolio dan keterampilan utama terlihat relevan dengan posisi yang dituju.',
    'Pencapaian telah dicantumkan pada beberapa pengalaman kerja.',
  ],
  weaknesses: [
    'Beberapa pencapaian belum didukung angka atau dampak yang spesifik.',
    'Ringkasan profil dapat dibuat lebih terarah ke posisi yang dilamar.',
    'Konsistensi format tanggal perlu ditinjau kembali.',
  ],
  recommendations: [
    'Tambahkan hasil terukur untuk menjelaskan dampak pekerjaan.',
    'Sesuaikan ringkasan profesional dengan deskripsi posisi tujuan.',
    'Periksa kembali konsistensi format, ejaan, dan tautan portofolio.',
  ],
}

export const mockAnalysisFailure = {
  message:
    'Simulasi gagal untuk memperlihatkan tampilan error. Dokumen tidak diunggah atau dikirim ke layanan AI.',
  details:
    'DEMO_ANALYSIS_FAILED\nAlur ini menggunakan hasil mock lokal. Tidak ada request backend yang dibuat.',
}
