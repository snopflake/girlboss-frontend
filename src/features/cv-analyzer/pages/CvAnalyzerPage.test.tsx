// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { authSessionStorageKey } from '../../auth/api/authApi'
import CvAnalyzerPage from './CvAnalyzerPage'

const cvId = 'c0d8c836-9244-4ba0-9c0e-27f451a59922'

const cvMetadata = {
  id: cvId,
  fileName: 'resume.pdf',
  fileSize: 1_024,
  mimeType: 'application/pdf',
}

const analysisResult = {
  score: 82,
  summary: 'CV memiliki struktur yang jelas dan pengalaman yang relevan.',
  strengths: ['Pengalaman kerja mudah dipahami.'],
  weaknesses: ['Pencapaian belum didukung angka.'],
  recommendations: ['Tambahkan hasil terukur pada pengalaman kerja.'],
}

function historyResponse(analyses: unknown[] = [], page = 1, total = 0) {
  return {
    success: true,
    message: 'Riwayat analisis CV berhasil diambil.',
    data: {
      analyses,
      pagination: {
        page,
        pageSize: 10,
        total,
        totalPages: Math.ceil(total / 10),
      },
    },
  }
}

function historyItem(
  id: string,
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED',
) {
  return {
    id,
    cvId,
    status,
    requestedAt: '2026-11-28T00:00:00.000Z',
    result: status === 'COMPLETED' ? analysisResult : null,
  }
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function renderPage() {
  return render(
    <MemoryRouter>
      <CvAnalyzerPage />
    </MemoryRouter>,
  )
}

function setAuthenticatedSession() {
  window.sessionStorage.setItem(authSessionStorageKey, 'test-access-token')
}

function mockFetch(
  handler: (
    url: string,
    init?: RequestInit,
  ) => Response | Promise<Response>,
) {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) =>
      handler(String(input), init),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  cleanup()
  window.sessionStorage.clear()
  vi.unstubAllGlobals()
})

describe('CV Analyzer API integration', () => {
  it('loads saved CVs and displays the actual backend analysis result', async () => {
    setAuthenticatedSession()
    const fetchMock = mockFetch((url, init) => {
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(historyResponse())
      }
      if (
        url.endsWith('/api/applicant/cvs') &&
        init?.method !== 'POST'
      ) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [cvMetadata] },
        })
      }
      if (url.endsWith('/api/cv-analyses')) {
        return jsonResponse({
          success: true,
          message: 'Analisis CV berhasil diselesaikan.',
          data: {
            id: '32db86e5-c388-486e-b15e-f68f6095ec12',
            cvId,
            status: 'COMPLETED',
            requestedAt: '2026-11-28T00:00:00.000Z',
            result: analysisResult,
          },
        })
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    await screen.findAllByText('resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Analisis' }))

    expect(await screen.findByText(analysisResult.summary)).toBeTruthy()
    expect(screen.getByText('82')).toBeTruthy()
    expect(screen.queryByText(/simulasi/i)).toBeNull()

    const analysisCall = fetchMock.mock.calls.find(([input]) =>
      String(input).endsWith('/api/cv-analyses'),
    )
    expect(analysisCall).toBeTruthy()
    expect(analysisCall?.[1]?.method).toBe('POST')
    expect(
      new Headers(analysisCall?.[1]?.headers).get('Authorization'),
    ).toBe('Bearer test-access-token')
    expect(analysisCall?.[1]?.body).toBe(JSON.stringify({ cvId }))
  })

  it('uploads PDF through multipart and analyzes the returned CV id', async () => {
    setAuthenticatedSession()
    const fetchMock = mockFetch((url, init) => {
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(historyResponse())
      }
      if (
        url.endsWith('/api/applicant/cvs') &&
        init?.method !== 'POST'
      ) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [] },
        })
      }
      if (url.endsWith('/api/cv-analyses')) {
        return jsonResponse({
          success: true,
          message: 'Analisis CV berhasil diselesaikan.',
          data: {
            id: '32db86e5-c388-486e-b15e-f68f6095ec12',
            cvId,
            status: 'COMPLETED',
            requestedAt: '2026-11-28T00:00:00.000Z',
            result: analysisResult,
          },
        })
      }
      return jsonResponse({
        success: true,
        message: 'CV berhasil diunggah.',
        data: cvMetadata,
      }, 201)
    })

    renderPage()
    await screen.findByText('Belum ada CV tersimpan. Unggah CV untuk memulai.')
    fireEvent.click(screen.getByRole('tab', { name: 'Unggah CV Baru' }))
    fireEvent.change(screen.getByLabelText('Pilih CV untuk diunggah'), {
      target: {
        files: [
          new File([new Uint8Array([37, 80, 68, 70, 45])], 'resume.pdf', {
            type: 'application/pdf',
          }),
        ],
      },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Analisis' }))

    expect(await screen.findByText(analysisResult.summary)).toBeTruthy()
    const uploadCall = fetchMock.mock.calls.find(
      ([input, init]) =>
        String(input).endsWith('/api/applicant/cvs') && init?.method === 'POST',
    )
    expect(uploadCall?.[1]?.body).toBeInstanceOf(FormData)
    expect(
      (uploadCall?.[1]?.body as FormData | undefined)?.get('file'),
    ).toBeInstanceOf(File)
    expect(
      new Headers(uploadCall?.[1]?.headers).get('Content-Type'),
    ).toBeNull()

    const analysisCall = fetchMock.mock.calls.find(([input]) =>
      String(input).endsWith('/api/cv-analyses'),
    )
    expect(analysisCall?.[1]?.body).toBe(JSON.stringify({ cvId }))
  })

  it('shows backend quota errors without displaying a fabricated result', async () => {
    setAuthenticatedSession()
    mockFetch((url) => {
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(historyResponse())
      }
      if (url.endsWith('/api/applicant/cvs')) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [cvMetadata] },
        })
      }
      return jsonResponse(
        {
          success: false,
          message: 'Batas analisis CV 24 jam terakhir telah tercapai.',
          errors: null,
        },
        429,
      )
    })

    renderPage()
    await screen.findAllByText('resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Analisis' }))

    expect(
      await screen.findByText(
        'Batas analisis CV 24 jam terakhir telah tercapai.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText('Analisis Selesai')).toBeNull()
    fireEvent.click(screen.getByText('Detail Kesalahan'))
    expect(screen.getByText('HTTP 429')).toBeTruthy()
  })

  it('enforces the backend 10 MiB upload size limit in the existing upload UI', async () => {
    setAuthenticatedSession()
    mockFetch((url) => {
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(historyResponse())
      }
      return jsonResponse({
        success: true,
        message: 'Daftar CV berhasil diambil.',
        data: { cvs: [] },
      })
    })

    renderPage()
    await waitFor(() =>
      expect(
        screen.getByText('Belum ada CV tersimpan. Unggah CV untuk memulai.'),
      ).toBeTruthy(),
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Unggah CV Baru' }))
    fireEvent.change(screen.getByLabelText('Pilih CV untuk diunggah'), {
      target: {
        files: [
          new File(
            [new Uint8Array(10 * 1024 * 1024 + 1)],
            'oversized.pdf',
            { type: 'application/pdf' },
          ),
        ],
      },
    })

    expect(
      screen.getByText('Ukuran file melebihi batas maksimum 10 MiB.'),
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Mulai Analisis' }).hasAttribute('disabled'),
    ).toBe(true)
  })

  it('loads API history and fetches the selected analysis detail', async () => {
    setAuthenticatedSession()
    const analysisId = '32db86e5-c388-486e-b15e-f68f6095ec12'
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/api/applicant/cvs')) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [cvMetadata] },
        })
      }
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(historyResponse([historyItem(analysisId, 'COMPLETED')], 1, 1))
      }
      if (url.endsWith(`/api/cv-analyses/${analysisId}`)) {
        return jsonResponse({
          success: true,
          message: 'Detail analisis CV berhasil diambil.',
          data: historyItem(analysisId, 'COMPLETED'),
        })
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    await screen.findAllByText('resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua riwayat' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Lihat hasil' }))

    expect(await screen.findByText(analysisResult.summary)).toBeTruthy()
    expect(
      fetchMock.mock.calls.some(([input]) =>
        String(input).endsWith(`/api/cv-analyses/${analysisId}`),
      ),
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke riwayat' }))
    expect(
      (await screen.findAllByRole('heading', { name: 'Riwayat Analisis' }))
        .length,
    ).toBeGreaterThan(0)
  })

  it('shows an empty state when API history contains no analyses', async () => {
    setAuthenticatedSession()
    mockFetch((url) => {
      if (url.endsWith('/api/applicant/cvs')) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [cvMetadata] },
        })
      }
      return jsonResponse(historyResponse())
    })

    renderPage()
    await screen.findAllByText('resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua riwayat' }))
    expect(await screen.findByText('Belum ada riwayat analisis')).toBeTruthy()
  })

  it('renders PROCESSING and FAILED details without inventing a result', async () => {
    setAuthenticatedSession()
    const processingId = '32db86e5-c388-486e-b15e-f68f6095ec12'
    const failedId = 'b7d6a64c-6e6a-4f34-9785-c186e2db8a39'
    mockFetch((url) => {
      if (url.endsWith('/api/applicant/cvs')) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [cvMetadata] },
        })
      }
      if (url.includes('/api/cv-analyses?')) {
        return jsonResponse(
          historyResponse(
            [
              historyItem(processingId, 'PROCESSING'),
              historyItem(failedId, 'FAILED'),
            ],
            1,
            2,
          ),
        )
      }
      if (url.endsWith(`/api/cv-analyses/${processingId}`)) {
        return jsonResponse({
          success: true,
          message: 'Detail analisis CV berhasil diambil.',
          data: historyItem(processingId, 'PROCESSING'),
        })
      }
      if (url.endsWith(`/api/cv-analyses/${failedId}`)) {
        return jsonResponse({
          success: true,
          message: 'Detail analisis CV berhasil diambil.',
          data: historyItem(failedId, 'FAILED'),
        })
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    await screen.findAllByText('resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua riwayat' }))
    await screen.findAllByRole('button', { name: 'Lihat hasil' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Lihat hasil' })[0]!)
    expect(
      await screen.findByRole('heading', { name: 'Analisis Masih Diproses' }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke riwayat' }))
    await screen.findAllByRole('button', { name: 'Lihat hasil' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Lihat hasil' })[1]!)
    expect(
      await screen.findByText('Analisis CV ini berstatus gagal dari backend.'),
    ).toBeTruthy()
    expect(screen.queryByText('Analisis Selesai')).toBeNull()
  })

  it('handles history errors and requests the next API pagination page', async () => {
    setAuthenticatedSession()
    let historyRequestCount = 0
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/api/applicant/cvs')) {
        return jsonResponse({
          success: true,
          message: 'Daftar CV berhasil diambil.',
          data: { cvs: [] },
        })
      }
      if (url.includes('/api/cv-analyses?')) {
        historyRequestCount += 1
        if (historyRequestCount === 1) {
          return jsonResponse(
            {
              success: false,
              message: 'Riwayat sedang tidak tersedia.',
              errors: null,
            },
            503,
          )
        }
        const page = url.includes('page=2') ? 2 : 1
        const items =
          page === 1
            ? Array.from({ length: 10 }, (_, index) =>
                historyItem(
                  `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
                  'COMPLETED',
                ),
              )
            : [historyItem('00000000-0000-4000-8000-000000000011', 'FAILED')]
        return jsonResponse(historyResponse(items, page, 11))
      }
      throw new Error(`Unexpected request: ${url}`)
    })

    renderPage()
    expect(await screen.findByText('Riwayat sedang tidak tersedia.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua riwayat' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Coba lagi' })[0]!)
    fireEvent.click(await screen.findByRole('button', { name: 'Berikutnya' }))

    await screen.findByText('CV tersimpan')
    expect(
      fetchMock.mock.calls.some(([input]) =>
        String(input).includes('/api/cv-analyses?page=2&pageSize=10'),
      ),
    ).toBe(true)
  })
})
