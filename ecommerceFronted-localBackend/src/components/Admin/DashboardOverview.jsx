import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Typography, Grid, Box } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { FaDollarSign, FaBox, FaUsers, FaCartPlus } from "react-icons/fa"; // Added Icons

// Redux slices
import {
  fetchCategories,
  fetchProducts,
} from "../../lib/redux/slices/productsSlice";
import { fetchOrders } from "../../lib/redux/slices/ordersSlice";
import { fetchUsers } from "../../lib/redux/slices/usersSlice";
import CategoryStatsOverview from "./CategoryStatsOverview";

// Chart.js components
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
  Filler, // Import the Filler plugin
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
  Legend,
  Filler // Register the Filler plugin
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

  // ################################ Derived metrics (calculations) ################################

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
    { label: "Total Sales", value: totalSales, icon: <FaDollarSign /> },
    { label: "Total Users", value: users?.length || 0, icon: <FaUsers /> },
    { label: "Active Customers", value: activeCustomers, icon: <FaUsers /> },
    { label: "Available Stock", value: inventory, icon: <FaBox /> },
    { label: "Product Categories", value: totalCategories, icon: <FaBox /> },
    { label: "Total Orders", value: totalOrders, icon: <FaCartPlus /> },
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
        data: [
          8000, 4080, 12000, 3909, 10980, 5608, 9700, 6000, 11000, 7500, 6508,
          4590,
        ],
        backgroundColor: "rgba(28, 71, 113, 0.7)",
        borderColor: "#163b56",
        borderWidth: 2,
        hoverBackgroundColor: "#163b56",
        hoverBorderColor: "#1C4771",
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
          "#ff9800",
          "#c51162",
          "#2196f3",
          "#4caf50",
          "#f44336",
        ],
        borderColor: "transparent",
        hoverBorderColor: "rgba(0, 0, 0, 0.1)",
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
        data: [12, 15, 10, 18, 22, 5, 30, 25, 7, 20, 8, 2],
        borderColor: "#1C4771",
        backgroundColor: "rgba(28, 71, 113, 0.2)",
        tension: 0.3,
        fill: true,
        hoverBorderColor: "#163b56",
      },
    ],
  };

  return (
    <Grid container sx={{ my: 14, justifyContent: "center" }}>
      <Grid
        container
        spacing={3}
        style={{
          padding: "30px 20px",
          margin: "0 auto",
          background: "#f4f7fc",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 7.5,
            textAlign: "center",
            width: "100%",
            color: "#1C4771",
          }}
        >
          Overview
        </Typography>
        {loading ? (
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center", width: "100%", color: "#444" }}
          >
            Loading...
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Summary Cards */}
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    borderRadius: "20px",
                    // background: "linear-gradient(135deg, #1C4771, #163b56)",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb={2}
                  >
                    <Box
                      sx={{
                        fontSize: "30px",
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "12px",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: "25px",
                          color: "#1C4771",
                        }}
                      >
                        {metric.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" style={{ color: "#1C4771" }}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "bold",
                      color: "#1C4771",
                    }}
                  >
                    {metric.value.toLocaleString()}
                  </Typography>
                </Card>
              </Grid>
            ))}

            {/* Monthly Sales Bar Chart */}
            <Grid item xs={12} md={6}>
              <Card
                style={{
                  padding: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  background: "#fff",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Monthly Sales Trend
                </Typography>
                <Bar
                  data={salesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                  }}
                />
              </Card>
            </Grid>

            {/* Order Status Pie Chart */}
            <Grid item xs={12} md={6}>
              <Card
                style={{
                  padding: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Order Status Distribution
                </Typography>
                <Doughnut
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                  }}
                />
              </Card>
            </Grid>

            {/* Active Customers Line Chart */}
            <Grid item xs={12} md={6}>
              <Card
                style={{
                  padding: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Active Customers Trend
                </Typography>
                <Line
                  data={activeCustomersData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                  }}
                />
              </Card>
            </Grid>
            <CategoryStatsOverview />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
