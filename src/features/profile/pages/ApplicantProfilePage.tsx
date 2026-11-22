import { CircleCheck, Mail, UserRound } from 'lucide-react'
import { useId } from 'react'
import { Badge } from '../../../design-system/components'
import { EducationForm } from '../components/EducationForm'
import { ExperienceForm } from '../components/ExperienceForm'
import { PersonalInfoForm } from '../components/PersonalInfoForm'
import { PortfolioForm } from '../components/PortfolioForm'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileLoadError, ProfileSkeleton } from '../components/ProfileLoadState'
import { ProfileTabs } from '../components/ProfileTabs'
import { SettingsPanel } from '../components/SettingsPanel'
import { SkillsForm } from '../components/SkillsForm'
import pageStyles from '../components/profilePage.module.css'
import { useApplicantProfile } from '../hooks/useApplicantProfile'
import { useImagePreview } from '../hooks/useImagePreview'
import { useProfileTabs } from '../hooks/useProfileTabs'
import type { ApplicantProfile } from '../types/applicantProfile.types'
import { profileCompleteness, profileTabs } from '../utils/profileHelpers'

const tabValues = profileTabs.map((tab) => tab.value)

export default function ApplicantProfilePage() {
  const profileQuery = useApplicantProfile()
  const profile = profileQuery.data

  let content
  if (profileQuery.isPending) {
    content = <ProfileSkeleton label="Memuat profil…" />
  } else if (profileQuery.isError || !profile) {
    content = (
      <ProfileLoadError
        title="Gagal memuat profil"
        isRetrying={profileQuery.isFetching}
        onRetry={() => void profileQuery.refetch()}
      />
    )
  } else {
    content = <ProfileContent profile={profile} />
  }

  return <div className={pageStyles.page}>{content}</div>
}

function ProfileContent({ profile }: { profile: ApplicantProfile }) {
  const { activeTab, changeTab, setIsDirty } = useProfileTabs(tabValues, 'personal')
  const photo = useImagePreview(2)
  const panelId = useId()
  const completeness = profileCompleteness(profile)
  const isComplete = completeness === 100

  let panel
  switch (activeTab) {
    case 'personal':
      panel = <PersonalInfoForm personal={profile.personal} onDirtyChange={setIsDirty} />
      break
    case 'experience':
      panel = <ExperienceForm experiences={profile.experiences} onDirtyChange={setIsDirty} />
      break
    case 'education':
      panel = (
        <EducationForm
          educations={profile.educations}
          certifications={profile.certifications}
          onDirtyChange={setIsDirty}
        />
      )
      break
    case 'skills':
      panel = <SkillsForm skills={profile.skills} onDirtyChange={setIsDirty} />
      break
    case 'portfolio':
      panel = <PortfolioForm links={profile.portfolioLinks} onDirtyChange={setIsDirty} />
      break
    case 'settings':
      panel = <SettingsPanel preferences={profile.preferences} onDirtyChange={setIsDirty} />
      break
  }

  return (
    <>
      <ProfileHeader
        title={profile.personal.fullName || 'Nama belum diisi'}
        subtitle={profile.personal.headline || 'Tambahkan headline profesional'}
        placeholderIcon={UserRound}
        avatar={{ url: photo.url, error: photo.error, onSelect: photo.select }}
        avatarLabel="Ganti foto profil"
        publicLabel="Lihat Profil Publik"
        badges={
          <>
            <Badge variant={isComplete ? 'success' : 'warning'}>
              <CircleCheck aria-hidden="true" size={12} />
              {isComplete ? 'Profil Lengkap' : `Profil ${completeness}% lengkap`}
            </Badge>
            <Badge variant="primary">
              <Mail aria-hidden="true" size={12} />
              Email Terverifikasi
            </Badge>
          </>
        }
      />
      <ProfileTabs
        label="Bagian profil"
        items={profileTabs}
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
