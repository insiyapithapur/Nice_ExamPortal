// src/pages/ExamOnTime.tsx
import React from 'react';
import { Container, Paper, Button, TextField, Typography } from '@mui/material';
import '../css/ExamOnTime.css'; // Custom styles for the exam page
import niceLogo from "../assets/nicelogo.png";

const ExamOnTime: React.FC = () => {
  // Sample data for questions and answers
  const sections = [
    { serialNo: 1, question: 'What is React?', marks: 5 },
    { serialNo: 2, question: 'Explain TypeScript.', marks: 4 },
    { serialNo: 3, question: 'What is Material UI?', marks: 3 },
    { serialNo: 4, question: 'Explain useEffect hook.', marks: 5 },
  ];

  return (
    <div className="exam-container">
      {/* Header Section */}
      <header className="header">
        {/* Left Section */}
        <div className="header-left">
          <img src={niceLogo} alt="logo" width={150} height={60} />
        </div>

        {/* Middle Section */}
        <div className="header-middle">
          <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
            Course Name: React Development
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: '5px' }}>
            Faculty: John Doe
          </Typography>
          <div className="last-middle">
            <Typography variant="body1">
              Paper Code: 101
            </Typography>
            <Typography variant="body1">
              Total Marks: 17
            </Typography>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <Container className="body-container">
        {sections.map((section, index) => (
          <Paper key={index} className="question-container">
            <div className="question-content">
              {/* Row for Serial Number, Question, and Marks */}
              <div className="question-row">
                <Typography variant="body1" className="serial-number">
                  Q{section.serialNo}
                </Typography>
                <Typography variant="body1" className="question-text">
                  {section.question}
                </Typography>
                <Typography variant="body1" className="marks">
                  {section.marks} Marks
                </Typography>
              </div>

              {/* Text Input */}
              <TextField
                label="Your Answer"
                variant="outlined"
                fullWidth
                className="answer-input"
              />
            </div>
          </Paper>
        ))}
        <Button variant="contained" className="submit-button">
          Submit
        </Button>
      </Container>

    </div>
  );
};

export default ExamOnTime;
