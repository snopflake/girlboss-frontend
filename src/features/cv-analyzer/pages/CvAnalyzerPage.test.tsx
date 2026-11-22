// @vitest-environment jsdom
// Runtime validation coverage for the CV Analyzer demo flow.

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import CvAnalyzerPage from './CvAnalyzerPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <CvAnalyzerPage />
    </MemoryRouter>,
  )
}

function chooseUploadTab() {
  fireEvent.click(screen.getByRole('tab', { name: 'Unggah CV Baru' }))
  return screen.getByLabelText('Pilih CV untuk diunggah')
}

async function waitForAnalysisResult() {
  await waitFor(
    () =>
      expect(
        screen.getByRole('heading', { name: 'Analisis Selesai' }),
      ).toBeTruthy(),
    { timeout: 10000 },
  )
}

afterEach(cleanup)

describe('CV Analyzer local demo', () => {
  it('validates uploads and allows the simulated analysis to be cancelled', async () => {
    renderPage()
    const fileInput = chooseUploadTab()
    const startButton = screen.getByRole('button', { name: 'Mulai Analisis' })

    fireEvent.change(fileInput, {
      target: { files: [new File(['not a CV'], 'resume.txt')] },
    })
    expect(
      screen.getByText('Format file tidak didukung. Pilih file PDF atau DOCX.'),
    ).toBeTruthy()
    expect(startButton.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('resume.txt')).toBeTruthy()

    const oversizedPdf = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'oversized.pdf',
      { type: 'application/pdf' },
    )
    fireEvent.change(fileInput, { target: { files: [oversizedPdf] } })
    expect(
      screen.getByText('Ukuran file melebihi batas maksimum 5 MB.'),
    ).toBeTruthy()
    expect(startButton.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('oversized.pdf')).toBeTruthy()

    fireEvent.change(fileInput, {
      target: {
        files: [new File(['valid demo bytes'], 'valid-cv.pdf', { type: 'application/pdf' })],
      },
    })
    expect(screen.getByText('valid-cv.pdf')).toBeTruthy()
    expect(startButton.hasAttribute('disabled')).toBe(false)

    fireEvent.click(startButton)
    expect(
      screen.getByRole('heading', { name: 'Sedang Menganalisis CV Kamu' }),
    ).toBeTruthy()
    const progressBar = screen.getByRole('progressbar')
    await waitFor(
      () =>
        expect(
          Number(progressBar.getAttribute('aria-valuenow')),
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    )
    fireEvent.click(screen.getByRole('button', { name: 'Batalkan' }))
    expect(screen.getByText(/Simulasi analisis dibatalkan/)).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Unggah CV Baru' })).toBeTruthy()
  })

  it('shows a mock failure with details and can retry to a mock result', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Hasil simulasi demo'), {
      target: { value: 'FAILED' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mulai Analisis' }))

    await waitFor(
      () =>
        expect(
          screen.getByRole('heading', { name: 'Analisis Gagal Diproses' }),
        ).toBeTruthy(),
      { timeout: 10000 },
    )
    fireEvent.click(screen.getByText('Detail Kesalahan'))
    expect(screen.getByText(/DEMO_ANALYSIS_FAILED/)).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Hasil simulasi demo'), {
      target: { value: 'COMPLETED' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Coba Lagi' }))
    await waitForAnalysisResult()
    expect(screen.getByText('Hasil simulasi')).toBeTruthy()
    expect(screen.getByText('Ringkasan Evaluasi')).toBeTruthy()
  }, 15000)

  it('filters and searches mock history and renders the true empty state', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua riwayat' }))

    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(4)

    fireEvent.change(screen.getByLabelText('Filter status'), {
      target: { value: 'FAILED' },
    })
    expect(within(table).getAllByRole('row')).toHaveLength(2)
    expect(within(table).getByText('Gagal')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Cari berdasarkan nama file'), {
      target: { value: 'nama-yang-tidak-ada' },
    })
    expect(screen.getByText(/Tidak ada riwayat yang cocok/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Kosongkan data demo' }))
    expect(screen.getByText('Belum ada riwayat analisis')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Analisis CV Pertama' }),
    ).toBeTruthy()
  })
})
