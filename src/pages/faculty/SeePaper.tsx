import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  SelectChangeEvent,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import axios from 'axios';

const SeePaper = () => {
    const [course, setCourse] = useState("");
    const [paper, setPaper] = useState("");
    const [papersByCourse, setPapersByCourse] = useState<any>({}); // Store papers grouped by course
    const [loading, setLoading] = useState(false);
    const [paperDetails, setPaperDetails] = useState<any | null>(null);

    // Fetch papers from API when the component is mounted
    useEffect(() => {
        const fetchPaperList = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://127.0.0.1:8000/faculty/paper-list/");
                setPapersByCourse(response.data); // Set the paper list grouped by course
            } catch (error) {
                console.error("Error fetching paper list:", error);
                setPapersByCourse({}); // Reset papers if error occurs
            } finally {
                setLoading(false);
            }
        };

        fetchPaperList(); // Call the function when component is mounted
    }, []);

    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        const selectedCourse = event.target.value as string;
        setCourse(selectedCourse);
        setPaper(""); // Reset paper when course changes
        setPaperDetails(null); // Clear paper details when course changes
    };

    const handleSubmit = async () => {
      if (!paper) {
        alert("Please select a paper.");
        return;
      }

      // Find the selected paper using paper_code
      const selectedPaper = papersByCourse[course]?.find((paperData: any) => paperData.paper_code === paper);
      if (!selectedPaper) {
        console.error("Selected paper not found in papers list.");
        return;
      }

      try {
        // Make API call to fetch paper details
        const response = await axios.get(`http://127.0.0.1:8000/faculty/form/view/${selectedPaper.form_id}`);
        setPaperDetails(response.data); // Save the response data to state
      } catch (error) {
        console.error("Error fetching paper details:", error);
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
          className="heading" 
          sx={{
            color:"black",
            fontSize:"24px",
            textAlign:"center",
            fontWeight:"bold",
          }}>
            VIEW PAPER
        </Typography>

        {/* Course Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Course</InputLabel>
          <Select value={course} onChange={handleCourseChange}>
            <MenuItem value="HA">HA</MenuItem>
            <MenuItem value="Tally">Tally</MenuItem>
            <MenuItem value="CP">CP</MenuItem>
          </Select>
        </FormControl>

        {/* Paper Selector */}
        <FormControl fullWidth margin="normal" disabled={!course || loading}>
          <InputLabel>Paper</InputLabel>
          <Select value={paper} onChange={(e) => setPaper(e.target.value)}>
            {papersByCourse[course]?.map((paperData: any) => (
              <MenuItem key={paperData.form_id} value={paperData.paper_code}>
                  {`${paperData.paper_title} - ${paperData.paper_code}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !paper}
          >
              Submit
          </Button>
        </Box>

        {/* Display Paper Details */}
        {paperDetails && (
          <Box mt={4}>
            <Card variant="outlined" sx={{backgroundColor:"#f9f9f9"}}>
              <CardContent>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Title:</strong> {paperDetails.paper_title}</Typography>
                    <Typography><strong>Course:</strong> {paperDetails.course}</Typography>
                    <Typography><strong>Paper Code:</strong> {paperDetails.paper_code}</Typography>
                    <Typography><strong>Description:</strong> {paperDetails.description}</Typography>
                    <Typography><strong>Total Score:</strong> {paperDetails.total_score}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Box mt={4}>
              {paperDetails.questions.map((question: any) => (
                <Card key={question.question_id} variant="outlined" sx={{ marginBottom: '16px', backgroundColor:"#f9f9f9" }}>
                  <CardContent>
                    <Typography><strong>Q{question.question_id}:</strong> {question.question_text}</Typography>
                    <Typography><strong>Type:</strong> {question.question_type}</Typography>
                    <Typography><strong>Score:</strong> {question.score}</Typography>
                    
                    {question.choices && question.choices.length > 0 ? (
                      <Box>
                        <ul style={{ marginTop: "0px",padding : "0px",listStyleType: "none" }}>
                          {question.choices.map((choice: any, index: number) => (
                            <li key={choice.choice_id}>
                              <strong>{String.fromCharCode(65 + index)}.</strong>{choice.choice_text}
                            </li>
                          ))}
                        </ul>
                    </Box>                                        
                    ) : null }
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    );
};

export default SeePaper;
