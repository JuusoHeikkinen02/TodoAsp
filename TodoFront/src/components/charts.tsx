import React, { useEffect, useState, useRef } from "react";
import { Chart, Filler } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import { GetAllTasks } from "./getAPI";
import Task from "../models/TaskModel";
import { format } from "date-fns";
import Activity from "../models/ActivityModel";

interface DoughnutChartProps {
  tasks: Task[];
}

interface AreaChartProps {
  tasks: Task[];
  activities: Activity[];
}

interface DoughnutChartPropsAc {
  activities: Activity[];
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ tasks }) => {
  const [chart, setChart] = useState<Chart<"doughnut"> | null>(null);
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const statusCounts: { [key: string]: number } = {
        New: 0,
        "In Progress": 0,
        Done: 0,
      };

      tasks.forEach((task) => {
        statusCounts[task.StatusName]++;
      });

      const ctx = document.getElementById(
        "doughnut-chart"
      ) as HTMLCanvasElement;
      if (!ctx) return;

      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["New", "In Progress", "Done"],
          datasets: [
            {
              label: "Task Status",
              data: [
                statusCounts.New,
                statusCounts["In Progress"],
                statusCounts.Done,
              ],
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)", // Blue
                "rgba(255, 159, 64, 0.7)", // Orange
                "rgba(75, 192, 192, 0.7)", // Green
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Tasks status",
              font: {
                size: 20,
              },
            },
          },
        },
      });

      setChart(newChart);
    }
  }, [tasks]);

  return <canvas id="doughnut-chart" width="400" height="400"></canvas>;
};

export const DoughnutChartAC: React.FC<DoughnutChartPropsAc> = ({
  activities,
}) => {
  const [chart, setChart] = useState<Chart<"doughnut"> | null>(null);

  useEffect(() => {
    if (activities && activities.length > 0) {
      const statusCounts: { [key: string]: number } = {
        New: 0,
        "In Progress": 0,
        Done: 0,
      };

      activities.forEach((activity) => {
        statusCounts[activity.StatusName]++;
      });

      const ctx = document.getElementById(
        "doughnut-chartAc"
      ) as HTMLCanvasElement;
      if (!ctx) return;

      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["New", "In Progress", "Done"],
          datasets: [
            {
              label: "Activity status",
              data: [
                statusCounts.New,
                statusCounts["In Progress"],
                statusCounts.Done,
              ],
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)", // Blue
                "rgba(255, 159, 64, 0.7)", // Orange
                "rgba(75, 192, 192, 0.7)", // Green
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Activity status",
              font: {
                size: 20,
              },
            },
          },
        },
      });

      setChart(newChart);
    }
  }, [activities]);

  return <canvas id="doughnut-chartAc" width="400" height="400"></canvas>;
};
export const AreaChart: React.FC<AreaChartProps> = ({ tasks, activities }) => {
  const chartRef = useRef<Chart<"line"> | null>(null);

  useEffect(() => {
    const alltasks: number[] = [];
    const allactivities: number[] = [];

    tasks.forEach((task) => {
      const day = new Date(task.StartDate);
      alltasks.push(day.getDay());
    });
    activities.forEach((activity) => {
      const day = new Date(activity.StartDate);
      allactivities.push(day.getDay());
    });

    const count: { [key: number]: number } = alltasks.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    const count2: { [key: number]: number } = allactivities.reduce(
      (acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    );

    const labels = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const ctx = document.getElementById("area-chart") as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Tasks",
            data: labels.map((label) => count[labels.indexOf(label)] || 0),
            borderColor: "rgb(255,99,132)",
            backgroundColor: "rgba(255,0,0,0.3)",
            fill: true,
          },
          {
            label: "Activities",
            data: labels.map((label) => count2[labels.indexOf(label)] || 0),
            borderColor: "rgb(53,162,235)",
            backgroundColor: "rgba(53,162,235,0.3)",
            fill: true,
          },
        ],
      },
    });

    chartRef.current = newChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [tasks, activities]);

  return <canvas id="area-chart"></canvas>;
};
