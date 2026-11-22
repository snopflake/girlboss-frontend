import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/useAuth'
import {
  cancelMyApplicationMock,
  getMyApplicationMock,
  getMyApplicationsMock,
} from '../mocks/myApplicationsMockService'

const myApplicationsKey = (userId: string | undefined) =>
  ['applications', 'mine', userId] as const

export function useMyApplications() {
  const { user } = useAuth()

  return useQuery({
    queryKey: myApplicationsKey(user?.id),
    queryFn: getMyApplicationsMock,
  })
}

export function useMyApplication(id: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: [...myApplicationsKey(user?.id), id],
    queryFn: () => getMyApplicationMock(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCancelMyApplication() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelMyApplicationMock,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: myApplicationsKey(user?.id) }),
  })
}
