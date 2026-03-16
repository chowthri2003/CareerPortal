import { Route, Routes } from "react-router-dom";
import SignInPage from "./admin_pages/SignIn";
import Careers from "./public_pages/Careers";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./auth/protectedRoutes";
import Applications from "./admin_pages/Applications";
import CreateJob from "./admin_pages/CreateJob";
import JobDetails from "./public_pages/JobDetails";
import ApplyJob from "./public_pages/ApplicationForm";
import ManageJobs from "./admin_pages/ManageJobs";
import Dashboard from "./admin_pages/DashBoard";
import UserManagement from "./admin_pages/Users";
import Home from "./public_pages/Home";
import { useTheme } from "./components/hooks/useTheme";

function App() {
  useTheme();
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/apply/:id" element={<ApplyJob />}/>
      <Route path="/sign-in/*" element={<SignInPage />} />

     <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
          <Route path="jobs" element={<ManageJobs />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/edit/:id" element={<CreateJob />} />
          <Route path="applications" element={<Applications />} />
          <Route path="users" element={<UserManagement />} />
     </Route>
    </Routes>

  );
}

export default App;