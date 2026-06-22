import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./layout/userLayout";
import Home from "./pages/home";
import Login from "./pages/login";
// import Register from "./pages/register";
import Attendance from "./pages/attendance";
import Employee from "./pages/employee";
import Leave from "./pages/leave";
import TaskManagement from "./pages/taskManagement";
import AddEmployee from "./common/addEmployee";
import { ModalProvider } from "./context/modalContext";
import Profile from "./pages/profile";
import Help from "./pages/help";
import Analytics from "./pages/analytics";
import ProtectedRoute from "./routes/protectedRoute";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" duration={2000} />

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <ModalProvider>
                <UserLayout />
              </ModalProvider>
            }
          >
            <Route index element={<Home />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/taskManagement" element={<TaskManagement />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
