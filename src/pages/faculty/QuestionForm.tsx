import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

interface Question {
  id: number;
  text: string;
  type: string;
  options: string[];
}

const QuestionForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      type: "shortAnswer",
      options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleAddOption = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleDeleteOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Question Form
      </Typography>
      {questions.map((question) => (
        <Paper
          key={question.id}
          style={{ marginBottom: 16, padding: 16 }}
          elevation={3}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Text"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(question.id, "text", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={question.type}
                onChange={(e) =>
                  handleQuestionChange(question.id, "type", e.target.value)
                }
              >
                <MenuItem value="shortAnswer">Short Answer</MenuItem>
                <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </Select>
            </Grid>

            {question.type !== "shortAnswer" && (
              <Grid item xs={12}>
                {question.options.map((option, index) => (
                  <Grid container spacing={1} key={index} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(question.id, index, e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() =>
                          handleDeleteOption(question.id, index)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="text"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleAddOption(question.id)}
                >
                  Add Option
                </Button>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteQuestion(question.id)}
                startIcon={<DeleteIcon />}
              >
                Delete Question
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddQuestion}
        startIcon={<AddCircleOutlineIcon />}
      >
        Add Question
      </Button>
    </div>
  );
};

export default QuestionForm;
