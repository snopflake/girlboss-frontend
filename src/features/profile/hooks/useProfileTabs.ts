import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

const unsavedMessage = 'Ada perubahan yang belum disimpan. Tinggalkan bagian ini?'

/**
 * Tab profil yang tersimpan di URL (?tab=...) + perlindungan perubahan yang
 * belum disimpan (konfirmasi saat pindah tab & peringatan beforeunload).
 */
export function useProfileTabs<T extends string>(tabs: readonly T[], defaultTab: T) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDirty, setIsDirty] = useState(false)

  const param = searchParams.get('tab')
  const activeTab = tabs.find((tab) => tab === param) ?? defaultTab

  useEffect(() => {
    if (!isDirty) return
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  function changeTab(tab: T) {
    if (tab === activeTab) return
    if (isDirty && !window.confirm(unsavedMessage)) return
    setIsDirty(false)
    setSearchParams(tab === defaultTab ? {} : { tab }, { replace: true })
  }

  return { activeTab, changeTab, setIsDirty }
}
