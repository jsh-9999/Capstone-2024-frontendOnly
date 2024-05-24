"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from 'cookies-next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: `Accident Graph for ${new Date().getFullYear()}`,
    },
  },
};

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Props = {};

export function SimpleChart({}: Props) {
  const fetchMonthlyAccidentData = async (): Promise<Record<string, number>> => {
    const token = getCookie("Authorization");
    const refreshToken = getCookie("Refresh");

    if (!token || !refreshToken) {
      throw new Error("No token found");
    }

    const response = await fetch("https://backend-capstone.site/api/hospital/accident/statistics/month", {
      headers: {
        Authorization: `Bearer ${token}`,
        Refresh: `${refreshToken}`
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch monthly accident data");
    }

    const data = await response.json();
    console.log("Fetched data: ", data);
    return data as Record<string, number>;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyAccidentData"],
    queryFn: fetchMonthlyAccidentData,
  });

  const [chartData, setChartData] = useState({
    labels: monthLabels,
    datasets: [
      {
        label: "Number of Accidents",
        backgroundColor: "#219ebc",
        data: Array(12).fill(0), // Initialize with zeros
      },
    ],
  });

  useEffect(() => {
    if (data) {
      const accidentData = monthLabels.map((month, index) => {
        const monthKey = `${new Date().getFullYear()}-${String(index + 1).padStart(2, '0')}`;
        return data[monthKey] || 0;
      });
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: accidentData,
          },
        ],
      }));
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {(error as Error).message}</div>;

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
}
