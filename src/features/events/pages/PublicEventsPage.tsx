import { generatePath } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { EventsBrowser } from '../components/EventsBrowser'

export default function PublicEventsPage() {
  return (
    <EventsBrowser getDetailPath={(id) => generatePath(routePaths.eventDetail, { id })} />
  )
}
