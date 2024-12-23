import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import {
  fetchUsersAndOrders,
  updateUserStatus,
  setSearchQuery,
  setStatusFilter,
  applyFilters,
} from "./../../lib/redux/slices/usersSlice";

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { filteredUsers, loading, searchQuery, statusFilter } = useSelector(
    (state) => state.users
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchUsersAndOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [searchQuery, statusFilter, dispatch]);

  const handleStatusChange = (userId, status) => {
    dispatch(updateUserStatus({ userId, status }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box>
      <Box
        sx={{
          padding: "20px",
          marginTop: 8,
          maxWidth: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 6,
            textAlign: "center",
            color: "#1C4771",
          }}
        >
          Customer Management
        </Typography>

        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">All Customers</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Deactivated">Deactivated</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search by Name, Email, or Phone"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1C4771" }}>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Total Orders",
                  "Last Order Date",
                  "Status",
                  "Account Created",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "60vh",
                      }}
                    >
                      <CircularProgress size={50} sx={{ color: "#1C4771" }} />
                      <Typography>Loading Customers...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.contactNumber ? user.contactNumber : "-"}
                    </TableCell>
                    <TableCell>{user.totalOrders}</TableCell>
                    <TableCell>
                      {user.lastOrderDate
                        ? user.lastOrderDate.slice(0, 10)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.is_Active ? "Active" : "Deactivated"}
                        onChange={(e) =>
                          handleStatusChange(
                            user._id,
                            e.target.value == "Active" ? true : false
                          )
                        }
                        sx={{ width: "100%" }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Deactivated">Deactivated</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? user.createdAt.slice(0, 10) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {[10, 20, 30].map((num) => (
              <MenuItem key={num} value={num}>
                {num} per page
              </MenuItem>
            ))}
          </Select>

          <Box>
            <Button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              |&lt;
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            <Typography display="inline" mx={2}>
              {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                currentPage * itemsPerPage,
                filteredUsers.length
              )} of ${filteredUsers.length}`}
            </Typography>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredUsers.length}
            >
              &gt;
            </Button>
            <Button
              onClick={() =>
                handlePageChange(Math.ceil(filteredUsers.length / itemsPerPage))
              }
              disabled={currentPage * itemsPerPage >= filteredUsers.length}
            >
              &gt;|
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerManagement;
