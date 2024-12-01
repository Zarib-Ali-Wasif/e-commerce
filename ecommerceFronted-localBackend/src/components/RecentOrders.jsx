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
} from "@mui/material";
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box mt={18}>
      <Typography variant="h5" gutterBottom>
        Recent Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>No recent orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            sx={{ mb: 2 }}
            onClick={() => handleOrderClick(order)}
          >
            <CardContent>
              <Typography variant="h6">Order #{order.orderNumber}</Typography>
              <Typography>
                Date: {new Date(order.orderDate).toLocaleString()}
              </Typography>
              <Typography>Total: ${order.summary.total}</Typography>
              <Typography>Status: {order.status}</Typography>
            </CardContent>
          </Card>
        ))
      )}

      {/* Order Details Dialog/Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle fontWeight={"bold"}>
          #{selectedOrder?.orderNumber}{" "}
        </DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Box>
              <Typography variant="body1">
                Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Email: {selectedOrder.email}
              </Typography>
              <Typography variant="body1">
                Address: {selectedOrder.address}
              </Typography>
              <Typography variant="body1">
                Payment Method: {selectedOrder.paymentMethod}
              </Typography>
              <Typography variant="body1">
                Total: ${selectedOrder.summary.total}
              </Typography>
              <Typography variant="body1">
                Status: {selectedOrder.status}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                Items
              </Typography>
              {selectedOrder.orderItems.map((item) => (
                <Box key={item.productId} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    productName: {item?.productName}
                  </Typography>
                  <Typography variant="body2">
                    Quantity: {item?.quantity}
                  </Typography>
                  <Typography variant="body2">
                    Price: ${item?.price}{" "}
                  </Typography>
                  <Typography variant="body2">Total: ${item?.total}</Typography>
                </Box>
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
