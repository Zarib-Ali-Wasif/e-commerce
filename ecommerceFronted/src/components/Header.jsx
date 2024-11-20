import React, { useState } from "react";
import Logo from "../assets/ShopEasy-logo.png";
import { NavLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";

function Header() {
  const location = useLocation();
  const tabsName = ["Home", "Products", "About", "Contact"];
  const drawerIconsComponent = [
    <HomeOutlinedIcon />,
    <InventoryIcon />,
    <InfoIcon />,
    <PhoneIcon />,
  ];

  const [open, setOpen] = useState(false);
  function toggleDrawer(newOpen) {
    return () => setOpen(newOpen);
  }
  const drawerList = (
    <Box
      sx={{
        width: "250px",
        height: "auto",
        color: "white",
      }}
      onClick={toggleDrawer(false)}
    >
      <List>
        {tabsName.map((name, index) => (
          <ListItem key={name}>
            <ListItemButton
              component={NavLink}
              to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {drawerIconsComponent[index]}
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider
          // orientation="vertical"
          sx={{
            // height: "100px",
            // width: "1px",
            border: "0.5px solid gray",
            display: { xs: "flex", sm: "none" },
          }}
        />

        <ListItem sx={{ display: { xs: "flex", sm: "none" } }}>
          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Grid container id="header" zIndex={1} justifyContent="space-between">
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#282c34",
          display: { xs: "none", md: "flex" },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, mt: 1, ml: 2 }}
          >
            <img src={Logo} alt="logo" height="auto" width="100" />
          </Typography>

          <Tabs
            sx={{
              display: { xs: "none", md: "flex" },
              "& .MuiTab-root": { color: "white" },
              "& .MuiTabs-indicator": { backgroundColor: "#1C4771" },
              // gap: 3, // use box for gap property
            }}
            value={location.pathname}
            textColor="inherit"
          >
            {tabsName.map(
              (name, index) => (
                console.log(name),
                (
                  <Tab
                    key={index}
                    label={name}
                    component={NavLink}
                    to={name == "Home" ? "/" : `/${name.toLowerCase()}`}
                    value={name == "Home" ? "/" : `/${name.toLowerCase()}`}
                    sx={{
                      "&.active": { color: "#1C4771" },
                      textDecoration: "none",
                    }}
                  />
                )
              )
            )}
          </Tabs>

          <IconButton>
            <AccountCircleIcon sx={{ color: "#1C4771", fontSize: 38, ml: 3 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Small Screen AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#282c34",
          display: { xs: "flex", md: "none" },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#1C4771", fontSize: 30 }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ mt: 1 }}>
            <img src={Logo} alt="logo" height="auto" width="100" />
          </Typography>
          <IconButton sx={{ display: { xs: "none", sm: "flex" } }}>
            <AccountCircleIcon sx={{ color: "#1C4771", fontSize: 38, ml: 3 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { backgroundColor: "#282c34" },
        }}
      >
        {drawerList}
      </Drawer>
    </Grid>
  );
}

export default Header;
