import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../css/StudentLogin.css";

// Import images
import loginBg from "../../assets/login-bg.jpg";
import niceLogo from "../../assets/nicelogo.png";
import axios from "axios";


const StudentLogin: React.FC = () => {
  const [registrationNo, setRegistrationNo] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [examDateTime, setExamDateTime] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validate inputs
    if (registrationNo && name && mobile && email && course && examDateTime) {
      // Split date and time from the datetime-local input
      const [examDate, examTime] = examDateTime.split("T");
  
      const formattedDate = examDate.split("-").reverse().join("-"); // Format to dd-mm-yyyy
      const formattedTime = new Date(`1970-01-01T${examTime}`).toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      const requestBody = {
        name: name,
        phone: mobile,
        email: email,
        regNo: registrationNo,
        course: course,
        exam_date: formattedDate,
        examtime: formattedTime,
      };
  
      try {
        // Send POST request
        const response = await axios.post("http://127.0.0.1:8000/student/sign-up/", requestBody);
  
        if (response.status === 201) {
          const { is_faculty, user } = response.data;
  
          // Save is_faculty to local storage
          localStorage.setItem("is_faculty", is_faculty);
  
          // Navigate based on faculty status
          if (is_faculty) {
            navigate('/app/set-exam'); // Faculty path
          } else {
            navigate('/student/exam'); // Student path
          }
        } else {
          alert(response.data.message || "An unexpected error occurred.");
        }
      } catch (error) {
        // Handle errors
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.message || "Failed to register.");
        } else {
          console.error("Error:", error);
          alert("Something went wrong. Please try again.");
        }
      }
    } else {
      alert("Please fill out all fields.");
    }
  };
  

  return (
    <div className="login-container">
      {/* Left section: Image */}
      <div className="login-image">
        <img src={loginBg} alt="Registration Banner" />
      </div>

      {/* Right section: Registration Form */}
      <div className="login-form-section">
        <div className="logo">
          <img src={niceLogo} alt="Institute Logo" />
        </div>
        <h2 className="login-title">Registration</h2>
        <form onSubmit={(e) => e.preventDefault()} className="login-form">
          <Table>
            <TableBody>
              {/* Row 1: Registration No and Name */}
              <TableRow>
                <TableCell>
                  <TextField
                    label="Registration No"
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    // margin="dense"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              {/* Row 2: Mobile Number and Email */}
              <TableRow>
                <TableCell>
                  <TextField
                    label="Mobile Number"
                    type="tel"
                    fullWidth
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              {/* Row 3: Course Name and Exam Date Time */}
              <TableRow>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Course Name</InputLabel>
                    <Select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      label="Course Name"
                    >
                      <MenuItem value="HA">HA</MenuItem>
                      <MenuItem value="Tally">Tally</MenuItem>
                      <MenuItem value="CP">CP</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    label="Exam Date and Time"
                    type="datetime-local"
                    value={examDateTime}
                    onChange={(e) => setExamDateTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Register
          </Button>
        </form>
        <div className="login-link">
          <Link to="/login">
            Student and Faculty can login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
