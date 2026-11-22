import type { ApplicationStatus } from '../types/application.types'
import type { IncomingApplication } from '../types/incomingApplication.types'
import { incomingApplicationsMock } from './incomingApplications.mock'
import {
  currentMockScenario,
  MockApplicationsError,
  simulateLatency,
} from './mockScenario'

/**
 * Sumber data sementara untuk "Kelola Lamaran" (company) selama backend belum
 * memiliki endpoint lamaran. Saat endpoint tersedia, ganti pemanggilan di
 * `hooks/useIncomingApplications.ts` ke modul `api/` tanpa mengubah UI.
 * Lihat `mockScenario.ts` untuk mode pratinjau ?mock=empty / ?mock=error.
 */

let store: IncomingApplication[] = [...incomingApplicationsMock]

export async function getIncomingApplicationsMock(): Promise<IncomingApplication[]> {
  await simulateLatency()
  const scenario = currentMockScenario()
  if (scenario === 'error') {
    throw new MockApplicationsError('Daftar lamaran masuk tidak dapat dimuat.')
  }
  return scenario === 'empty' ? [] : [...store]
}

export async function updateIncomingApplicationStatusMock(input: {
  id: string
  status: ApplicationStatus
}): Promise<IncomingApplication> {
  await simulateLatency()
  const target = store.find((item) => item.id === input.id)
  if (!target) {
    throw new MockApplicationsError('Lamaran tidak ditemukan.')
  }

  const updated: IncomingApplication = {
    ...target,
    status: input.status,
    updatedAt: new Date().toISOString(),
  }
  store = store.map((item) => (item.id === input.id ? updated : item))
  return updated
}
