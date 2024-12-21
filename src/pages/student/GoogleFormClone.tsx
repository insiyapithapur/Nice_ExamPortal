import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  TextField
} from '@mui/material';
import axios from 'axios';

const GoogleFormClone = () => {
  const exam_id = localStorage.getItem("exam_id");
  const [formData, setFormData] = useState({});
  const [examDetails, setExamDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: Arial, sans-serif;
        background-color: #f0ebf8;
      }
  
      /* Hide scrollbars in Firefox */
      body {
        scrollbar-width: none;
      }
  
      /* Hide scrollbars in IE/Edge */
      body {
        -ms-overflow-style: none;
      }

      #root {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }
    `;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/student/exam/${exam_id}`);
        setExamDetails(response.data);
      } catch (error) {
        console.error('Error fetching exam data:', error);
        alert('Failed to fetch exam details');
      } finally {
        setLoading(false);
      }
    };

    if (exam_id) {
      fetchExamData();
    }
  }, [exam_id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const payload = {
      form_id: 7,
      user : exam_id,
      question: {},
    };
  
    Object.keys(formData).forEach((key) => {
      const questionId = key.replace('question_', '');
      payload.question[questionId] = formData[key];
    });
  
    try {
      console.log("payload on submit",payload);
      const response = await axios.post('http://127.0.0.1:8000/student/submit/exam/', payload);
      if (response.status === 201) {
        alert('Exam submitted successfully!');
        navigate('/student/exam');
      } else {
        alert('Failed to submit the exam. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('An error occurred while submitting the exam.');
    }
  };  

  if (loading) {
    return <div style={{"backgroundColor" : "white"}}></div>
  }

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop:"10px",
        backgroundColor: '#f0ebf8',
        color: '#000000',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderTop: '10px solid #005AA0',
        width: '100%',
        overflow: 'auto',
        height: '100%',
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none', // For IE and Edge
      }}
    >
      {/* Heading Section */}
      <Box
        style={{
          marginBottom: '10px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h5" style={{textAlign:"center",marginBottom: '0.5rem' ,fontWeight:"bold"}}>
          Course: {examDetails.form.course}
        </Typography>
        <Typography variant="h6" style={{textAlign:"center",marginBottom: '0.3rem' }}>
          Title: {examDetails.form.title}
        </Typography>
        <Typography variant="h6" style={{textAlign:"center",marginBottom: '0.3rem' }}>
          Code: {examDetails.form.code}
        </Typography>
        <Typography variant="h6" style={{ textAlign:"center" }}>
          Total Marks: {examDetails.form.score}
        </Typography>
      </Box>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        {examDetails.questions.map((question: any) => {
          return (
            <Box
              key={question.id}
              style={{
                marginBottom: '10px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <FormControl component="fieldset" fullWidth margin="none">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="8px"
                >
                  <FormLabel component="legend" 
                    sx={{ 
                      color: 'black',
                      '&.Mui-focused': { color: 'black' }, 
                      '&.Mui-disabled': { color: 'black' },
                      '&:hover': { color: 'black' }, 
                    }}
                  >
                    {question.question}
                  </FormLabel>
                  <span style={{ fontSize: '14px' }}>{question.score} points</span>
                </Box>

                {question.question_type === 'multipleChoice' && (
                  <RadioGroup
                    name={`question_${question.id}`}
                    value={formData[`question_${question.id}`] || ''}
                    onChange={handleChange}
                  >
                    {question.choices.map((choice: any) => (
                      <FormControlLabel
                        key={choice.id}
                        value={choice.choice}
                        control={<Radio />}
                        label={choice.choice}
                      />
                    ))}
                  </RadioGroup>
                )}
                {question.question_type === 'checkbox' && (
                  <Box sx={{display:"flex",flexDirection:"column"}}>
                    {question.choices.map((choice: any) => (
                      <FormControlLabel
                        key={choice.id}
                        control={
                          <Checkbox
                            checked={
                              formData[`question_${question.id}`]?.includes(choice.choice) ||
                              false
                            }
                            onChange={(e) => {
                              const { checked } = e.target;
                              setFormData((prevFormData) => {
                                const currentValues =
                                  prevFormData[`question_${question.id}`] || [];
                                const updatedValues = checked
                                  ? [...currentValues, choice.choice]
                                  : currentValues.filter((value: string) => value !== choice.choice);
                                return {
                                  ...prevFormData,
                                  [`question_${question.id}`]: updatedValues,
                                };
                              });
                            }}
                          />
                        }
                        label={choice.choice}
                      />
                    ))}
                  </Box>
                )}

                {question.question_type === 'text' && (
                  <TextField
                    name={`question_${question.id}`}
                    value={formData[`question_${question.id}`] || ''}
                    onChange={handleChange}
                    multiline
                    minRows={1}  
                    maxRows={20}  
                    variant="outlined"
                    fullWidth
                    placeholder="Type your answer here..."
                    sx={{
                      padding: '8px 12px',
                      '& .MuiOutlinedInput-root': {
                        padding: '4px 12px',
                      },
                      '& .MuiOutlinedInput-root textarea': {
                        scrollbarWidth: 'none', // For Firefox
                        '&::-webkit-scrollbar': {
                          display: 'none', // For Webkit-based browsers
                        },
                      },
                    }}
                  />
                )}

                {question.question_type === 'true_false' && (
                  <RadioGroup
                    name={`question_${question.id}`}
                    value={formData[`question_${question.id}`] || ''}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                )}
              </FormControl>
            </Box>
          );
        })}

        {/* Submit Button */}
        <Button
          type="submit"
          onSubmit={handleSubmit}
          variant="contained"
          style={{
            backgroundColor: '#005AA0',
            color: '#ffffff',
            marginTop: '1rem',
            transition: 'all 0.3s ease', 
          }}
          fullWidth
          sx={{
            '&:hover': {
              backgroundColor: '#003d7a',  
              transform: 'scale(1.05)', 
            },
            '&:active': {
              backgroundColor: '#002a55', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
            },
          }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default GoogleFormClone;
