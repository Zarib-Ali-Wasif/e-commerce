import React, { useEffect, useState } from "react";
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
import api from "../../../lib/services/api";

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsersAndOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, statusFilter]);

  const fetchUsersAndOrders = async () => {
    setLoading(true);
    try {
      const [usersResponse, ordersResponse] = await Promise.all([
        api.get("user"),
        api.get("orders"),
      ]);

      const usersData = usersResponse.data;
      const ordersData = ordersResponse.data;

      // Map orders to each user
      const userOrderMap = usersData.map((user) => {
        const userOrders = ordersData.filter(
          (order) => order.userId._id === user._id
        );
        const lastOrderDate = userOrders.length
          ? userOrders.reduce((latest, order) =>
              new Date(order.orderDate) > new Date(latest.orderDate)
                ? order
                : latest
            ).orderDate
          : null;

        // Check if last order date is more than 6 months ago
        const currentDate = new Date();
        const diffInMonths = lastOrderDate
          ? (currentDate - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24 * 30)
          : 0;

        // If last order was more than 6 months ago, change status
        if (diffInMonths > 6 && user.is_Active) {
          handleStatusChange(user._id, false); // Deactivate user
        }

        return {
          ...user,
          totalOrders: userOrders.length,
          lastOrderDate,
        };
      });

      setUsers(userOrderMap);
      setFilteredUsers(userOrderMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone.includes(searchQuery)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (user) =>
          (statusFilter === "Active" && user.is_Active) ||
          (statusFilter === "Deactivated" && !user.is_Active)
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await api.patch(`user/status/${userId}`, { status });
      fetchUsersAndOrders(); // Refetch data to update the table
    } catch (error) {
      console.error("Failed to update status", error);
    }
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
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
                        value={user.active ? "Active" : "Deactivated"}
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
