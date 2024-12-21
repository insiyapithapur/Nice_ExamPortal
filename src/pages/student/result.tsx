// import React from 'react';
// import { Container, Box, Typography } from '@mui/material';
// import '../css/submitExam.css'; 

// import niceLogo from "../../assets/nicelogo.png";
// import successlogo from "../../assets/cheer-up.png"

// const SubmitExam: React.FC = () => {
//   return (
//     <div className="exam-container">
//       {/* Header Section */}
//       <header className="header">
//         {/* Left Section */}
//         <div className="header-left">
//           <img src={niceLogo} alt="logo" width={150} height={60} />
//         </div>

//         {/* Middle Section */}
//         <div className="header-middle">
//           <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
//             Course Name: React Development
//           </Typography>
//           <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: '5px' }}>
//             Faculty: John Doe
//           </Typography>
//           <div className="last-middle">
//             <Typography variant="body1">
//               Paper Code: 101
//             </Typography>
//             <Typography variant="body1">
//               Total Marks: 17
//             </Typography>
//           </div>
//         </div>
//       </header>


//       {/* Body Section */}
//       <Container className="body-container">
//         <Box
//           className="submission-box"
//           sx={{
//             backgroundColor: '#1565c0',
//             color: 'white',
//             padding: '20px',
//             borderRadius: '10px',
//             textAlign: 'center',
//             maxWidth: '500px',
//             margin: 'auto', // Center the box
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '10px', // Space between elements
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//             Successfully submitted the test
//           </Typography>
//           <img src={successlogo} alt="Success Icon" width={80} height={80} />
//           <Typography variant="body1">
//             Please check results after 15 days
//           </Typography>
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default SubmitExam;

import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import logo from '../../assets/nicelogo.png';
import successlogo from '../../assets/cheer-up.png';

const Result = () => {
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
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '20px', }}>
            Your have passed the exam
        </Typography>
        <img src={successlogo} alt="time left" style={{ width: '100px', height: 'auto',margin:'20px'}} />
      </Container>
    </Box>
  );
};

export default Result;
