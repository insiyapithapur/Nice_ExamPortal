import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Radio, Select, TextField } from "@mui/material";
import axios from "axios";
import { Key, useState } from "react";

interface Question {
  id: number;
  type: "mcq" | "text" | "checkbox" | "true_false";
  text: string;
  options?: string[];
  correctAnswers?: number[]; // For checkbox, we store multiple correct answers
  correctAnswer?: string; // For MCQ, we store a single correct answer
  marks: number;
  saved: boolean; // Track saved state
}

const FormBuilder: React.FC = () => {
  const [course, setCourse] = useState("");
  const [paperCode, setPaperCode] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState<number | string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [papertime, setpapertime] = useState("");

  const handleAddQuestion = (index: number, type: Question["type"]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], type };
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = [
      ...(updatedQuestions[questionIndex].options || []),
      "",
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswersChange = (
    questionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    const correctAnswers = value
      .split(",")
      .map((item) => parseInt(item.trim()))
      .filter((item) => !isNaN(item));
    updatedQuestions[questionIndex].correctAnswers = correctAnswers;
    setQuestions(updatedQuestions);
  };

  const saveQuestion = (index: number) => {
    setQuestions((prev: any[]) =>
      prev.map((q, i) => (i === index ? { ...q, saved: true } : q))
    );
  };

  const editQuestion = (index: number) => {
    setQuestions((prev: any[]) =>
      prev.map((q, i) => (i === index ? { ...q, saved: false } : q))
    );
  };

  const handleGenerateQuestions = () => {
    const count = Number(numQuestions);
    if (count >= 1) {
      const newQuestions: Question[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        type: "text",
        text: "",
        marks: 0,
        saved: false, // Initialize as unsaved
      }));
      setQuestions(newQuestions);
    }
  };

  // Check if all questions are saved
  const allQuestionsSaved = questions.every((question: { saved: any; }) => question.saved);

  const handleSubmit = async () => {
    const userId = localStorage.getItem("user");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }
    const payload = {
      user: userId,
      paper_code: paperCode,
      paper_title: paperTitle, 
      course: course,
      total_score: questions.reduce((acc, question) => acc + question.marks, 0),
      questions: questions.map((question) => {
        let questionData: any = {
          question_text: question.text,
          question_type: question.type,
          score: question.marks,
        };
        // Add choices and answer key based on the question type
        if (question.type === "mcq" || question.type === "checkbox") {
          questionData.choices = question.options?.map((option, index) => ({
            choice_text: option,
            is_answer: question.correctAnswers?.includes(index),
          }));
        } else {
          questionData.answer_key = question.correctAnswer || "";
        }
  
        return questionData;
      }),
    };
  
    try {
      // Send the POST request to the backend
      const response = await axios.post("http://127.0.0.1:8000/faculty/form/create", payload);
  
      if (response.status === 201) {
        alert(response.data.message); 
        setCourse("");
        setPaperCode("");
        setNumQuestions("");
        setPaperTitle("");
        setQuestions([]);
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error || "An error occurred while creating the exam.");
      } else {
        alert("Network error. Please try again later.");
      }
    }
  };

  const renderQuestionInput = (question: Question, index: number) => {
    return (
      <Box>
        <TextField
          label="Question Text"
          fullWidth
          value={question.text}
          onChange={(e) =>
            setQuestions((prev: any[]) =>
              prev.map((q, i) =>
                i === index ? { ...q, text: e.target.value } : q
              )
            )
          }
          margin="normal"
          disabled={question.saved} // Disable when saved
        />
        <TextField
          label="Marks"
          type="number"
          fullWidth
          value={question.marks}
          onChange={(e) =>
            setQuestions((prev: any[]) =>
              prev.map((q, i) =>
                i === index ? { ...q, marks: Number(e.target.value) } : q
              )
            )
          }
          margin="normal"
          disabled={question.saved} // Disable when saved
        />
        {/* Render options based on type */}
        {(() => {
          switch (question.type) {
            case "mcq":
              return (
                <Box>
                  {(question.options || []).map((option: unknown, optIndex: number) => (
                    <Box
                      key={`opt-${optIndex}`}
                      display="flex"
                      alignItems="center"
                    >
                      <Radio disabled />
                      <TextField
                        label={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        margin="normal"
                        disabled={question.saved} // Disable when saved
                      />
                    </Box>
                  ))}
                  <TextField
                    label="Correct Answer Index"
                    type="number"
                    fullWidth
                    value={question.correctAnswer || ""}
                    onChange={(e) =>
                      setQuestions((prev: any[]) =>
                        prev.map((q, i) =>
                          i === index
                            ? { ...q, correctAnswer: Number(e.target.value) }
                            : q
                        )
                      )
                    }
                    margin="normal"
                    disabled={question.saved} // Disable when saved
                  />
                  {!question.saved && (
                    <Button onClick={() => handleAddOption(index)}>
                      Add Option
                    </Button>
                  )}
                </Box>
              );
            case "checkbox":
              return (
                <Box>
                  {(question.options || []).map((option: unknown, optIndex: number) => (
                    <Box
                      key={`opt-${optIndex}`}
                      display="flex"
                      alignItems="center"
                    >
                      <Checkbox
                        checked={question.correctAnswers?.includes(optIndex) || false}
                        onChange={() =>
                          handleCorrectAnswersChange(index, optIndex.toString())
                        }
                        disabled={question.saved} // Disable when saved
                      />
                      <TextField
                        label={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        margin="normal"
                        disabled={question.saved} // Disable when saved
                      />
                    </Box>
                  ))}
                  <TextField
                    label="Correct Answer(s) (Comma-separated Indices)"
                    type="text"
                    fullWidth
                    value={question.correctAnswers?.join(", ") || ""}
                    onChange={(e) =>
                      handleCorrectAnswersChange(index, e.target.value)
                    }
                    margin="normal"
                    disabled={question.saved} // Disable when saved
                  />
                  {!question.saved && (
                    <Button onClick={() => handleAddOption(index)}>
                      Add Option
                    </Button>
                  )}
                </Box>
              );
            case "true_false":
              return (
                <Box>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Answer Key</InputLabel>
                    <Select
                      value={question.correctAnswer || ""}
                      onChange={(e) =>
                        setQuestions((prev: any[]) =>
                          prev.map((q, i) =>
                            i === index ? { ...q, correctAnswer: e.target.value } : q
                          )
                        )
                      }
                      disabled={question.saved} // Disable when saved
                    >
                      <MenuItem value="True">True</MenuItem>
                      <MenuItem value="False">False</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              );
            case "text":
              return (
                <TextField
                  label="Answer Key"
                  fullWidth
                  value={question.correctAnswer || ""}
                  onChange={(e) =>
                    setQuestions((prev: any[]) =>
                      prev.map((q, i) =>
                        i === index ? { ...q, correctAnswer: e.target.value } : q
                      )
                    )
                  }
                  margin="normal"
                  disabled={question.saved}
                />
              );
            default:
              return null;
          }
        })()}
        <Box mt={2}>
          {question.saved ? (
            <Button variant="outlined" onClick={() => editQuestion(index)}>
              Edit
            </Button>
          ) : (
            <Button variant="contained" onClick={() => saveQuestion(index)}>
              Save
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box p={4} sx={{ backgroundColor: "white" }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Course</InputLabel>
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <MenuItem value="HA">HA</MenuItem>
          <MenuItem value="Tally">Tally</MenuItem>
          <MenuItem value="CP">CP</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Paper Code"
        fullWidth
        value={paperCode}
        onChange={(e) => setPaperCode(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Paper Title" // New input for paper title
        fullWidth
        value={paperTitle}
        onChange={(e) => setPaperTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Paper Time (Ex: 1hr)"
        fullWidth
        value={papertime}
        onChange={(e) => setpapertime(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Number of Questions"
        fullWidth
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleGenerateQuestions}
        sx={{ backgroundColor: "#primary" }}
      >
        Generate Questions
      </Button>
      <Box mt={4} width="100%">
        {questions.map((question: { id: Key | null | undefined; type: any; }, index: number) => (
          <Box key={question.id} mt={2} border="1px solid #ddd" p={2}>
            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={question.type}
                onChange={(e) =>
                  handleAddQuestion(index, e.target.value as Question["type"])
                }
              >
                <MenuItem value="mcq">MCQ</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="true_false">True/False</MenuItem>
              </Select>
            </FormControl>
            {renderQuestionInput(question, index)}
          </Box>
        ))}
      </Box>
      <Box mt={4}>
        {questions.length > 0 && ( // Conditionally render the button
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!allQuestionsSaved}
          >
            Submit
          </Button>
        )}
      </Box>

    </Box>
  );
};

export default FormBuilder;
