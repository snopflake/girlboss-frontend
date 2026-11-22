import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/useAuth'
import {
  getApplicantProfileMock,
  saveApplicantProfileMock,
} from '../mocks/applicantProfileMockService'
import type { ApplicantProfile } from '../types/applicantProfile.types'

const profileKey = (userId: string | undefined) => ['profile', 'applicant', userId] as const

export function useApplicantProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: profileKey(user?.id),
    queryFn: () =>
      getApplicantProfileMock({
        userId: user?.id ?? '',
        fullName: user?.fullName ?? null,
        email: user?.email ?? null,
      }),
    enabled: Boolean(user?.id),
  })
}

export function useSaveApplicantProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (changes: Partial<ApplicantProfile>) =>
      saveApplicantProfileMock({ userId: user?.id ?? '', changes }),
    onSuccess: (profile) => queryClient.setQueryData(profileKey(user?.id), profile),
  })
}
