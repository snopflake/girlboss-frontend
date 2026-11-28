export type AnalysisStatus = 'COMPLETED' | 'PROCESSING' | 'FAILED'
export type CvAnalyzerScreen = 'choose' | 'processing' | 'result' | 'failure'
export type CvAnalyzerView = 'analyzer' | 'history'
export type CvSource = 'saved' | 'upload'

export interface CvDocument {
  id: string
  name: string
  format: 'PDF' | 'DOCX'
  size: number
  uploadedAt?: string
}

export interface AnalysisRecord {
  analysisId: string
  cvId: string
  name: string
  analyzedAt: string
  status: AnalysisStatus
}

export interface CvAnalysisResult {
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export type CvFileError = 'unsupported-format' | 'too-large'
