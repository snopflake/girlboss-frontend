import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/useAuth'
import {
  getEventMock,
  getEventsMock,
  registerForEventMock,
  toggleSavedEventMock,
} from '../mocks/eventsMockService'

const eventsKey = (userId: string | undefined) => ['events', userId ?? 'guest'] as const

export function useEvents() {
  const { user } = useAuth()

  return useQuery({
    queryKey: eventsKey(user?.id),
    queryFn: () => getEventsMock(user?.id),
  })
}

export function useEvent(id: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: [...eventsKey(user?.id), id],
    queryFn: () => getEventMock(id ?? '', user?.id),
    enabled: Boolean(id),
  })
}

function useInvalidateEvents() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: eventsKey(user?.id) })
}

export function useRegisterForEvent() {
  const invalidate = useInvalidateEvents()
  return useMutation({ mutationFn: registerForEventMock, onSuccess: invalidate })
}

export function useToggleSavedEvent() {
  const invalidate = useInvalidateEvents()
  return useMutation({ mutationFn: toggleSavedEventMock, onSuccess: invalidate })
}
