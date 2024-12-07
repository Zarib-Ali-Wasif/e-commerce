// import React from "react";
// import { Card, Typography, Grid } from "@mui/material";
// import { Doughnut, Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   PointElement,
//   LineElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register the necessary Chart.js components
// ChartJS.register(
//   ArcElement, // Fix: Register ArcElement for Doughnut chart
//   PointElement,
//   LineElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const DashboardOverview = () => {
//   // Metrics data
//   const metrics = [
//     { label: "Total Sales", value: 12345 },
//     { label: "Total Orders", value: 345 },
//     { label: "Active Customers", value: 120 },
//     { label: "Inventory", value: 50 },
//     { label: "Total Users", value: 500 },
//     { label: "Pending Tasks", value: 5 },
//   ];

//   // Sales Data (Bar Chart)
//   const salesData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         label: "Monthly Sales ($)",
//         data: [3000, 4000, 3500, 5000, 4500, 6000],
//         backgroundColor: "#1C4771",
//         borderColor: "#163b56",
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Order Breakdown Data (Pie Chart)
//   const pieData = {
//     labels: ["Completed Orders", "Pending Orders", "Cancelled Orders"],
//     datasets: [
//       {
//         data: [280, 45, 20],
//         backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
//       },
//     ],
//   };

//   // Active Customers Data (Line Chart)
//   const activeCustomersData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "Active Customers",
//         data: [80, 100, 120, 140, 160, 120],
//         borderColor: "#1C4771",
//         backgroundColor: "rgba(28, 71, 113, 0.2)",
//         tension: 0.3,
//       },
//     ],
//   };

//   return (
//     <Grid container spacing={3} style={{ padding: "20px" }}>
//       {/* Summary Cards */}
//       {metrics.map((metric, index) => (
//         <Grid item xs={12} sm={6} md={4} key={index}>
//           <Card style={{ padding: "20px", textAlign: "center" }}>
//             <Typography variant="h6">{metric.label}</Typography>
//             <Typography variant="h4" color="primary">
//               {metric.value.toLocaleString()}
//             </Typography>
//           </Card>
//         </Grid>
//       ))}

//       {/* Monthly Sales Bar Chart */}
//       <Grid item xs={12} md={6}>
//         <Card style={{ padding: "20px" }}>
//           <Typography variant="h6" gutterBottom>
//             Monthly Sales Trend
//           </Typography>

//           <Bar
//             data={salesData}
//             options={{
//               maintainAspectRatio: true,
//               aspectRatio: 1.95,

//               elements: {
//                 bar: {
//                   // borderWidth: 2,
//                   // borderRadius: 60,
//                   barThickness: "2px", // controls the width of the bar
//                 },
//               },
//             }}
//           />
//         </Card>
//       </Grid>

//       {/* Order Breakdown Pie Chart */}
//       <Grid item xs={12} md={6}>
//         <Card style={{ padding: "20px" }}>
//           <Typography variant="h6" gutterBottom>
//             Order Breakdown
//           </Typography>
//           <Doughnut data={pieData} />
//         </Card>
//       </Grid>

//       {/* Active Customers Line Chart */}
//       <Grid item xs={12}>
//         <Card style={{ padding: "20px" }}>
//           <Typography variant="h6" gutterBottom>
//             Active Customers Over Time
//           </Typography>
//           <Line data={activeCustomersData} />
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default DashboardOverview;
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Typography, Grid } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";

import { fetchProducts } from "../../lib/redux/slices/productsSlice";
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

  // Metrics data
  const metrics = [
    { label: "Total Sales", value: totalSales },
    { label: "Total Orders", value: totalOrders },
    { label: "Active Customers", value: activeCustomers },
    { label: "Inventory", value: inventory },
    { label: "Total Users", value: users?.length || 0 },
  ];

  // Prepare chart data
  const salesData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: ordersList?.map((order) => order.monthlySales) || [],
        backgroundColor: "#1C4771",
        borderColor: "#163b56",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Completed Orders", "Pending Orders", "Cancelled Orders"],
    datasets: [
      {
        data: [
          ordersList?.filter((order) => order.status === "completed").length ||
            0,
          ordersList?.filter((order) => order.status === "pending").length || 0,
          ordersList?.filter((order) => order.status === "cancelled").length ||
            0,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const activeCustomersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Customers",
        data: users?.map((user) => user.activeTime) || [],
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
              <Doughnut data={pieData} />
            </Card>
          </Grid>

          {/* Active Customers Line Chart */}
          <Grid item xs={12}>
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
