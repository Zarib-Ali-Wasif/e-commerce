import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Chip,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { ShoppingCart, AccessTime, LocalShipping } from "@mui/icons-material";
import api from "../../lib/services/api";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For storing selected order details
  const [openDialog, setOpenDialog] = useState(false); // For controlling dialog visibility

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/recent");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Set selected order
    setOpenDialog(true); // Open the dialog/modal
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog/modal
    setSelectedOrder(null); // Reset selected order
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "0 auto" }} />;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  return (
    <Box mt={18} mb={8} p={2}>
      <Typography
        variant="h4"
        textAlign={"center"}
        fontWeight={"bold"}
        color="primary"
        mb={5}
      >
        Recent Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography align="center" variant="body1" color="textSecondary">
          No recent orders found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card
                sx={{ mb: 2, boxShadow: 3, cursor: "pointer" }}
                onClick={() => handleOrderClick(order)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    Order #{order.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(order.orderDate).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" color="primary">
                      ${order.summary.total}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={order.status === "Pending" ? "warning" : "success"}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog/Modal */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          fontWeight={"bold"}
        >{`Order #${selectedOrder?.orderNumber}`}</DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedOrder.email}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {selectedOrder.address}
              </Typography>
              <Typography variant="body1">
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                Items
              </Typography>
              {selectedOrder.orderItems.map((item) => (
                <Paper key={item.productId} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {item.productName}
                  </Typography>
                  <Typography variant="body2">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                  <Typography variant="body2" color="primary">
                    Total: ${item.total}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography>No order details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecentOrders;
