// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { authSessionStorageKey } from '../../auth/api/authApi'
import {
  createInterviewSession,
  listInterviewSessions,
  submitInterviewAudioAnswer,
} from '../api/interviewApi'
import InterviewPage from './InterviewPage'

const sessionId = 'c0d8c836-9244-4ba0-9c0e-27f451a59922'
const questions = [
  'Ceritakan pengalaman yang paling relevan dengan posisi ini.',
  'Bagaimana Anda menyelesaikan tantangan penting dalam pekerjaan?',
  'Ceritakan cara Anda berkolaborasi dengan tim lintas fungsi.',
  'Apa pencapaian kerja yang paling Anda banggakan dan mengapa?',
  'Apa yang membuat Anda tertarik pada posisi pekerjaan ini?',
].map((questionText, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  questionText,
  sequenceNumber: index + 1,
  answer: null,
}))

function createdSession(jobTitle = 'Product Designer') {
  return {
    success: true,
    message: 'Sesi wawancara berhasil dibuat.',
    data: {
      id: sessionId,
      jobTitle,
      status: 'IN_PROGRESS',
      startedAt: '2026-11-28T00:00:00.000Z',
      questions,
      summary: null,
    },
  }
}

const evaluationResult = {
  dimensions: {
    relevance: { score: 4, feedback: 'Jawaban relevan dengan pertanyaan.' },
    clarity: { score: 4, feedback: 'Alur jawaban mudah diikuti.' },
    completeness: { score: 3, feedback: 'Tambahkan detail hasil.' },
    delivery: { score: 4, feedback: 'Penyampaian terstruktur.' },
  },
  overallFeedback: 'Evaluasi umum aktual dari Gemini.',
  improvementTips: ['Sertakan hasil kerja yang terukur.'],
}

const interviewSummary = {
  answeredQuestions: 5,
  totalQuestions: 5,
  averageScore: 82.4,
  dimensionAverages: {
    relevance: 4,
    clarity: 4,
    completeness: 3.6,
    delivery: 4.2,
  },
  improvementTips: ['Sertakan hasil kerja yang terukur.'],
}

const measuredSpeechMetrics = {
  durationSeconds: 12,
  durationStatus: 'MEASURED',
  wordCount: 30,
  wordsPerMinute: 150,
  speechRateStatus: 'MEASURED',
  pauseCount: 1,
  totalPauseSeconds: 0.8,
  pauseStatus: 'ESTIMATED_FROM_SEGMENTS',
  pauseSource: 'WHISPER_SEGMENT_TIMESTAMPS',
  pauseThresholdSeconds: 0.6,
  pitchMedianHz: 190,
  pitchVariation: 2.4,
  pitchVariationUnit: 'semitones',
  voicedFrameCount: 40,
  pitchStatus: 'MEASURED',
  pitchFeedback: 'Gunakan variasi pitch sebagai bahan observasi intonasi latihan.',
  deliveryFeedback: 'Kecepatan terukur sekitar 150 kata per menit.',
}

function answerRecord(
  index: number,
  answerText: string,
  speechMetrics?: Record<string, unknown>,
) {
  return {
    id: `11111111-1111-4111-8111-${String(index + 1).padStart(12, '0')}`,
    answerText,
    submittedAt: '2026-11-28T00:05:00.000Z',
    evaluation: {
      score: 82,
      evaluatedAt: '2026-11-28T00:05:00.000Z',
      result: evaluationResult,
      ...(speechMetrics ? { speechMetrics } : {}),
    },
  }
}

function interviewSessionRecord(
  answerTexts: string[],
  status = 'IN_PROGRESS',
  summary: typeof interviewSummary | null = null,
) {
  return {
    ...createdSession().data,
    status,
    questions: questions.map((question, index) => ({
      ...question,
      answer:
        answerTexts[index] === undefined
          ? null
          : answerRecord(index, answerTexts[index]!),
    })),
    summary,
  }
}

function answerResponse(
  index: number,
  answerText: string,
  speechMetrics?: Record<string, unknown>,
) {
  return {
    success: true,
    message: 'Jawaban berhasil dievaluasi.',
    data: { answer: answerRecord(index, answerText, speechMetrics) },
  }
}

function completedSessionResponse() {
  return {
    success: true,
    message: 'Sesi wawancara berhasil diselesaikan.',
    data: {
      session: interviewSessionRecord(
        questions.map((_question, index) => `Jawaban nyata ${index + 1}.`),
        'COMPLETED',
        interviewSummary,
      ),
      summary: interviewSummary,
    },
  }
}

function jsonResponse(body: unknown, status = 201) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function mockFetch(
  handler: (
    url: string,
    init?: RequestInit,
  ) => Response | Promise<Response>,
  historyBody: unknown = {
    success: true,
    message: 'Riwayat wawancara berhasil diambil.',
    data: {
      sessions: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    },
  },
  historyStatus = 200,
) {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/api/interview-sessions?')) {
        return jsonResponse(historyBody, historyStatus)
      }
      return handler(url, init)
    },
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function setAuthenticatedSession() {
  window.sessionStorage.setItem(authSessionStorageKey, 'test-access-token')
}

function renderPage() {
  return render(
    <MemoryRouter>
      <InterviewPage />
    </MemoryRouter>,
  )
}

function sessionDetailResponse(session: ReturnType<typeof interviewSessionRecord>) {
  return {
    success: true,
    message: 'Detail sesi wawancara berhasil diambil.',
    data: session,
  }
}

afterEach(() => {
  cleanup()
  window.sessionStorage.clear()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Interview setup API integration', () => {
  it('creates a session with the selected job and renders backend questions', async () => {
    setAuthenticatedSession()
    let resolveResponse: ((response: Response) => void) | undefined
    const fetchMock = mockFetch(
      () =>
        new Promise<Response>((resolve) => {
          resolveResponse = resolve
        }),
    )

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(await screen.findByText('Menunggu pertanyaan dari layanan AI...')).toBeTruthy()
    resolveResponse?.(jsonResponse(createdSession()))

    expect(await screen.findByText(questions[0]!.questionText)).toBeTruthy()
    expect(screen.getByText('Pertanyaan 1 dari 5')).toBeTruthy()

    const [requestUrl, requestInit] = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith('/api/interview-sessions'),
    )!
    expect(String(requestUrl)).toContain('/api/interview-sessions')
    expect(requestInit?.method).toBe('POST')
    expect(requestInit?.body).toBe(
      JSON.stringify({ jobTitle: 'Product Designer' }),
    )
    expect(
      new Headers(requestInit?.headers).get('Authorization'),
    ).toBe('Bearer test-access-token')
  })

  it('sends a manually entered job title to the backend', async () => {
    setAuthenticatedSession()
    const fetchMock = mockFetch(() => jsonResponse(createdSession('UX Researcher')))

    renderPage()
    fireEvent.click(screen.getByRole('tab', { name: 'Tulis Manual' }))
    fireEvent.change(screen.getByLabelText('Posisi Pekerjaan'), {
      target: { value: 'UX Researcher' },
    })
    fireEvent.change(screen.getByLabelText('Tingkat Pengalaman'), {
      target: { value: 'JUNIOR' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(await screen.findByText(questions[0]!.questionText)).toBeTruthy()
    const createCall = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith('/api/interview-sessions'),
    )
    expect(createCall?.[1]?.body).toBe(
      JSON.stringify({ jobTitle: 'UX Researcher' }),
    )
  })

  it('shows quota errors without creating or displaying fallback questions', async () => {
    setAuthenticatedSession()
    mockFetch(() =>
      jsonResponse(
        {
          success: false,
          message: 'Kuota sesi wawancara telah tercapai.',
          errors: null,
        },
        429,
      ),
    )

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(
      await screen.findByText('Kuota sesi wawancara telah tercapai.'),
    ).toBeTruthy()
    expect(screen.queryByText(questions[0]!.questionText)).toBeNull()
    expect(screen.queryByText('Pertanyaan 1 dari 5')).toBeNull()
  })

  it('rejects malformed success responses rather than displaying incomplete questions', async () => {
    setAuthenticatedSession()
    const malformed = createdSession()
    malformed.data.questions = malformed.data.questions.slice(0, 4)
    mockFetch(() => jsonResponse(malformed))

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(
      await screen.findByText('Format respons layanan wawancara tidak valid.'),
    ).toBeTruthy()
    expect(screen.queryByText(questions[0]!.questionText)).toBeNull()
  })

  it('rejects backend question fields that do not match the frontend API contract', async () => {
    setAuthenticatedSession()
    const validResponse = createdSession()
    const { questionText, ...question } = validResponse.data.questions[0]!
    const mismatchedResponse = {
      ...validResponse,
      data: {
        ...validResponse.data,
        questions: [
          { ...question, question_text: questionText },
          ...validResponse.data.questions.slice(1),
        ],
      },
    }
    mockFetch(() => jsonResponse(mismatchedResponse))

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(
      await screen.findByText('Format respons layanan wawancara tidak valid.'),
    ).toBeTruthy()
    expect(screen.queryByText(questions[0]!.questionText)).toBeNull()
  })

  it('reports network errors without inventing a session', async () => {
    setAuthenticatedSession()
    mockFetch(() => {
      throw new TypeError('Failed to fetch')
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))

    expect(
      await screen.findByText(
        'Tidak dapat terhubung ke layanan wawancara. Periksa koneksi dan coba lagi.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText(questions[0]!.questionText)).toBeNull()
  })

  it('turns an API request timeout into a clear error', async () => {
    setAuthenticatedSession()
    vi.useFakeTimers()
    mockFetch((_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      }),
    )

    const request = createInterviewSession('Product Designer')
    const rejection = expect(request).rejects.toThrow(
      'Permintaan ke layanan wawancara melewati batas waktu. Silakan coba lagi.',
    )
    await vi.advanceTimersByTimeAsync(60_000)
    await rejection
  })
})

describe('Interview answers and evaluation API integration', () => {
  it('submits the real session and question IDs, then renders the backend evaluation', async () => {
    setAuthenticatedSession()
    let resolveAnswer: ((response: Response) => void) | undefined
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/api/interview-sessions')) {
        return jsonResponse(createdSession())
      }
      if (url.endsWith('/api/interview-sessions/' + sessionId + '/answers')) {
        return new Promise<Response>((resolve) => {
          resolveAnswer = resolve
        })
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))
    await screen.findByText(questions[0]!.questionText)
    fireEvent.change(screen.getByLabelText('Jawaban Kamu'), {
      target: { value: 'Saya menyusun solusi dan mengukur dampak pekerjaan.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Kirim Jawaban' }))

    expect(await screen.findByText('Gemini sedang mengevaluasi jawaban...')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Kirim Jawaban' }).hasAttribute('disabled'),
    ).toBe(true)
    resolveAnswer?.(
      jsonResponse(
        answerResponse(0, 'Saya menyusun solusi dan mengukur dampak pekerjaan.'),
        200,
      ),
    )

    expect(await screen.findByText(evaluationResult.overallFeedback)).toBeTruthy()
    expect(screen.getByText('Skor AI: 82/100')).toBeTruthy()
    expect(screen.getByText('Penyampaian · 4/5')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Jawab Ulang' })).toBeNull()

    const answerCall = fetchMock.mock.calls.find(([input]) =>
      String(input).endsWith(`/api/interview-sessions/${sessionId}/answers`),
    )
    expect(answerCall?.[1]?.method).toBe('POST')
    expect(answerCall?.[1]?.body).toBe(
      JSON.stringify({
        questionId: questions[0]!.id,
        answerText: 'Saya menyusun solusi dan mengukur dampak pekerjaan.',
      }),
    )
  })

  it('recovers a saved answer before retrying and does not submit it twice', async () => {
    setAuthenticatedSession()
    let answerRequests = 0
    let detailRequests = 0
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/api/interview-sessions')) {
        return jsonResponse(createdSession())
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}/answers`)) {
        answerRequests += 1
        throw new TypeError('Failed to fetch')
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}`)) {
        detailRequests += 1
        return jsonResponse(
          sessionDetailResponse(
            interviewSessionRecord(['Jawaban yang sudah tersimpan.']),
          ),
          200,
        )
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))
    await screen.findByText(questions[0]!.questionText)
    fireEvent.change(screen.getByLabelText('Jawaban Kamu'), {
      target: { value: 'Jawaban yang sudah tersimpan.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Kirim Jawaban' }))
    expect(
      await screen.findByText(
        'Tidak dapat terhubung ke layanan wawancara. Periksa koneksi dan coba lagi.',
      ),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Cek status & coba lagi' }))
    expect(await screen.findByText(evaluationResult.overallFeedback)).toBeTruthy()
    expect(answerRequests).toBe(1)
    expect(detailRequests).toBe(1)
    expect(fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith(`/api/interview-sessions/${sessionId}/answers`),
    )).toHaveLength(1)
  })

  it('preserves the answer and progress after a 429, then safely retries', async () => {
    setAuthenticatedSession()
    let answerRequests = 0
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/api/interview-sessions')) {
        return jsonResponse(createdSession())
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}/answers`)) {
        answerRequests += 1
        if (answerRequests === 1) {
          return jsonResponse(
            {
              success: false,
              message: 'Batas evaluasi sementara tercapai.',
              errors: null,
            },
            429,
          )
        }
        return jsonResponse(answerResponse(0, 'Jawaban yang dapat dicoba lagi.'), 200)
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}`)) {
        return jsonResponse(sessionDetailResponse(interviewSessionRecord([])), 200)
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))
    await screen.findByText(questions[0]!.questionText)
    fireEvent.change(screen.getByLabelText('Jawaban Kamu'), {
      target: { value: 'Jawaban yang dapat dicoba lagi.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Kirim Jawaban' }))
    expect(
      await screen.findByText('Batas evaluasi sementara tercapai.'),
    ).toBeTruthy()
    expect(screen.getByText('0 dari 5 dijawab')).toBeTruthy()
    expect(screen.getByText('Jawaban yang dapat dicoba lagi.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Cek status & coba lagi' }))
    expect(await screen.findByText(evaluationResult.overallFeedback)).toBeTruthy()
    expect(screen.getByText('1 dari 5 dijawab')).toBeTruthy()
    expect(answerRequests).toBe(2)
    expect(fetchMock.mock.calls.some(([url]) =>
      String(url).endsWith(`/api/interview-sessions/${sessionId}`),
    )).toBe(true)
  })

  it('completes only after all answers and displays the backend summary', async () => {
    setAuthenticatedSession()
    let completeRequests = 0
    const answerBodies: unknown[] = []
    const fetchMock = mockFetch((url, init) => {
      if (url.endsWith('/api/interview-sessions')) {
        return jsonResponse(createdSession())
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}/answers`)) {
        const body = JSON.parse(String(init?.body)) as {
          questionId: string
          answerText: string
        }
        const questionIndex = questions.findIndex(
          (question) => question.id === body.questionId,
        )
        answerBodies.push(body)
        return jsonResponse(answerResponse(questionIndex, body.answerText), 200)
      }
      if (url.endsWith(`/api/interview-sessions/${sessionId}/complete`)) {
        completeRequests += 1
        if (completeRequests === 1) {
          return jsonResponse(
            {
              success: false,
              message: 'Penyelesaian sesi sementara gagal.',
              errors: null,
            },
            503,
          )
        }
        return jsonResponse(completedSessionResponse(), 200)
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Simulasi' }))
    for (let index = 0; index < questions.length; index += 1) {
      await screen.findByText(questions[index]!.questionText)
      fireEvent.change(screen.getByLabelText('Jawaban Kamu'), {
        target: { value: `Jawaban nyata ${index + 1}.` },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Kirim Jawaban' }))
      await screen.findByText(evaluationResult.overallFeedback)
      if (index < questions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Pertanyaan Berikutnya' }))
      }
    }

    fireEvent.click(screen.getByRole('button', { name: 'Selesaikan Pertanyaan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Selesaikan Sesi' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ya, Selesaikan Sesi' }))
    expect(await screen.findByText('Penyelesaian sesi sementara gagal.')).toBeTruthy()
    expect(screen.queryByText('Hasil dari backend')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Ya, Selesaikan Sesi' }))
    expect(await screen.findByText('Hasil dari backend')).toBeTruthy()
    expect(screen.getByText('82.4/100')).toBeTruthy()
    expect(screen.queryByText('Metrik penyampaian')).toBeNull()
    expect(screen.getAllByText('Sertakan hasil kerja yang terukur.').length).toBeGreaterThan(0)
    expect(answerBodies).toHaveLength(5)
    expect(completeRequests).toBe(2)
    expect(fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith(`/api/interview-sessions/${sessionId}/complete`),
    )).toHaveLength(2)
  })
})

describe('Interview history and audio API integration', () => {
  it('shows a real API error instead of an empty-history success state', async () => {
    setAuthenticatedSession()
    const fetchMock = mockFetch(
      () => {
        throw new Error('Unexpected non-history request.')
      },
      {
        success: false,
        message: 'Riwayat wawancara sedang tidak tersedia.',
        errors: null,
      },
      503,
    )

    renderPage()

    expect(
      await screen.findByText('Riwayat wawancara sedang tidak tersedia.'),
    ).toBeTruthy()
    expect(screen.queryByText('Belum ada sesi latihan.')).toBeNull()
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('GET')
  })

  it('loads real history, fetches selected details, and shows only returned voice metrics', async () => {
    setAuthenticatedSession()
    const completedRecord = {
      ...interviewSessionRecord(
        questions.map((_question, index) => `Jawaban tersimpan ${index + 1}.`),
        'COMPLETED',
        interviewSummary,
      ),
      questions: questions.map((question, index) => ({
        ...question,
        answer: answerRecord(
          index,
          `Transkrip tersimpan ${index + 1}.`,
          index === 0 ? measuredSpeechMetrics : undefined,
        ),
      })),
    }
    const historyBody = {
      success: true,
      message: 'Riwayat wawancara berhasil diambil.',
      data: {
        sessions: [completedRecord],
        pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
      },
    }
    const fetchMock = mockFetch((url) => {
      if (url.endsWith(`/api/interview-sessions/${sessionId}`)) {
        return jsonResponse(sessionDetailResponse(completedRecord), 200)
      }
      throw new Error(`Unexpected request: ${url}`)
    }, historyBody)

    renderPage()
    fireEvent.click(await screen.findByRole('button', { name: /Lihat semua sesi/ }))

    const historyRow = await screen.findByRole('row', {
      name: /Product Designer/,
    })
    expect(historyRow.textContent?.replace(/\s/g, '')).toContain('5/5')
    fireEvent.click(screen.getByRole('button', { name: 'Ringkasan' }))
    expect(await screen.findByText('82.4/100')).toBeTruthy()
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).endsWith(`/api/interview-sessions/${sessionId}`),
      ),
    ).toBe(true)

    fireEvent.click(screen.getByText('Pertanyaan 1'))
    expect(await screen.findByText('Transkrip Whisper')).toBeTruthy()
    expect(screen.getByText('190 Hz')).toBeTruthy()
    expect(
      screen.getByText(
        /estimasi timestamp segmen Whisper, bukan deteksi hening akustik/,
      ),
    ).toBeTruthy()
  })

  it('requests the selected history page and validates its pagination response', async () => {
    setAuthenticatedSession()
    const historyBody = {
      success: true,
      message: 'Riwayat wawancara berhasil diambil.',
      data: {
        sessions: [],
        pagination: { page: 2, pageSize: 7, total: 12, totalPages: 2 },
      },
    }
    const fetchMock = mockFetch(() => {
      throw new Error('The history request should be handled by the test response.')
    }, historyBody)

    const result = await listInterviewSessions(2, 7)

    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 7,
      total: 12,
      totalPages: 2,
    })
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      '/api/interview-sessions?page=2&pageSize=7',
    )
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('GET')
  })

  it('sends WAV PCM as multipart audio and accepts the backend transcription metrics', async () => {
    setAuthenticatedSession()
    const fetchMock = mockFetch((url) => {
      if (url.endsWith(`/api/interview-sessions/${sessionId}/audio-answers`)) {
        return jsonResponse(
          answerResponse(0, 'Transkrip Whisper dari rekaman.', measuredSpeechMetrics),
          200,
        )
      }
      throw new Error(`Unexpected request: ${url}`)
    })
    const audio = new File([new Uint8Array([82, 73, 70, 70])], 'answer.wav', {
      type: 'audio/wav',
    })

    const answer = await submitInterviewAudioAnswer(
      sessionId,
      questions[0]!.id,
      audio,
    )

    const [requestUrl, requestInit] = fetchMock.mock.calls[0]!
    const formData = requestInit?.body as FormData
    expect(String(requestUrl)).toContain(
      `/api/interview-sessions/${sessionId}/audio-answers`,
    )
    expect(requestInit?.method).toBe('POST')
    expect(formData.get('questionId')).toBe(questions[0]!.id)
    expect(formData.get('audio')).toBeInstanceOf(File)
    expect(new Headers(requestInit?.headers).get('Authorization')).toBe(
      'Bearer test-access-token',
    )
    expect(new Headers(requestInit?.headers).has('Content-Type')).toBe(false)
    expect(answer.answerText).toBe('Transkrip Whisper dari rekaman.')
    expect(answer.evaluation.speechMetrics?.pitchStatus).toBe('MEASURED')
  })
})
