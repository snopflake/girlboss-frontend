import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/useAuth'
import {
  getIncomingApplicationsMock,
  updateIncomingApplicationStatusMock,
} from '../mocks/incomingApplicationsMockService'

const incomingApplicationsKey = (userId: string | undefined) =>
  ['applications', 'incoming', userId] as const

export function useIncomingApplications() {
  const { user } = useAuth()

  return useQuery({
    queryKey: incomingApplicationsKey(user?.id),
    queryFn: getIncomingApplicationsMock,
  })
}

export function useUpdateIncomingApplicationStatus() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateIncomingApplicationStatusMock,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: incomingApplicationsKey(user?.id) }),
  })
}
