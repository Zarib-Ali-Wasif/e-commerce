// src/components/Charts.jsx
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 60 },
  { name: "Apr", value: 75 },
  { name: "May", value: 90 },
  { name: "May", value: 90 },
  { name: "May", value: 90 },
  { name: "May", value: 90 },
  { name: "May", value: 90 },
];

const Charts = () => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
);

export default Charts;
