import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/useAuth'
import {
  getCompanyProfileMock,
  saveCompanyProfileMock,
} from '../mocks/companyProfileMockService'
import type { CompanyProfile } from '../types/companyProfile.types'

const companyProfileKey = (userId: string | undefined) =>
  ['profile', 'company', userId] as const

type CompanyProfileChanges = Partial<Pick<CompanyProfile, 'info' | 'social' | 'notifications'>>

export function useCompanyProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: companyProfileKey(user?.id),
    queryFn: () =>
      getCompanyProfileMock({
        userId: user?.id ?? '',
        fullName: user?.fullName ?? null,
        email: user?.email ?? null,
      }),
    enabled: Boolean(user?.id),
  })
}

export function useSaveCompanyProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (changes: CompanyProfileChanges) =>
      saveCompanyProfileMock({ userId: user?.id ?? '', changes }),
    onSuccess: (profile) => queryClient.setQueryData(companyProfileKey(user?.id), profile),
  })
}
