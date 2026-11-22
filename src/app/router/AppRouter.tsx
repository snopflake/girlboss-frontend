import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminLayout } from '../../layouts/AdminLayout'
import { ApplicantLayout } from '../../layouts/ApplicantLayout'
import { AuthLayout } from '../../layouts/AuthLayout'
import { CompanyLayout } from '../../layouts/CompanyLayout'
import { PublicLayout } from '../../layouts/PublicLayout'
import ApplicantDashboardPage from '../../features/dashboard/pages/ApplicantDashboardPage'
import AdminDashboardPage from '../../features/dashboard/pages/AdminDashboardPage'
import CompanyDashboardPage from '../../features/dashboard/pages/CompanyDashboardPage'
import PublicHomePage from '../../features/dashboard/pages/PublicHomePage'
import LoginPage from '../../features/auth/pages/LoginPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import ApplicantJobsPage from '../../features/jobs/pages/ApplicantJobsPage'
import EditJobPage from '../../features/jobs/pages/EditJobPage'
import JobDetailPage from '../../features/jobs/pages/JobDetailPage'
import ManageJobsPage from '../../features/jobs/pages/ManageJobsPage'
import NewJobPage from '../../features/jobs/pages/NewJobPage'
import PublicJobsPage from '../../features/jobs/pages/PublicJobsPage'
import SavedJobsPage from '../../features/jobs/pages/SavedJobsPage'
import IncomingApplicationsPage from '../../features/applications/pages/IncomingApplicationsPage'
import MyApplicationsPage from '../../features/applications/pages/MyApplicationsPage'
import MyApplicationDetailPage from '../../features/applications/pages/MyApplicationDetailPage'
import ApplicantEventsPage from '../../features/events/pages/ApplicantEventsPage'
import EventDetailPage from '../../features/events/pages/EventDetailPage'
import PublicEventsPage from '../../features/events/pages/PublicEventsPage'
import CvAnalyzerPage from '../../features/cv-analyzer/pages/CvAnalyzerPage'
import InterviewPage from '../../features/interview/pages/InterviewPage'
import ApplicantProfilePage from '../../features/profile/pages/ApplicantProfilePage'
import CompanyProfilePage from '../../features/profile/pages/CompanyProfilePage'
import ComponentShowcase from '../../design-system/ComponentShowcase'
import ForbiddenPage from '../pages/ForbiddenPage'
import NotFoundPage from '../pages/NotFoundPage'
import { devRoutePaths } from './devRoutePaths'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { routePaths } from './routePaths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={routePaths.home} element={<PublicHomePage />} />
          <Route path={routePaths.jobs} element={<PublicJobsPage />} />
          <Route path={routePaths.jobDetail} element={<JobDetailPage />} />
          <Route path={routePaths.eventList} element={<PublicEventsPage />} />
          <Route path={routePaths.eventDetail} element={<EventDetailPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={routePaths.login} element={<LoginPage />} />
          <Route path={routePaths.register} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['applicant']} />}>
            <Route element={<ApplicantLayout />}>
              <Route
                path={routePaths.applicant.dashboard}
                element={<ApplicantDashboardPage />}
              />
              <Route
                path={routePaths.applicant.jobs}
                element={<ApplicantJobsPage />}
              />
              <Route
                path={routePaths.applicant.savedJobs}
                element={<SavedJobsPage />}
              />
              <Route
                path={routePaths.applicant.applications}
                element={<MyApplicationsPage />}
              />
              <Route
                path={routePaths.applicant.applicationDetail}
                element={<MyApplicationDetailPage />}
              />
              <Route
                path={routePaths.applicant.events}
                element={<ApplicantEventsPage />}
              />
              <Route
                path={routePaths.applicant.cvAnalyzer}
                element={<CvAnalyzerPage />}
              />
              <Route
                path={routePaths.applicant.interview}
                element={<InterviewPage />}
              />
              <Route
                path={routePaths.applicant.profile}
                element={<ApplicantProfilePage />}
              />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={['company']} />}>
            <Route element={<CompanyLayout />}>
              <Route
                path={routePaths.company.dashboard}
                element={<CompanyDashboardPage />}
              />
              <Route
                path={routePaths.company.jobs}
                element={<ManageJobsPage />}
              />
              <Route
                path={routePaths.company.newJob}
                element={<NewJobPage />}
              />
              <Route
                path={routePaths.company.editJob}
                element={<EditJobPage />}
              />
              <Route
                path={routePaths.company.applications}
                element={<IncomingApplicationsPage />}
              />
              <Route
                path={routePaths.company.profile}
                element={<CompanyProfilePage />}
              />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route
                path={routePaths.admin.dashboard}
                element={<AdminDashboardPage />}
              />
            </Route>
          </Route>
        </Route>

        {import.meta.env.DEV && (
          <>
            <Route
              path={devRoutePaths.designSystem}
              element={<ComponentShowcase />}
            />
            <Route element={<ApplicantLayout />}>
              <Route
                path={devRoutePaths.applicantPreview}
                element={<ApplicantDashboardPage />}
              />
            </Route>
            <Route element={<CompanyLayout />}>
              <Route
                path={devRoutePaths.companyPreview}
                element={<CompanyDashboardPage />}
              />
            </Route>
            <Route element={<AdminLayout />}>
              <Route
                path={devRoutePaths.adminPreview}
                element={<AdminDashboardPage />}
              />
            </Route>
          </>
        )}

        <Route path={routePaths.forbidden} element={<ForbiddenPage />} />
        <Route path={routePaths.notFound} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
