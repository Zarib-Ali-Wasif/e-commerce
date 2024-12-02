import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CustomerManagement = () => {
  const customers = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      orders: "5",
      lastOrder: "2024-11-30",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      orders: "3",
      lastOrder: "2024-11-28",
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
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Total Orders</TableCell>
            <TableCell>Last Order Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>{customer.lastOrder}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerManagement;
