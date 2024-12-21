import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/nicelogo.png";

const SidebarLayout: React.FC = () => {
  const navItems = [
    { label: "SET EXAM", path: "/app/set-exam" },
    { label: "CHECK EXAM", path: "/app/check-exam" },
    { label: "VIEW PAPER", path: "/app/see-paper" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100%",width:"100%"}}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "20%",
          backgroundColor: "#f9f9f9",
          color: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop:"20px",
          margin : "0px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img src={logo} alt="Login Banner" width={150} height={100} style={{marginBottom:"20px"}}/>
        <List sx={{ width: "100%"}}>
          {navItems.map((item, index) => (
            <ListItem
              button
              component={NavLink}
              to={item.path}
              key={index}
              sx={{
                color: "black",
                marginTop : "5px",
                borderRadius : "50px",
                fontWeight:"bold",
                "&.active": {
                  backgroundColor: "#ECE5DD",
                  color: "black",
                  borderRadius : "50px",
                  fontWeight:"bold"
                },
                "&:hover": {
                  backgroundColor: "#ECE5DD",
                  color: "black",
                  borderRadius : "50px", 
                  fontWeight:"bold"
                },
              }}            
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        <Outlet /> {/* Render the current route's component */}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
