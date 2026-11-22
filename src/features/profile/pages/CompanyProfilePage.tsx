import { Building2, Clock, Mail, ShieldCheck, ShieldX } from 'lucide-react'
import { useId } from 'react'
import { Badge, type BadgeVariant } from '../../../design-system/components'
import { CompanyBrandingForm } from '../components/CompanyBrandingForm'
import { CompanyInfoForm } from '../components/CompanyInfoForm'
import { CompanySettingsPanel } from '../components/CompanySettingsPanel'
import { CompanyVerificationPanel } from '../components/CompanyVerificationPanel'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileLoadError, ProfileSkeleton } from '../components/ProfileLoadState'
import { ProfileTabs } from '../components/ProfileTabs'
import pageStyles from '../components/profilePage.module.css'
import { useCompanyProfile } from '../hooks/useCompanyProfile'
import { useImagePreview } from '../hooks/useImagePreview'
import { useProfileTabs } from '../hooks/useProfileTabs'
import type { CompanyProfile, VerificationStatus } from '../types/companyProfile.types'
import { companyProfileTabs, verificationLabels } from '../utils/companyProfileOptions'

const tabValues = companyProfileTabs.map((tab) => tab.value)

const verificationBadge: Record<VerificationStatus, { variant: BadgeVariant; icon: typeof Clock }> = {
  pending: { variant: 'warning', icon: Clock },
  verified: { variant: 'success', icon: ShieldCheck },
  rejected: { variant: 'danger', icon: ShieldX },
  unverified: { variant: 'neutral', icon: Clock },
}

export default function CompanyProfilePage() {
  const profileQuery = useCompanyProfile()
  const profile = profileQuery.data

  let content
  if (profileQuery.isPending) {
    content = <ProfileSkeleton label="Memuat profil perusahaan…" />
  } else if (profileQuery.isError || !profile) {
    content = (
      <ProfileLoadError
        title="Gagal memuat profil perusahaan"
        isRetrying={profileQuery.isFetching}
        onRetry={() => void profileQuery.refetch()}
      />
    )
  } else {
    content = <CompanyProfileContent profile={profile} />
  }

  return <div className={pageStyles.page}>{content}</div>
}

function CompanyProfileContent({ profile }: { profile: CompanyProfile }) {
  const { activeTab, changeTab, setIsDirty } = useProfileTabs(tabValues, 'info')
  // Logo & cover dipakai bersama oleh header dan tab Branding (pratinjau lokal).
  const logo = useImagePreview(2)
  const cover = useImagePreview(5)
  const panelId = useId()

  const { info, verification } = profile
  const subtitle = [info.industry, info.companySize].filter(Boolean).join(' • ')
  const badge = verificationBadge[verification.status]
  const BadgeIcon = badge.icon

  let panel
  switch (activeTab) {
    case 'info':
      panel = <CompanyInfoForm info={info} onDirtyChange={setIsDirty} />
      break
    case 'branding':
      panel = (
        <CompanyBrandingForm
          social={profile.social}
          logo={logo}
          cover={cover}
          onDirtyChange={setIsDirty}
        />
      )
      break
    case 'verification':
      panel = <CompanyVerificationPanel verification={verification} />
      break
    case 'settings':
      panel = (
        <CompanySettingsPanel notifications={profile.notifications} onDirtyChange={setIsDirty} />
      )
      break
  }

  return (
    <>
      <ProfileHeader
        title={info.companyName || 'Nama perusahaan belum diisi'}
        subtitle={subtitle || 'Lengkapi industri dan ukuran perusahaan'}
        avatarShape="square"
        placeholderIcon={Building2}
        avatar={{ url: logo.url, error: logo.error, onSelect: logo.select }}
        avatarLabel="Ganti logo perusahaan"
        cover={{ url: cover.url, error: cover.error, onSelect: cover.select }}
        publicLabel="Lihat Halaman Publik"
        badges={
          <>
            <Badge variant={badge.variant}>
              <BadgeIcon aria-hidden="true" size={12} />
              {verificationLabels[verification.status]}
            </Badge>
            <Badge variant="primary">
              <Mail aria-hidden="true" size={12} />
              Email Terverifikasi
            </Badge>
          </>
        }
      />
      <ProfileTabs
        label="Bagian profil perusahaan"
        items={companyProfileTabs}
        value={activeTab}
        onChange={changeTab}
        panelId={panelId}
      />
      <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${activeTab}`}>
        {panel}
      </div>
    </>
  )
}
