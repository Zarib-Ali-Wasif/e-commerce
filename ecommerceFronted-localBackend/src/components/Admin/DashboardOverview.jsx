// export default DashboardOverview;
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Typography, Grid } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";

import {
  fetchCategories,
  fetchProducts,
} from "../../lib/redux/slices/productsSlice";
import { fetchOrders } from "../../lib/redux/slices/ordersSlice";
import { fetchUsers } from "../../lib/redux/slices/usersSlice";

// Register Chart.js components

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Select data from Redux store
  const { productsList, categories } = useSelector((state) => state.products);
  const { ordersList } = useSelector((state) => state.orders);
  const { users } = useSelector((state) => state.users);

  // Fetch data on mount
  useEffect(() => {
    setLoading(true);
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
    dispatch(fetchUsers());
    setLoading(false);
  }, [dispatch]);

  // ################################ Derived metrics (calculations ################################

  // Calculate total sales from ordersList
  const totalSales = ordersList.reduce((acc, order) => {
    const orderTotal = parseFloat(order.summary?.total) || 0; // Ensure total is a number
    return acc + orderTotal;
  }, 0);

  // Calculate total orders
  const totalOrders = ordersList?.length || 0;

  // Calculate active customers
  const activeCustomers = users?.filter((user) => user.is_Active).length || 0;

  // Calculate total stock
  const inventory =
    productsList?.reduce((acc, product) => {
      const productStock = product?.stock || 0; // Safely access stock and handle undefined
      return acc + productStock;
    }, 0) || 0;

  const totalCategories = categories?.length || 0;

  // Metrics data
  const metrics = [
    { label: "Total Sales", value: `$ ${totalSales}` },
    { label: "Total Users", value: users?.length || 0 },
    { label: "Active Customers", value: activeCustomers },
    { label: "Available Stock", value: inventory },
    { label: "Product Categories", value: totalCategories },
    { label: "Total Orders", value: totalOrders },
  ];

  // Prepare chart data
  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Sales ($)",
        // data: ordersList?.map((order) => order.monthlySales) || [],
        data: [800, 400, 1200, 350, 1000, 500, 900, 600, 1100, 700, 650, 450],
        backgroundColor: "#1C4771",
        borderColor: "#163b56",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: [
      "Pending Orders",
      "Processing Orders",
      "Shipped Orders",
      "Delivered Orders",
      "Canceled Orders",
    ],
    datasets: [
      {
        data: [
          ordersList?.filter((order) => order.status === "Pending").length || 0,
          ordersList?.filter((order) => order.status === "Processing").length ||
            0,
          ordersList?.filter((order) => order.status === "Shipped").length || 0,
          ordersList?.filter((order) => order.status === "Delivered").length ||
            0,
          ordersList?.filter((order) => order.status === "Canceled").length ||
            0,
        ],
        backgroundColor: [
          "#e91e63",
          "#2196f3",
          "#ff9800",
          "#4caf50",
          "#f44336",
        ],
      },
    ],
  };

  const activeCustomersData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Customers",
        // data: users?.map((user) => user.is_Active) || [],
        data: [12, 15, 10, 18, 22, 5, 30, 25, 7, 20, 8, 2],
        borderColor: "#1C4771",
        backgroundColor: "rgba(28, 71, 113, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <>
          {/* Summary Cards */}
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h6">{metric.label}</Typography>
                <Typography variant="h4" color="primary">
                  {metric.value.toLocaleString()}
                </Typography>
              </Card>
            </Grid>
          ))}

          {/* Monthly Sales Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Monthly Sales Trend
              </Typography>
              <Bar data={salesData} />
            </Card>
          </Grid>

          {/* Order Breakdown Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Order Breakdown
              </Typography>
              <Doughnut
                data={pieData}
                options={{ maintainAspectRatio: true, aspectRatio: 2 }}
              />
            </Card>
          </Grid>

          {/* Active Customers Line Chart */}
          <Grid item xs={12} md={6}>
            <Card style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Active Customers Over Time
              </Typography>
              <Line data={activeCustomersData} />
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DashboardOverview;
