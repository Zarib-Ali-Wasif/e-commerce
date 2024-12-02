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
} from "@mui/material";
import api from "../../../lib/services/api";

const OrdersManagement = () => {
  // const orders = [
  //   {
  //     id: "12345",
  //     customer: "John Doe",
  //     status: "Processing",
  //     total: "$250",
  //     date: "2024-12-01",
  //   },
  //   {
  //     id: "12346",
  //     customer: "Jane Smith",
  //     status: "Shipped",
  //     total: "$180",
  //     date: "2024-12-01",
  //   },
  // ];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(orders);

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
                borderRadius: "40px",
              }}
            >
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Order ID
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Customer
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Address
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Status
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Total
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Payment Method
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Date
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
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
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.summary.total}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.orderDate.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{ marginRight: "8px", backgroundColor: "#1C4771" }}
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
