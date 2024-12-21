import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CheckExamForm: React.FC = () => {
  const [course, setCourse] = useState("");
  const [paper, setPaper] = useState("");
  const [papers, setPapers] = useState<string[]>([]); // Store paper codes
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch papers when course is selected
  useEffect(() => {
    const fetchPapers = async () => {
      if (!course) {
        setPapers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://127.0.0.1:8000/faculty/show-unchecked-paper/${course}`);
        if (!response.ok) {
          throw new Error("Failed to fetch papers");
        }
        const data = await response.json();
        const paperCodes = data.map((item: { paper_code: string }) => item.paper_code); // Extract paper codes
        setPapers(paperCodes);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [course]);

  const handleSubmit = () => {
    console.log("Submitted Data:", { course, paper });
    alert("Form submitted successfully!");
  };

  return (
    <Box p={4} sx={{ backgroundColor: "white", width: "90%", height: "90%", borderRadius: "20px" }}>
      {/* Course Select Field */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Course</InputLabel>
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <MenuItem value="HA">HA</MenuItem>
          <MenuItem value="Tally">Tally</MenuItem>
          <MenuItem value="CP">CP</MenuItem>
        </Select>
      </FormControl>

      {/* Paper Code Input Field */}
      <FormControl fullWidth margin="normal" disabled={!course || loading}>
        <InputLabel>Paper</InputLabel>
        <Select value={paper} onChange={(e) => setPaper(e.target.value)}>
          {loading && <MenuItem value=""><em>Loading...</em></MenuItem>}
          {error && <MenuItem value=""><em>{error}</em></MenuItem>}
          {!loading && !error && papers.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
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
          disabled={!course || !paper || loading} // Disable button if fields are empty or loading
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CheckExamForm;
