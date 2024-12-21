import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import logo from '../../assets/nicelogo.png';
import timesup from '../../assets/clock.png';

const ExamTimePassed = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      html, body, #root {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: Arial, sans-serif;
        background-color: #f0ebf8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      {/* Institute Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '100px',
          height: 'auto',
        }}
      >
        <img src={logo} alt="Institute Logo" style={{ width: '200px', height: 'auto',margin:'10px'}} />
      </Box>

      {/* Message Container */}
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#005AA0',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontSize: '20px',
          }}
        >
          Your exam time has been passed. Kindly contact admin to reschedule your exam.
        </Typography>
        <img src={timesup} alt="Times UP" style={{ width: '100px', height: 'auto',margin:'10px'}} />
      </Container>
    </Box>
  );
};

export default ExamTimePassed;
