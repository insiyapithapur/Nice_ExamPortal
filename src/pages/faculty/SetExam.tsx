import React from 'react';
import { Typography } from '@mui/material';
import FormBuilder from '../faculty/FormBuilder';
import '../css/SetExam.css';

const SetExam: React.FC = () => {
  return (
    <div className="set-exam-root">
      <Typography variant="h4" gutterBottom className="heading">
        Create Test
      </Typography>
      <div className="set-exam-container">
        <FormBuilder />
      </div>
    </div>
  );
};

export default SetExam;
