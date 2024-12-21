import React from 'react';
import { Box, TextField, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Question from './Question';

type QuestionType = 'mcq' | 'text' | 'checkbox' | 'true_false';

interface QuestionPreviewProps {
  question: {
    type: QuestionType; // Explicitly use the union type
    text: string;
    options?: string[];
  };
  onUpdate: (updatedQuestion: any) => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  onUpdate,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    if (question.options) {
      const updatedOptions = [...question.options];
      updatedOptions[index] = value;
      onUpdate({ ...question, options: updatedOptions });
    }
  };

  const handleAddOption = () => {
    if (question.options) {
      onUpdate({ ...question, options: [...question.options, ''] });
    }
  };

  const handleDeleteOption = (index: number) => {
    if (question.options) {
      const updatedOptions = question.options.filter(
        (_: string, i: number) => i !== index
      );
      onUpdate({ ...question, options: updatedOptions });
    }
  };

  return (
    <Box mb={3}>
      <Question
        type={question.type}
        text={question.text}
        options={question.options}
      />
      {(question.type === 'mcq' || question.type === 'checkbox') && (
        <Box>
          {question.options?.map((option: string, index: number) => (
            <Box display="flex" alignItems="center" mb={1} key={index}>
              <TextField
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                fullWidth
                placeholder={`Option ${index + 1}`}
              />
              <IconButton onClick={() => handleDeleteOption(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddOption}>Add Option</Button>
        </Box>
      )}
    </Box>
  );
};

export default QuestionPreview;
