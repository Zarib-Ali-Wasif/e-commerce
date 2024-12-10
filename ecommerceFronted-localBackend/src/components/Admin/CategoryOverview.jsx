import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Typography, Grid, Box } from "@mui/material";
import { Doughnut, Bar } from "react-chartjs-2";
import { fetchCategoryStats } from "../../lib/redux/slices/productsSlice"; // Adjust the fetch action accordingly

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CategoryOverview = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Select data from Redux store
  const { categoryStats } = useSelector((state) => state.products);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchCategoryStats());
    setLoading(false);
  }, [dispatch]);

  // Prepare Pie Chart data for Product Count
  const pieData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        data: Object.values(categoryStats).map(
          (category) => category.productCount
        ),
        backgroundColor: [
          "#ff9800", // Orange
          "#c51162", // Pink
          "#2196f3", // Blue
          "#4caf50", // Green
          "#f44336", // Red
          "#9c27b0", // Purple
          "#3f51b5", // Indigo
          "#009688", // Teal
          "#8bc34a", // Light Green
          "#ff5722", // Deep Orange
          "#795548", // Brown
          "#607d8b", // Blue Grey
          "#e91e63", // Pink
          "#00bcd4", // Cyan
          "#673ab7", // Deep Purple
          "#ffeb3b", // Yellow
          "#ffc107", // Amber
          "#03a9f4", // Light Blue
          "#6a1b9a", // Dark Purple
          "#d32f2f", // Dark Red
          "#388e3c", // Dark Green
          "#1976d2", // Dark Blue
          "#512da8", // Dark Indigo
        ],

        borderColor: "transparent",
        hoverBorderColor: "rgba(0, 0, 0, 0.1)",
      },
    ],
  };

  // Prepare Bar Chart data for Stock Count
  const barData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: "Stock Count",
        data: Object.values(categoryStats).map(
          (category) => category.stockCount
        ),
        backgroundColor: "#2196f3",
        borderColor: "#1C4771",
        borderWidth: 2,
      },
    ],
  };

  // Prepare Progress Bars for Stock Percentage
  const stockPercentages = Object.keys(categoryStats).map(
    (category) => categoryStats[category].stockPercentage
  );

  return (
    <Grid
      pt={10}
      sx={{
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
      backgroundColor={"rgb(244, 247, 252)"}
    >
      <Typography
        variant="h4"
        textAlign={"center"}
        gutterBottom
        sx={{ color: "#1C4771" }}
      >
        {" "}
        Category Overview
      </Typography>
      <Grid container spacing={3} p={2}>
        {loading ? (
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center", width: "100%" }}
          >
            Loading...
          </Typography>
        ) : (
          <>
            {/* Category-wise Product Count Pie Chart */}
            <Grid item xs={12} sm={6}>
              <Card
                style={{
                  padding: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Category-wise Product Count
                </Typography>
                <Doughnut
                  data={pieData}
                  options={{ responsive: true, maintainAspectRatio: true }}
                />
              </Card>
            </Grid>

            {/* Category-wise Stock Count Bar Chart */}
            <Grid item xs={12} sm={6}>
              <Card
                style={{
                  padding: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Category-wise Stock Count
                </Typography>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                  }}
                />
              </Card>
            </Grid>

            {/* Stock Percentage Progress Bars */}
            {Object.keys(categoryStats).map((category, index) => {
              const stockPercentage = categoryStats[category].stockPercentage;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {category}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Stock: {categoryStats[category].stockCount}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Percentage: {stockPercentage.toFixed(2)}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        height: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${stockPercentage}%`,
                          backgroundColor: "#2196f3",
                          borderRadius: "5px",
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default CategoryOverview;
