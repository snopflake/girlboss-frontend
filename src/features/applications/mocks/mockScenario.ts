/**
 * Utilitas bersama untuk mock service fitur lamaran.
 *
 * Mode pratinjau (hanya saat development) melalui query string:
 *   ?mock=empty  → tidak ada data
 *   ?mock=error  → simulasi kegagalan memuat data
 */

export type MockScenario = 'default' | 'empty' | 'error'

const latencyMs = 400

export function currentMockScenario(): MockScenario {
  if (!import.meta.env.DEV) return 'default'
  const value = new URLSearchParams(window.location.search).get('mock')
  return value === 'empty' || value === 'error' ? value : 'default'
}

export function simulateLatency() {
  return new Promise((resolve) => window.setTimeout(resolve, latencyMs))
}

export class MockApplicationsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockApplicationsError'
  }
}
