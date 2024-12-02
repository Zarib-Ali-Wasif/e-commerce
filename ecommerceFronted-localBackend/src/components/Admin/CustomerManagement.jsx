import React from "react";
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
    <Box sx={{ padding: "20px" }}>
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", padding: "0px 10px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}>
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
                  Customer Management
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
                Name
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Email
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Phone
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Total Orders
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}
              >
                Last Order Date
              </TableCell>
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
    </Box>
  );
};

export default CustomerManagement;
