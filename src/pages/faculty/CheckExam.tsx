// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Box,
//   FormControl,
//   Select,
//   MenuItem,
//   Button,
//   InputLabel,
//   Typography,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from '@mui/material';
// import { BorderAll, BorderTop } from '@mui/icons-material';

// const CheckExam = () => {
//   const [course, setCourse] = useState('');
//   const [paper, setPaper] = useState('');
//   const [papers, setPapers] = useState([]);
//   const [selectedExamID, setSelectedExamID] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [examData, setExamData] = useState(null); // State to store fetched exam data

//   useEffect(() => {
//     const fetchPapers = async () => {
//       if (!course) {
//         setPapers([]);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`http://127.0.0.1:8000/faculty/show-unchecked-paper/${course}`);
//         if (!response.ok) throw new Error('Failed to fetch papers');
//         const data = await response.json();
//         setPapers(data);
//       } catch (err) {
//         setError(err.message || 'Something went wrong');
//         setPapers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPapers();
//   }, [course]);

//   const handlePaperChange = (event) => {
//     const selectedPaperCode = event.target.value;
//     setPaper(selectedPaperCode);

//     // Find the selected paper to get the associated student_examID
//     const selectedPaper = papers.find((p) => p.paper_code === selectedPaperCode);
//     setSelectedExamID(selectedPaper?.student_examID || null);
//   };

//   const handleSubmit = async () => {
//     if (!paper || !selectedExamID) {
//       alert('Please select a valid paper and course.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setExamData(null);

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/faculty/retrive-unchecked-paper/${paper}/${selectedExamID}`
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch exam data');
//       }

//       const data = await response.json();
//       setExamData(data); // Store the retrieved data in the state
//     } catch (err) {
//       setError(err.message || 'Something went wrong while fetching the exam data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlechecked = async () => {
//     alert("Done")
//   }
//   return (
//     <Container
//       maxWidth="md"
//       style={{
//         marginTop: '2rem',
//         padding: '2rem',
//         backgroundColor: '#ffffff',
//         borderTop: '10px solid #005AA0',
//         borderRadius: '10px',
//       }}
//     >
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{ color: 'black', fontSize: '24px', textAlign: 'center', fontWeight: 'Bold' }}
//       >
//         CHECK EXAM
//       </Typography>
//       <FormControl fullWidth margin="normal">
//         <InputLabel>Course</InputLabel>
//         <Select value={course} onChange={(e) => setCourse(e.target.value)}>
//           <MenuItem value="HA">HA</MenuItem>
//           <MenuItem value="Tally">Tally</MenuItem>
//           <MenuItem value="CP">CP</MenuItem>
//         </Select>
//       </FormControl>

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Paper</InputLabel>
//         <Select value={paper} onChange={handlePaperChange}>
//           {loading && <MenuItem disabled><em>Loading...</em></MenuItem>}
//           {error && <MenuItem disabled><em>{error}</em></MenuItem>}
//           {!loading && !error && papers.map((item) => (
//             <MenuItem key={item.student_examID} value={item.paper_code}>
//               {`${item.paper_code} - ${item.student_name}`}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {error && (
//         <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
//           {error}
//         </Typography>
//       )}

//       <Box mt={4}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={!course || !paper || loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Submit'}
//         </Button>
//       </Box>

//       {examData && (
//         <Paper elevation={3} sx={{ marginTop: 4, padding: 3,backgroundColor: '#ffffff',borderTop: '10px solid #005AA0',borderRadius: '10px'}}>
//           {/* Header section */}
//           <Box style={{ marginBottom: '20px'}}>
//             <Typography
//               variant="h5"
//               style={{
//                 fontSize: '1.75rem',
//                 fontWeight: 'bold',
//                 marginBottom: '20px',
//                 borderBottomStyle : "ridge"
//               }}
//             >
//               {examData.form_title || 'Untitled Form'}
//             </Typography>

//             <Box style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//               <Typography
//                 style={{
//                   fontSize: '1rem',
//                   color: 'black',
//                   minWidth: 150,
//                   fontWeight: '500',
//                   borderBottomStyle : "ridge"
//                 }}
//               >
//                 {examData.form_course || 'N/A'}
//               </Typography>

//               <Typography
//                 style={{
//                   flex: 1,
//                   color: 'black',
//                   fontSize: '1rem',
//                   fontWeight: '500',
//                   borderBottomStyle : "ridge"
//                 }}
//               >
//                 {examData.form_code || 'Nov-2024-001'}
//               </Typography>

//               <Typography
//                 style={{
//                   flex: 1,
//                   color: 'black',
//                   fontSize: '1rem',
//                   fontWeight: '500',
//                   borderBottomStyle : "ridge"
//                 }}
//               >
//                 {examData.time || 'Time not specified'}
//               </Typography>

//               <Typography
//                 variant="body1"
//                 style={{
//                   marginLeft: 'auto',
//                   color: 'black',
//                   fontSize: '1rem',
//                   fontWeight: '500',
//                   borderBottomStyle : "ridge"
//                 }}
//               >
//                 Total Questions: {examData.totalQuestions || 'N/A'}
//               </Typography>

//               <Typography
//                 variant="body1"
//                 style={{
//                   marginLeft: '10px',
//                   color: 'black',
//                   fontSize: '1rem',
//                   fontWeight: '500',
//                   borderBottomStyle : "ridge"
//                 }}
//               >
//                 Total Marks: {examData.totalMarks || 'N/A'}
//               </Typography>
//             </Box>
//           </Box>

//           {/* <Typography variant="h6" gutterBottom>
//             Exam Details
//           </Typography>
//           <Typography variant="body1"><strong>Title:</strong> {examData.form_title}</Typography>
//           <Typography variant="body1"><strong>Course:</strong> {examData.form_course}</Typography>
//           <Typography variant="body1"><strong>Code:</strong> {examData.form_code}</Typography>
//           <Typography variant="body1"><strong>Creator:</strong> {examData.form_creater}</Typography>
//           <Typography variant="body1"><strong>Student Name:</strong> {examData.student_name}</Typography>
//           <Typography variant="body1"><strong>Email:</strong> {examData.student_email}</Typography>

//           <Typography variant="h6" sx={{ marginTop: 2 }}>Questions</Typography> */}

//           {/* Questions section */}
//           <List>
//               {examData.questions.map((question, index) => (
//                 <ListItem key={index} divider style={{borderBlockStyle:"solid",backgroundColor:"yellow"}}>
//                   <ListItemText
//                     primary={
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="body2" sx={{ width: '70%',fontSize:"18px",fontWeight:"bold" }}>
//                           {`${index + 1}. ${question.question_text}`}
//                         </Typography>
//                         <Typography variant="body2" sx={{ width: '30%', textAlign: 'right' }}>
//                           <strong>Type:</strong> {question.question_type}
//                         </Typography>
//                       </Box>
//                     }
//                     secondary={
//                       <>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
//                           <Typography variant="body2" sx={{ width: '70%' }}>
//                             <strong>Correct Answer:</strong> {question.correct_answer}
//                           </Typography>
//                           <Typography variant="body2" sx={{ width: '30%', textAlign: 'right' }}>
//                             <strong>Score:</strong> {question.score}
//                           </Typography>
//                         </Box>

//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
//                           <Typography variant="body2" sx={{ width: '70%' }}>
//                             <strong>Student Response:</strong> {question.student_response || 'Not Answered'}
//                           </Typography>
//                           <Box sx={{ width: '30%' }}>
//                             <Typography variant="body2" sx={{ color: '#005AA0', fontSize: '16px' }}>
//                               Enter Score
//                             </Typography>
//                             <input
//                               type="number"
//                               min="0"
//                               max={question.score}
//                               defaultValue="0"
//                               style={{
//                                 fontSize: '18px',
//                                 padding: '4px',
//                                 width: '100%',
//                                 height: '30px',
//                                 border: '1px solid #ccc',
//                                 borderRadius: '4px',
//                                 backgroundColor: '#005AA0',
//                                 color: 'white',
//                               }}
//                             />
//                           </Box>
//                         </Box>
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>

//             <Button
//                 variant="contained"
//                 onClick={handlechecked}
//                 style={{ backgroundColor: '#005AA0', color: '#ffffff', marginTop: '1rem' }}
//             >
//               Submit
//             </Button>
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default CheckExam;
import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

const CheckExam = () => {
  const [course, setCourse] = useState('');
  const [paper, setPaper] = useState('');
  const [allPapers, setAllPapers] = useState({}); // To store the complete API response
  const [papers, setPapers] = useState([]); // To store the filtered papers based on the selected course
  const [selectedExamID, setSelectedExamID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState(null); // State to store fetched exam data

  // Fetch the data when the component renders
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/faculty/show-unchecked-paper/dropdown');
        if (!response.ok) throw new Error('Failed to fetch dropdown data');
        const data = await response.json();
        setAllPapers(data); // Store the complete response
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setAllPapers({});
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Update papers when course changes
  useEffect(() => {
    if (course) {
      setPapers(allPapers[course] || []);
    } else {
      setPapers([]);
    }
    setPaper('');
    setSelectedExamID(null);
  }, [course, allPapers]);

  const handlePaperChange = (event) => {
    const selectedPaperCode = event.target.value;
    setPaper(selectedPaperCode);

    // Find the selected paper to get the associated student_examID
    const selectedPaper = papers.find((p) => p.paper_code === selectedPaperCode);
    setSelectedExamID(selectedPaper?.student_examID || null);
  };

  const handleSubmit = async () => {
    if (!paper || !selectedExamID) {
      alert('Please select a valid paper and course.');
      return;
    }

    setLoading(true);
    setError(null);
    setExamData(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/faculty/retrive-unchecked-paper/${paper}/${selectedExamID}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exam data');
      }

      const data = await response.json();
      console.log("data ",data)
      setPaper("")
      setExamData(data); // Store the retrieved data in the state
      console.log("ExamData ",examData)
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching the exam data');
    } finally {
      setLoading(false);
    }
  };

    const handlechecked = async () => {
      // Prepare the data to be sent to the API
      const scoresData = examData.questions.map((question) => ({
          response_id: question.response_id,
          score: parseFloat(document.getElementById(`score-${question.response_id}`).value) || 0, // Get score from the input field
      }));

      setLoading(true);
      setError(null);

      try {
        console.log("JSON.stringify(scoresData) ",JSON.stringify(scoresData));
          // Send the request to the SubmitScoreAPIView API
          const response = await axios.post('http://127.0.0.1:8000/faculty/submit-score/',scoresData);
          // const response = await fetch('http://127.0.0.1:8000/faculty/submit-score/', {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify(scoresData),
          // });

          if (!(response.status == 200)) {
              throw new Error('Failed to submit scores');
          }

          const result = await response.data;
          alert(result.message || 'Scores submitted successfully!');
          // Optionally, reset or refresh the state
          setExamData(null); // Clear the exam data after submission
      } catch (err) {
          setError(err.message || 'Something went wrong while submitting the scores');
      } finally {
          setLoading(false);
      }
  };


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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'black', fontSize: '24px', textAlign: 'center', fontWeight: 'Bold' }}
      >
        CHECK EXAM
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Course</InputLabel>
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <MenuItem value="HA">HA</MenuItem>
          <MenuItem value="Tally">Tally</MenuItem>
          <MenuItem value="CP">CP</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Paper</InputLabel>
        <Select value={paper} onChange={handlePaperChange}>
          {loading && <MenuItem disabled><em>Loading...</em></MenuItem>}
          {error && <MenuItem disabled><em>{error}</em></MenuItem>}
          {!loading && !error && papers.map((item) => (
            <MenuItem key={item.student_examID} value={item.paper_code}>
              {`${item.student_name} - ${item.paper_code}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!course || !paper || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      {examData && (
        <Paper elevation={3} sx={{ marginTop: 4, padding: 3,backgroundColor: '#ffffff',borderTop: '10px solid #005AA0',borderRadius: '10px'}}>
          {/* Header section */}
          <Box style={{ marginBottom: '20px'}}>
            <Typography
              variant="h5"
              style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                borderBottomStyle : "ridge"
              }}
            >
              {examData.form_title || 'Untitled Form'}
            </Typography>

            <Box style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Typography
                style={{
                  fontSize: '1rem',
                  color: 'black',
                  minWidth: 150,
                  fontWeight: '500',
                  borderBottomStyle : "ridge"
                }}
              >
                {examData.form_course || 'N/A'}
              </Typography>

              <Typography
                style={{
                  flex: 1,
                  color: 'black',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderBottomStyle : "ridge"
                }}
              >
                {examData.form_code || 'Nov-2024-001'}
              </Typography>

              <Typography
                style={{
                  flex: 1,
                  color: 'black',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderBottomStyle : "ridge"
                }}
              >
                {examData.time || 'Time not specified'}
              </Typography>

              <Typography
                variant="body1"
                style={{
                  marginLeft: 'auto',
                  color: 'black',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderBottomStyle : "ridge"
                }}
              >
                Total Questions: {examData.totalQuestions || 'N/A'}
              </Typography>

              <Typography
                variant="body1"
                style={{
                  marginLeft: '10px',
                  color: 'black',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderBottomStyle : "ridge"
                }}
              >
                Total Marks: {examData.totalMarks || 'N/A'}
              </Typography>
            </Box>
          </Box>

          {/* <Typography variant="h6" gutterBottom>
            Exam Details
          </Typography>
          <Typography variant="body1"><strong>Title:</strong> {examData.form_title}</Typography>
          <Typography variant="body1"><strong>Course:</strong> {examData.form_course}</Typography>
          <Typography variant="body1"><strong>Code:</strong> {examData.form_code}</Typography>
          <Typography variant="body1"><strong>Creator:</strong> {examData.form_creater}</Typography>
          <Typography variant="body1"><strong>Student Name:</strong> {examData.student_name}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {examData.student_email}</Typography>

          <Typography variant="h6" sx={{ marginTop: 2 }}>Questions</Typography> */}

          {/* Questions section */}
          <List>
              {examData.questions.map((question, index) => (
                <ListItem key={index} divider style={{}}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ width: '70%',fontSize:"18px",fontWeight:"bold" }}>
                          {`${index + 1}. ${question.question_text}`}
                        </Typography>
                        <Typography variant="body2" sx={{ width: '30%', textAlign: 'right' }}>
                          <strong>Type:</strong> {question.question_type}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                          <Typography variant="body2" sx={{ width: '70%' }}>
                            <strong>Correct Answer:</strong> {question.correct_answer}
                          </Typography>
                          <Typography variant="body2" sx={{ width: '30%', textAlign: 'right' }}>
                            <strong>Score:</strong> {question.score}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                          <Typography variant="body2" sx={{ width: '70%' }}>
                            <strong>Student Response:</strong> {question.student_response || 'Not Answered'}
                          </Typography>
                          <Box sx={{ width: '30%' }}>
                            <Typography variant="body2" sx={{ color: 'black', fontSize: '16px' }}>
                              Enter Score
                            </Typography>
                            <input
                              type="number"
                              min="0"
                              max={question.score}
                              defaultValue="0"
                              id={`score-${question.response_id}`}  // Added dynamic id
                              style={{
                                fontSize: '18px',
                                padding: '4px',
                                width: '100%',
                                height: '30px',
                                boxShadow: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#005AA0',
                              }}
                            />
                          </Box>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Button
                variant="contained"
                onClick={handlechecked}
                style={{ backgroundColor: '#005AA0', color: '#ffffff', marginTop: '1rem' }}
            >
              Submit
            </Button>
        </Paper>
      )}
    </Container>
  );
};

export default CheckExam;
