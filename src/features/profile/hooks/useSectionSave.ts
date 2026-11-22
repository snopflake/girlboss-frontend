import type { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'
import type { SaveStatus } from '../components/ProfileFormFooter'

/**
 * Logika simpan bersama untuk setiap tab profil (status sukses/gagal).
 * Dipakai oleh profil pelamar maupun perusahaan dengan mutation masing-masing.
 */
export function useSectionSave<TData, TChanges>(
  mutation: UseMutationResult<TData, Error, TChanges>,
) {
  const [status, setStatus] = useState<SaveStatus>({ type: 'idle' })

  function save(changes: TChanges, successMessage: string, onSaved: (data: TData) => void) {
    setStatus({ type: 'idle' })
    mutation.mutate(changes, {
      onSuccess: (data) => {
        onSaved(data)
        setStatus({ type: 'success', message: successMessage })
      },
      onError: () => setStatus({ type: 'error', message: 'Gagal menyimpan. Coba lagi.' }),
    })
  }

  return {
    save,
    status,
    resetStatus: () => setStatus({ type: 'idle' }),
    isSaving: mutation.isPending,
  }
}
