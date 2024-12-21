import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./pages/SidebarLayout";
import SetExam from "./pages/faculty/SetExam";
import CheckExam from "./pages/faculty/CheckExam";
import SeePaper from "./pages/faculty/SeePaper";
import Login from "./pages/Login";
import SubmitExam from "./pages/student/SubmitExam";
import ProtectedRoute from "./component/ProtectedRoute";
import StudentLogin from "./pages/student/StudentLogin";
import ExamOnTime from "./pages/student/ExamOnTime";
import GoogleFormClone from "./pages/student/GoogleFormClone";
import ExamTimeLeft from "./pages/student/ExamTimeLeft";
import Result from "./pages/student/result";
import GoogleFormCreator from "./pages/faculty/GoogleFormCreator";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route points to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/register" element={<StudentLogin />} />

        {/* Protected Faculty Routes */}
        <Route element={<ProtectedRoute requireFaculty={true} />}>
          <Route path="/app" element={<SidebarLayout />}>
            <Route path="set-exam" element={<GoogleFormCreator />} />
            <Route path="check-exam" element={<CheckExam />} />
            <Route path="see-paper" element={<SeePaper />} />
          </Route>
        </Route>

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute requireFaculty={false} />}>
          <Route path="/student/register" element={<StudentLogin />} />
          <Route path="/student/exam-time-passed" element={<GoogleFormClone />} />
          <Route path="/student/show-exam" element={<GoogleFormClone/>} />
          <Route path="/student/exam-time-left" element={<ExamTimeLeft/>} />
          <Route path="/student/exam" element={<SubmitExam />} />
          <Route path="/student/result" element={<Result />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
