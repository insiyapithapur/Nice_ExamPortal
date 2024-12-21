import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Checkbox,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';

type QuestionType = 'checkbox' | 'text' | 'true_false' | 'multipleChoice';

interface Question {
  type: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string | number[] | boolean | number;
  points: number;
}

const GoogleFormCreator = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    title: 'Untitled Form',
    code: 'Nov-2024-001',
    time: '1hrs',
    questions: [] as Question[],
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = async (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value as string,
    }));

    if (name === "code") {
      try {
        console.log("course : ",formData.courseName)
        const course = formData.courseName; 
        const papercode = value as string;
        console.log("papercode : ",papercode)

        // Call the API
        const response = await axios.get(
          `http://127.0.0.1:8000/faculty/checking-papercode/${course}/${papercode}`
        );

        // Set validation message if successful
        setValidationMessage(response.data.message || "Paper code is valid.");
        setError(""); // Clear any previous error
        setTimeout(() => {
          setValidationMessage("");
        }, 10000); // 10seconds
      } catch (err: any) {
        // Set error message from API response
        if (err.response && err.response.data.error) {
          setError(err.response.data.error);
          setValidationMessage("");
        } else {
          setError("An unexpected error occurred.");
          setValidationMessage("");
        }
        setTimeout(() => {
          setError("");
        }, 10000); // 10seconds
      }
    }
  };


  // const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name as string]: value as string,
  //   });
  // };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          type: 'text',
          questionText: 'Untitled Question',
          options: [],
          correctAnswer: 'Correct Answer',
          points: 1,
        },
      ],
    });
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("user");
    // Transform the formData to match the backend requirements
    const payload = {
      user: user,
      paper_code: formData.code,
      paper_title: formData.title,
      course: formData.courseName,
      total_score: formData.questions.reduce((sum, question) => sum + Number(question.points || 0), 0),
      questions: formData.questions.map((question) => {
        return {
          question_text: question.questionText,
          question_type: question.type,
          score: question.points,
          answer_key:
            question.type === 'text' || question.type === 'true_false'
              ? String(question.correctAnswer)
              : '',
          choices:
            question.type === 'multipleChoice' || question.type === 'checkbox'
              ? question.options.map((option, index) => ({
                  choice_text: option,
                  is_answer: Array.isArray(question.correctAnswer)
                    ? (question.correctAnswer as number[]).includes(index + 1)
                    : question.correctAnswer === index + 1,
                }))
              : [],
        };
      }),
    };

  console.log("payload",payload);
    try {
      // Make the API request
      const response = await axios.post('http://127.0.0.1:8000/faculty/form/create', payload);
      console.log('API Response:', response.data);

      if(response.status == 201){
        alert('Form created successfully!');
        setFormData({
          courseName: '',
          title: 'Untitled Form',
          code: 'Nov-2024-001',
          time: '1hrs',
          questions: [],
        });
      }
    } catch (error: any) {
      console.error('Error creating form:', error.response?.data || error.message);
      alert('Failed to create form. Please try again.');
    }
  };

  const handleQuestionChange = (index: number, key: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][key] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };  

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = [...updatedQuestions[questionIndex].options, ''];
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const totalMarks = formData.questions.reduce((sum, question) => sum + Number(question.points || 0), 0);
  const totalQuestions = formData.questions.length;

  return (
    <Container
      maxWidth="md"
      style={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderTop: '10px solid #005AA0',
        borderRadius: '10px',
      }}
    >
      {/* Header Section */}
      <Box style={{ marginBottom: '20px' }}>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="standard"
          placeholder="Untitled Form"
          fullWidth
          InputProps={{ style: { fontSize: '1.75rem', fontWeight: 'bold' } }}
          style={{ marginBottom: '10px' , fontSize: '1.75rem'}}
        />
        <Box style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FormControl style={{ minWidth: 150 }}>
            <Select
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              displayEmpty
              variant="standard"
              style={{ fontSize: '1rem', color: 'black' }}
            >
              <MenuItem value="" disabled>
                Select Course
              </MenuItem>
              <MenuItem value="HA">HA</MenuItem>
              <MenuItem value="Tally">Tally</MenuItem>
              <MenuItem value="CP">CP</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField
            name="code"
            value={formData.code}
            onChange={handleChange}
            variant="standard"
            placeholder="Nov-2024-001"
            style={{ flex: 1, color: "black" }}
            InputProps={{ style: { color: "black" } }}
          />
          {validationMessage && <p style={{ color: "green",fontSize:"12px" }}>{validationMessage}</p>}
          {error && <p style={{ color: "red" , fontSize:"12px"}}>{error}</p>} */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <TextField
              name="code"
              value={formData.code}
              onChange={handleChange}
              variant="standard"
              placeholder="Nov-2024-001"
              style={{ flex: 1, color: "black",}}
              InputProps={{ style: { color: "black" } }}
            />
            {validationMessage && <p style={{ color: "green", fontSize: "12px", margin: "0",width:"100px"}}>{validationMessage}</p>}
            {error && <p style={{ color: "red", fontSize: "12px", margin: "0",width:"100px" }}>{error}</p>}
          </div>
          {/* <TextField
            name="code"
            value={formData.code}
            onChange={handleChange}
            variant="standard"
            placeholder="Nov-2024-001"
            style={{ flex: 1, color: 'black' }}
            InputProps={{ style: { color: 'black' } }}
          /> */}
          <TextField
            name="time"
            value={formData.time}
            onChange={handleChange}
            variant="standard"
            placeholder="Time"
            style={{ flex: 1, color: 'black' }}
          />
          <Typography variant="body1" style={{ marginLeft: 'auto', color: 'black' }}>
            Total Questions: {totalQuestions}
          </Typography>
          <Typography variant="body1" style={{ marginLeft: '10px', color: 'black' }}>
            Total Marks: {totalMarks}
          </Typography>
        </Box>
      </Box>

      {/* Question Section */}
      {formData.questions.map((question, qIndex) => (
        <Box
          key={qIndex}
          style={{
            marginBottom: '15px',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* Question text and type */}
          <Box style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <TextField
              label="Question"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              variant="standard"
              name='Question'
              placeholder='Untitled Question'
              fullWidth
              multiline
              minRows={1}
              maxRows={8}
              style={{ 
                flex: 7,
                '& .MuiInputBase-root': {
                  minHeight: '56px',
                  height: 'auto',
                  alignItems: 'flex-start',
                }
              }}
              InputProps={{ 
                style: { 
                  fontSize: '1rem',
                  fontWeight: "bold",
                  height: 'auto',
                  overflow: 'hidden',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }
              }}
            />
            <FormControl style={{ flex: 3 }}>
              <Select
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value as QuestionType)}
                variant="outlined"
              >
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="true_false">True/False</MenuItem>
                <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
              </Select>
            </FormControl>
          </Box>

        {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
            <Box style={{ marginBottom: '10px' }}>
              {question.options.map((option, oIndex) => (
                <Box key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  {question.type === 'multipleChoice' ? (
                    <Radio
                      checked={question.correctAnswer === oIndex + 1}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex + 1)}
                      style={{ padding: '4px' }}
                    />
                  ) : (
                    <Checkbox
                      checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(oIndex + 1)}
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                        const newCorrectAnswers = e.target.checked
                          ? [...currentAnswers, oIndex + 1].sort((a, b) => a - b)
                          : currentAnswers.filter(num => num !== oIndex + 1);
                        handleQuestionChange(qIndex, 'correctAnswer', newCorrectAnswers);
                      }}
                      style={{ padding: '4px' }}
                    />
                  )}
                  <TextField
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    variant="standard"
                    fullWidth
                    InputProps={{
                      style: { fontSize: '1rem', width: "100%" },
                    }}
                    style={{ flex: 1, marginBottom: '5px' }}
                  />
                  <IconButton 
                    onClick={() => handleRemoveOption(qIndex, oIndex)} 
                    style={{ marginLeft: '0px', width: "20%" }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="text"
                startIcon={<Add />}
                onClick={() => handleAddOption(qIndex)}
                sx={{
                  marginTop: '5px',
                  color: '#005AA0',
                  width: '20%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#003366',
                    backgroundColor: 'transparent',
                  },
                  '&:active': {
                    animation: 'blink 0.2s ease-in-out',
                  }
                }}
              >
                Add Option
              </Button>
            </Box>
          )}
          
        <Box
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '10px',
            alignItems: 'center',
          }}
        >
              {question.type === 'text' && (
              <TextField
                placeholder='Correct Answer'
                label="Answer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                variant="standard"
                fullWidth
                multiline
                minRows={1}
                maxRows={10}
                style={{ 
                  flex: 4,
                  '& .MuiInputBase-root': {
                    minHeight: '56px',
                    height: 'auto',
                    alignItems: 'flex-start'
                  },
                  '& .MuiInputBase-input': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    minHeight: '1.4375em',
                    resize: 'vertical'
                  }
                }}
                InputProps={{ 
                  style: { 
                    fontSize: '1rem',
                    height: 'auto',
                    overflow: 'hidden'
                  } 
                }}
              />
            )}

            {question.type === 'true_false' && (
              <Box style={{ display: 'flex', gap: '10px', alignItems: 'center' , width:"80%"}}>
                <Button
                  variant='outlined'
                  color={question.correctAnswer === true ? '#005AA0' : '#005AA0'}
                  onClick={() => handleQuestionChange(qIndex, 'correctAnswer', true)}
                  style={{
                    width:"20%",
                    backgroundColor: question.correctAnswer === true ? '#005AA0' : 'white',
                    color: question.correctAnswer === true ? 'white' : '#005AA0',
                  }}
                >
                  True
                </Button>
                <Button
                  variant='outlined'
                  color={question.correctAnswer === false ? '#005AA0' : '#005AA0'}
                  onClick={() => handleQuestionChange(qIndex, 'correctAnswer', false)}
                  style={{
                    width:"20%",
                    backgroundColor: question.correctAnswer === false ? '#005AA0' : 'white',
                    color: question.correctAnswer === false ? 'white' : '#005AA0',
                  }}
                >
                  False
                </Button>
              </Box>
            )}
          <TextField
            label="Points"
            type="number"
            variant="standard"
            inputProps={{
              min: 1,
              step: 1
            }}
            value={question.points}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              handleQuestionChange(qIndex, 'points', value);
            }}
            style={{ flex: 1 }}
          />
        </Box>

        <Button
          variant="outlined"
          onClick={() => handleRemoveQuestion(qIndex)}
          sx={{
            color: '#005AA0',
            width: '30%',
            animation: 'none',
            borderColor: 'transparent',
            '&:hover': {
              animation: 'blink 0.5s linear infinite',
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            },
            '&:active': {
              animation: 'blink 0.3s linear 2',
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            },
            '@keyframes blink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0 },
            },
          }}
        >
          Remove Question
        </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={handleAddQuestion}
        style={{ backgroundColor: '#005AA0', color: '#ffffff', marginTop: '1rem' }}
      >
        Add Question
      </Button>
      <Button
        variant="contained"
        onClick={handleSubmit}
        style={{ backgroundColor: '#005AA0', color: '#ffffff' , marginTop:"10px"}}
      >
        Submit Form
      </Button>
    </Container>
  );
};

export default GoogleFormCreator;

const rootStyles = document.createElement('style');
rootStyles.innerHTML = `
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color : #f9f9f9;
  }
`;
document.head.appendChild(rootStyles);