import React, { useState } from "react";
import Logo from "../assets/ShopEasy-logo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Badge,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext"; // Import "; // Adjust path as needed

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart(); // Access the cart context
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Calculate total items in the cart

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
              <ListItemIcon sx={{ color: "#1C4771" }}>
                {drawerIconsComponent[index]}
              </ListItemIcon>
              <ListItemText primary={name} sx={{ color: "#1C4771" }} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider
          // orientation="vertical"
          sx={{
            // height: "100px",
            // width: "1px",
            border: "0.5px solid #1C4771",
            display: { xs: "flex" },
          }}
        />

        <ListItem sx={{ display: { xs: "flex" } }}>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#1C4771" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account" sx={{ color: "#1C4771" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Grid container id="header" zIndex={1} justifyContent="space-between">
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#dfe5f2",
          display: { xs: "none", md: "flex" },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, mt: 1, ml: 2 }}
          >
            <img
              src={Logo}
              alt="logo"
              height="auto"
              width="100"
              onClick={() => navigate("/")}
            />
          </Typography>

          <Tabs
            sx={{
              display: { xs: "none", md: "flex" },
              "& .MuiTab-root": { color: "#282c34" },
              "& .MuiTabs-indicator": { backgroundColor: "#1C4771" },
            }}
            value={
              tabsName.some(
                (name) =>
                  location.pathname ===
                  (name === "Home" ? "/" : `/${name.toLowerCase()}`)
              )
                ? location.pathname
                : false // Default to false if no match
            }
            textColor="inherit"
          >
            {tabsName.map((name, index) => (
              <Tab
                key={index}
                label={name}
                component={NavLink}
                to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                value={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                sx={{
                  "&.active": {
                    color: "#1C4771",
                    opacity: 1,
                    fontWeight: "bold",
                  },
                  textDecoration: "none",
                }}
              />
            ))}
          </Tabs>

          {/* Account Icon */}
          <IconButton>
            <AccountCircleIcon sx={{ color: "#1C4771", fontSize: 35, ml: 1 }} />
          </IconButton>

          {/* Cart Icon with Badge */}
          <IconButton component={NavLink} to="/cart">
            <Badge
              badgeContent={cartCount}
              color="primary"
              sx={{
                padding: 0.6,
                "& .MuiBadge-badge": {
                  backgroundColor: "#1C4771",
                  color: "white",
                },
              }}
            >
              <ShoppingCartIcon
                sx={{ color: "#1C4771", fontSize: 28, ml: 1 }}
              />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Small Screen AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#dfe5f2",
          display: { xs: "flex", md: "none" },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#1C4771", fontSize: 30 }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ mt: 1 }}>
            <img
              src={Logo}
              alt="logo"
              height="auto"
              width="100"
              onClick={() => navigate("/")}
            />
          </Typography>
          <IconButton component={NavLink} to="/cart">
            <Badge
              badgeContent={cartCount}
              color="primary"
              sx={{
                padding: 0.6,
                "& .MuiBadge-badge": {
                  backgroundColor: "#1C4771",
                  color: "white",
                },
              }}
            >
              <ShoppingCartIcon sx={{ color: "#1C4771", fontSize: 28 }} />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { backgroundColor: "#dfe5f2" },
        }}
      >
        {drawerList}
      </Drawer>
    </Grid>
  );
}

export default Header;
