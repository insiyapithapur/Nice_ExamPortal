import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';

interface QuestionProps {
  type: 'mcq' | 'checkbox' | 'text' | 'true_false';
  text: string;
  options?: string[];
  onChange?: (value: any) => void;
}

const Question: React.FC<QuestionProps> = ({ type, text, options, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <Box mb={2}>
      <Box mb={1}>{text}</Box>
      {type === 'mcq' && options && (
        <RadioGroup>
          {options.map((option, idx) => (
            <FormControlLabel
              key={idx}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      )}
      {type === 'checkbox' && options && (
        <>
          {options.map((option, idx) => (
            <FormControlLabel
              key={idx}
              control={<Checkbox />}
              label={option}
            />
          ))}
        </>
      )}
      {type === 'text' && (
        <TextField
          fullWidth
          placeholder="Your answer"
          variant="outlined"
          onChange={handleChange}
        />
      )}
      {type === 'true_false' && (
        <RadioGroup>
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      )}
    </Box>
  );
};

export default Question;
