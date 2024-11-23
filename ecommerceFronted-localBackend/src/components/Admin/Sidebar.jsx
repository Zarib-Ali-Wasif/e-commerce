// src/components/Sidebar.jsx
import React from "react";
import { Box, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => (
  <Box
    sx={{
      width: 240,
      bgcolor: "#1E1E2F",
      color: "white",
      height: "100vh",
      padding: 2,
    }}
  >
    <List>
      {[
        { text: "Dashboard", icon: <DashboardIcon /> },
        { text: "Users", icon: <PeopleIcon /> },
        { text: "Analytics", icon: <BarChartIcon /> },
        { text: "Settings", icon: <SettingsIcon /> },
      ].map(({ text, icon }) => (
        <ListItem button key={text}>
          <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default Sidebar;
