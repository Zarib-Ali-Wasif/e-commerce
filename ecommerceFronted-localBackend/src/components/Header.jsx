import React, { useState, useEffect } from "react";
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
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../lib/redux/slices/authSlice";
import { clearCart } from "./../lib/redux/slices/cartSlice";
import api from "./../lib/services/api";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Calculate total items in the cart
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userId = localStorage.getItem("userId"); // Get userId from local storage
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Fetch user info by userId
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`user/findUserById/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    isAuthenticated ? fetchUserInfo() : setUserInfo({});
  }, [isAuthenticated, userId]);

  const tabsName = ["Home", "Products", "About", "Contact"];
  const drawerIconsComponent = [
    <HomeOutlinedIcon />,
    <InventoryIcon />,
    <InfoIcon />,
    <PhoneIcon />,
  ];

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For account dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Toggle drawer for small screens
  function toggleDrawer(newOpen) {
    return () => setOpen(newOpen);
  }

  // Handle account dropdown menu open/close
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

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
        <Divider sx={{ border: "0.5px solid #1C4771" }} />

        {/* Show different menu items based on authentication status */}
        {isAuthenticated ? (
          <Box mt={2}>
            {/* Role-Based Menu Item */}
            <ListItem>
              <ListItemButton
                onClick={() =>
                  navigate(
                    userInfo.role === "Admin"
                      ? "/admin-panel"
                      : "/manage-account"
                  )
                }
              >
                <ListItemIcon sx={{ color: "#1C4771" }}>
                  {userInfo.role === "Admin" ? (
                    <AdminPanelSettingsIcon />
                  ) : (
                    <ManageAccountsIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    userInfo.role === "Admin" ? "Admin Panel" : "Manage Account"
                  }
                  sx={{ color: "#1C4771" }}
                />
              </ListItemButton>
            </ListItem>

            {/* Show Admin Settings only if Admin and Authenticated */}
            {userInfo.role === "Admin" && isAuthenticated && (
              <ListItem>
                <ListItemButton onClick={() => navigate("/admin-settings")}>
                  <ListItemIcon sx={{ color: "#1C4771" }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" sx={{ color: "#1C4771" }} />
                </ListItemButton>
              </ListItem>
            )}

            {/* Logout Menu Item */}
            <ListItem>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ color: "#1C4771" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "#1C4771" }} />
              </ListItemButton>
            </ListItem>
          </Box>
        ) : (
          <Box mt={2}>
            <ListItem>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemIcon sx={{ color: "#1C4771" }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" sx={{ color: "#1C4771" }} />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/signup")}>
                <ListItemIcon sx={{ color: "#1C4771" }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Signup" sx={{ color: "#1C4771" }} />
              </ListItemButton>
            </ListItem>
          </Box>
        )}
      </List>
    </Box>
  );

  return (
    <Grid container id="header" zIndex={1} justifyContent="space-between">
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#dfe5f2", display: { xs: "none", md: "flex" } }}
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
              style={{ cursor: "pointer" }}
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
                : false
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

          {/* Cart Icon with Badge */}
          <Box component={NavLink} to="/cart">
            <Badge
              badgeContent={cartCount}
              color="primary"
              sx={{
                mr: 1.3,
                ml: 0.5,
                padding: 0.6,
                "& .MuiBadge-badge": {
                  backgroundColor: "#1C4771",
                  color: "white",
                },
              }}
            >
              <ShoppingCartIcon
                sx={{ color: "#1C4771", fontSize: 28, ml: 2 }}
              />
            </Badge>
          </Box>

          {/* Account  with Dropdown */}
          {isAuthenticated ? (
            <Avatar
              sx={{
                width: 35,
                height: 35,
                marginRight: 2,
                border: "2px solid #1C4771",
                cursor: "pointer",
                ml: 2,
              }}
              alt="User Avatar"
              src={userInfo.avatar}
              onClick={handleClick} // Opens the dropdown
            />
          ) : (
            <IconButton onClick={handleClick}>
              <AccountCircleIcon
                sx={{ color: "#1C4771", fontSize: 35, ml: 2 }}
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Small Screen AppBar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#dfe5f2", display: { xs: "flex", md: "none" } }}
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
              style={{ cursor: "pointer" }}
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
        PaperProps={{ sx: { backgroundColor: "#dfe5f2" } }}
      >
        {drawerList}
      </Drawer>

      {/* Account Dropdown Menu */}
      <Menu
        sx={{
          mt: 2,
          "& .MuiMenu-paper": { backgroundColor: "#dfe5f2" },
        }}
        anchorEl={anchorEl}
        open={dropdownOpen}
        onClose={handleClose}
      >
        {isAuthenticated
          ? [
              <MenuItem
                key="role-specific"
                onClick={() => {
                  navigate(
                    userInfo.role === "Admin"
                      ? "/admin-panel"
                      : "/manage-account"
                  );
                  handleClose();
                }}
              >
                <ListItemIcon>
                  {userInfo.role === "Admin" ? (
                    <AdminPanelSettingsIcon sx={{ color: "#1C4771" }} />
                  ) : (
                    <ManageAccountsIcon sx={{ color: "#1C4771" }} />
                  )}
                </ListItemIcon>
                {userInfo.role === "Admin" ? "Admin Panel" : "Manage Account"}
              </MenuItem>,
              userInfo.role === "Admin" && (
                <MenuItem
                  key="admin-settings"
                  onClick={() => {
                    navigate("/admin-settings");
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon sx={{ color: "#1C4771" }} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
              ),
              <MenuItem
                key="logout"
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon sx={{ color: "#1C4771" }} />
                </ListItemIcon>
                Logout
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="login"
                onClick={() => {
                  navigate("/login");
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <LoginIcon sx={{ color: "#1C4771" }} />
                </ListItemIcon>
                Login
              </MenuItem>,
              <MenuItem
                key="signup"
                onClick={() => {
                  navigate("/signup");
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: "#1C4771" }} />
                </ListItemIcon>
                Signup
              </MenuItem>,
            ]}
      </Menu>
    </Grid>
  );
}

export default Header;
