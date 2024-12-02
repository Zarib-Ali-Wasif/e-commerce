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
  const [statusUpdate, setStatusUpdate] = useState({}); // Track status updates
  const [buttonColor, setButtonColor] = useState({}); // Track button colors

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = (orderNumber, value) => {
    setStatusUpdate({ ...statusUpdate, [orderNumber]: value });
  };

  const updateOrderStatus = async (orderNumber) => {
    const status = statusUpdate[orderNumber] || "";
    if (!status) return alert("Please select a valid status.");

    try {
      await api.patch(`orders/status/${orderNumber}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderNumber === orderNumber ? { ...order, status } : order
        )
      );

      setButtonColor({ ...buttonColor, [orderNumber]: "green" });
      setTimeout(() => {
        setButtonColor({ ...buttonColor, [orderNumber]: "#1C4771" });
      }, 2000);

      alert("Order status updated successfully.");
    } catch (error) {
      alert("Failed to update order status.");
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
            <TableRow
              style={{
                backgroundColor: "#1C4771",
                color: "white",
                fontWeight: 600,
              }}
            >
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Order ID
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Address
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Payment Method
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <Box display="flex" justifyContent="center" height="50vh">
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
                  <TableCell>{order.userId?.name}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>
                    <Select
                      value={statusUpdate[order.orderNumber] || order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderNumber, e.target.value)
                      }
                      fullWidth
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Canceled">Canceled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{order.summary.total}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.orderDate.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor:
                          buttonColor[order.orderNumber] || "#1C4771",
                        color: "white",
                      }}
                      onClick={() => updateOrderStatus(order.orderNumber)}
                    >
                      Update
                    </Button>
                  </TableCell>
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
