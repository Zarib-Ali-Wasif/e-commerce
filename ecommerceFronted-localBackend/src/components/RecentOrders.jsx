import React, { useEffect, useState } from "react";
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
  Grid,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentOrders } from "../lib/redux/slices/ordersSlice";

const RecentOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null); // For storing selected order details
  const [openDialog, setOpenDialog] = useState(false); // For controlling dialog visibility

  const dispatch = useDispatch();
  const { recentOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Set selected order
    setOpenDialog(true); // Open the dialog/modal
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog/modal
    setSelectedOrder(null); // Reset selected order
  };

  // Define a mapping for status and colors
  const statusColorMap = {
    Pending: "warning",
    Processing: "secondary",
    Shipped: "primary",
    Delivered: "success",
    Canceled: "error",
  };

  return (
    <Box mt={0} mb={5} p={2} minHeight="70vh" height="100%">
      <Typography
        variant="h4"
        sx={{
          color: "#1C4771",
          fontWeight: "bold",
          textAlign: "center",
          mb: 5,
        }}
      >
        My Orders
      </Typography>

      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress size={50} />
          <Typography variant="body1" mt={2}>
            Loading orders...
          </Typography>
        </Box>
      ) : recentOrders.length === 0 ? (
        <Typography align="center" variant="body1" color="textSecondary">
          No recent orders found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {recentOrders.map((order) => (
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
                      // color={order.status === "Pending" ? "warning" : "success"}
                      color={statusColorMap[order.status] || "default"} // Default if status doesn't match
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
                <strong>Status:</strong> {selectedOrder.status}
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
              <Typography variant="body1">
                <strong>Total:</strong> {selectedOrder.summary.total}
              </Typography>

              <Typography
                variant="h6"
                sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
              >
                Items
              </Typography>
              {selectedOrder.orderItems.map((item) => (
                <Paper key={item.productId} sx={{ p: 2, mb: 1 }}>
                  <img
                    src={item.image}
                    width={40}
                    height={40}
                    alt={`Image of ${item.productName.slice(0, 10)} ...`}
                  />

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
