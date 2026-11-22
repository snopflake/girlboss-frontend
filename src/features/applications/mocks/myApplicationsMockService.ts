import type { MyApplication } from '../types/application.types'
import { myApplicationsMock } from './myApplications.mock'
import {
  currentMockScenario,
  MockApplicationsError,
  simulateLatency,
} from './mockScenario'

/**
 * Sumber data sementara untuk "Lamaran Saya" selama backend belum memiliki
 * endpoint lamaran. Saat endpoint tersedia, ganti pemanggilan di
 * `hooks/useMyApplications.ts` ke modul `api/` tanpa mengubah komponen UI.
 * Lihat `mockScenario.ts` untuk mode pratinjau ?mock=empty / ?mock=error.
 */

let store: MyApplication[] = [...myApplicationsMock]

export async function getMyApplicationsMock(): Promise<MyApplication[]> {
  await simulateLatency()
  const scenario = currentMockScenario()
  if (scenario === 'error') {
    throw new MockApplicationsError('Riwayat lamaran tidak dapat dimuat.')
  }
  return scenario === 'empty' ? [] : [...store]
}

export async function getMyApplicationMock(id: string): Promise<MyApplication | null> {
  await simulateLatency()
  if (currentMockScenario() === 'error') {
    throw new MockApplicationsError('Detail lamaran tidak dapat dimuat.')
  }
  return store.find((item) => item.id === id) ?? null
}

export async function cancelMyApplicationMock(id: string): Promise<void> {
  await simulateLatency()
  const target = store.find((item) => item.id === id)
  if (!target) {
    throw new MockApplicationsError('Lamaran tidak ditemukan.')
  }
  if (target.status !== 'submitted' && target.status !== 'reviewed') {
    throw new MockApplicationsError('Lamaran pada tahap ini tidak dapat dibatalkan.')
  }
  store = store.filter((item) => item.id !== id)
}
