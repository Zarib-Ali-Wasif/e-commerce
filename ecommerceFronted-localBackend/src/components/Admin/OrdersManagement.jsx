import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../../../lib/services/api";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, searchQuery, startDate, endDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toString().includes(searchQuery) ||
          order.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        );
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusChange = async (orderNumber, status) => {
    try {
      await api.patch(`orders/status/${orderNumber}`, { status });
      fetchOrders(); // Refetch orders to update the list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const paginatedOrders = filteredOrders.slice(
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
          Orders Management
        </Typography>
        <Grid container spacing={2} mb={4}>
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">All Orders</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Canceled">Canceled</MenuItem>
            </Select>
          </Grid>

          {/* Search Field */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search by Order ID or Customer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              placeholder="Search by Order ID or Customer Name"
            />
          </Grid>

          {/* Start Date Picker */}
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                slots={{
                  textField: (params) => <TextField {...params} fullWidth />,
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* End Date Picker */}
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                slots={{
                  textField: (params) => <TextField {...params} fullWidth />,
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <TableContainer
          sx={{
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1C4771" }}>
                {[
                  "Order ID",
                  "Customer",
                  "Address",
                  "Total",
                  "Payment Method",
                  "Order Date",
                  "Last Updated",
                  "Status",
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
                  <TableCell colSpan={8}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="50vh"
                    >
                      <CircularProgress size={100} />
                      <Typography variant="body1" mt={2}>
                        Loading orders...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.userId.name}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>${order.summary.total}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.orderDate.slice(0, 10)}</TableCell>
                    <TableCell>{order.updatedAt.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order.orderNumber, e.target.value)
                        }
                        sx={{ width: "100%" }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Canceled">Canceled</MenuItem>
                      </Select>
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
                filteredOrders.length
              )} of ${filteredOrders.length}`}
            </Typography>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredOrders.length}
            >
              &gt;
            </Button>
            <Button
              onClick={() =>
                handlePageChange(
                  Math.ceil(filteredOrders.length / itemsPerPage)
                )
              }
              disabled={currentPage * itemsPerPage >= filteredOrders.length}
            >
              &gt;|
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrdersManagement;
