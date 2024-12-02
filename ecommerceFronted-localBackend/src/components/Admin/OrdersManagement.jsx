import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const OrdersManagement = () => {
  const orders = [
    {
      id: "12345",
      customer: "John Doe",
      status: "Processing",
      total: "$250",
      date: "2024-12-01",
    },
    {
      id: "12346",
      customer: "Jane Smith",
      status: "Shipped",
      total: "$180",
      date: "2024-12-01",
    },
  ];

  return (
    <TableContainer
      component={Paper}
      style={{ margin: "20px", padding: "20px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "5px" }}
                >
                  Update
                </Button>
                <Button variant="outlined" color="secondary">
                  Refund
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersManagement;
