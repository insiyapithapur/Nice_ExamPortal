import React, { useState } from "react";
import "./css/Login.css";
import InputField from "../component/InputField";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter valid credentials.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/faculty/sign-in/", {
        email,
        password,
      });

      if (response.status === 200) {
        const { user, is_faculty, exam_id, exam_checked, exam_date, exam_time } = response.data;
        // alert(response.data.message);

        localStorage.setItem("user", user);
        localStorage.setItem("is_faculty", String(is_faculty));
        // alert("exam_id in login "+exam_id);
        localStorage.setItem("exam_id",exam_id);

        if (is_faculty) {
          navigate('/app/set-exam');
        } else {
          handleStudentNavigation(exam_checked, exam_date, exam_time);
        }
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message || "An error occurred. Please try again.");
      } else {
        alert("Unable to connect to the server. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStudentNavigation = (exam_checked: boolean, exam_date: string, exam_time: string) => {
    const now = new Date();
    const examDateTime = new Date(`${exam_date}T${exam_time}`);

    if (exam_checked) {
      // 1. Exam already checked
      navigate('/student/result');
    } else if (now >= new Date(examDateTime.getTime() + 60 * 60 * 1000)) {
      alert("More than 1hr,reshedule your exam");
      // 2. More than 1 hour past exam time
      navigate('/student/exam-time-passed');
    } else if (now >= examDateTime && now < new Date(examDateTime.getTime() + 60 * 60 * 1000)) {
      alert("Exam window is still active");
      // 3. Exam window is still active
      navigate('/student/show-exam');
    } else {
      alert("Time is left for exam");
      // 4. Time is left for the exam
      navigate('/student/exam-time-left');
    }
  };

  return (
    <div className="login-container">
      {/* Left section: Image */}
      <div className="login-image">
        <img src="src/assets/login-bg.jpg" alt="Login Banner" />
      </div>

      {/* Right section: Form */}
      <div className="login-form-section">
        <div className="logo">
          <img src="src/assets/nicelogo.png" alt="Institute Logo" />
        </div>
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link for Student Registration */}
        <div className="student-registration-link">
          <Link to="/student/register">
            Student, for your Registration click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
