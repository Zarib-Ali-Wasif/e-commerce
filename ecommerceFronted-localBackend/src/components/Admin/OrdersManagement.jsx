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
} from "@mui/material";
import api from "../../../lib/services/api";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderNumber, status) => {
    try {
      await api.patch(`orders/status/${orderNumber}`, { status });
      fetchOrders(); // Refetch orders to update the list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "100%" }}>
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", padding: "0px 10px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={8}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mt: 2,
                    mb: 2,
                    textAlign: "center",
                    color: "#1C4771",
                  }}
                >
                  Orders Management
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#1C4771" }}>
              {[
                "Order ID",
                "Customer",
                "Address",
                "Status",
                "Total",
                "Payment Method",
                "Order Date",
                "Last Updated",
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
          {loading ? (
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
          ) : (
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderNumber}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.userId.name}</TableCell>
                  <TableCell>{order.address}</TableCell>
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
                  <TableCell>${order.summary.total}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.orderDate.slice(0, 10)}</TableCell>
                  <TableCell>{order.updatedAt.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersManagement;
