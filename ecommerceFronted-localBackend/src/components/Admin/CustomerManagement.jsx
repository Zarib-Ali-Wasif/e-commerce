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
} from "@mui/material";
import api from "../../../lib/services/api";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [customers, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders");
      const orders = response.data;

      const customerMap = new Map();
      orders.forEach((order) => {
        const { userId, orderDate } = order;
        if (!customerMap.has(userId._id)) {
          customerMap.set(userId._id, {
            name: userId.name,
            email: userId.email,
            phone: userId.contactNumber,
            active: userId.is_Active,
            totalOrders: 0,
            lastOrderDate: orderDate,
          });
        }
        const customer = customerMap.get(userId._id);
        customer.totalOrders += 1;
        if (new Date(orderDate) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = orderDate;
        }
      });

      setCustomers([...customerMap.values()]);
      setFilteredCustomers([...customerMap.values()]);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = customers;
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (customer) =>
          (statusFilter === "Active" && customer.active) ||
          (statusFilter === "Deactivated" && !customer.active)
      );
    }
    setFilteredCustomers(filtered);
  };

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
                  "Name",
                  "Email",
                  "Phone",
                  "Total Orders",
                  "Last Order Date",
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
                  <TableCell colSpan={6}>
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.email}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {customer.phone ? customer.phone : "-"}
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>{customer.lastOrderDate.slice(0, 10)}</TableCell>
                    <TableCell>
                      {customer.active ? "Active" : "Deactivated"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CustomerManagement;
