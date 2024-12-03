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
            phone: userId.phone,
            active: userId.active,
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
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={2} mb={2}>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Total Orders</TableCell>
              <TableCell>Last Order Date</TableCell>
              <TableCell>Status</TableCell>
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
                  <TableCell>{customer.phone}</TableCell>
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
  );
};

export default CustomerManagement;
