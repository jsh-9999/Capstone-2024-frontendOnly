"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
  Cross,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from 'cookies-next';

interface DataItem {
  region: string;
  count: number;
}

// Fetch function to get region-wise accident data
const fetchRegionAccidentData = async (): Promise<Record<string, number>> => {
  const token = getCookie("Authorization");
  const refreshToken = getCookie("Refresh");

  if (!token || !refreshToken) {
    throw new Error("No token found");
  }

  const response = await fetch("https://backend-capstone.site/api/hospital/accident/statistics/region", {
    headers: {
      Authorization: `Bearer ${token}`,
      Refresh: `${refreshToken}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error("Failed to fetch region-wise accident data");
  }

  const data = await response.json();
  console.log("Fetched data: ", data);
  return data;
};

const CustomChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["regionAccidentData"],
    queryFn: fetchRegionAccidentData,
  });

  const [chartData, setChartData] = useState<DataItem[]>([]);

  useEffect(() => {
    if (data) {
      const transformedData = Object.entries(data).map(([region, count]) => ({
        region,
        count,
      }));
      setChartData(transformedData);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {(error as Error).message}</div>;

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="region" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <Customized component={CustomizedCross} />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface CustomizedCrossProps {
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  formattedGraphicalItems?: any[];
}

const CustomizedCross: React.FC<CustomizedCrossProps> = (props) => {
  const { width, height, stroke, fill, formattedGraphicalItems } = props;
  const firstSeries = formattedGraphicalItems?.[0];
  const secondPoint = firstSeries?.props?.points[1];

  return (
    <Cross
      y={secondPoint?.y}
      x={secondPoint?.x}
      top={5}
      left={50}
      height={height}
      width={width}
      stroke={stroke ?? "#000"}
      fill={fill ?? "none"}
    />
  );
};

export default CustomChart;
