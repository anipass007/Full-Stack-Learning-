import { Route, Routes, useLocation } from 'react-router-dom'
import RouteEffects from './components/layout/RouteEffects'
import ErrorBoundary from './components/layout/ErrorBoundary'
import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import RecruiterLayout from './layouts/RecruiterLayout'
import AdminLayout from './layouts/AdminLayout'
import NotFound from './pages/shared/NotFound'
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Signup from './pages/public/Signup'
import About from './pages/public/About'
import Dashboard from './pages/student/Dashboard'
import MyResume from './pages/student/MyResume'
import ResumeAnalysis from './pages/student/ResumeAnalysis'
import SkillGap from './pages/student/SkillGap'
import FindJobs from './pages/student/FindJobs'
import JobDetails from './pages/student/JobDetails'
import CareerRoadmap from './pages/student/CareerRoadmap'
import MyApplications from './pages/student/MyApplications'
import MockInterview from './pages/student/MockInterview'
import ProfileSettings from './pages/student/ProfileSettings'
import RecruiterDashboard from './pages/recruiter/Dashboard'
import ManageJobs from './pages/recruiter/ManageJobs'
import PostJob from './pages/recruiter/PostJob'
import Applicants from './pages/recruiter/Applicants'
import RecruiterProfileSettings from './pages/recruiter/ProfileSettings'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import Moderation from './pages/admin/Moderation'
import Analytics from './pages/admin/Analytics'
import RequireAuth from './components/auth/RequireAuth'
import ResetPassword from './pages/public/ResetPassword'

// Every route renders inside its layout.
export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      <RouteEffects />
      <ErrorBoundary key={pathname}>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Student pages: all 10 pages done. */}
        <Route path="student" element={<RequireAuth allowedRoles={['student']}><StudentLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="resume" element={<MyResume />} />
          <Route path="resume-analysis" element={<ResumeAnalysis />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route path="roadmap" element={<CareerRoadmap />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Recruiter pages */}
        <Route path="recruiter" element={<RequireAuth allowedRoles={['recruiter']}><RecruiterLayout /></RequireAuth>}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<ManageJobs />} />
          <Route path="jobs/new" element={<PostJob />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="profile" element={<RecruiterProfileSettings />} />
        </Route>

        {/* Admin pages */}
        <Route path="admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </>
  )
}
