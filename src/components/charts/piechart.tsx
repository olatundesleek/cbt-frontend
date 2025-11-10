"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type CellTypes = "teacher" | "student" | "admin";

const getPieChartCellColor = (type: CellTypes): string => {
  switch (type) {
    case "teacher": {
      return "#00C49F";
    }

    case "student": {
      return "#FFBB28";
    }

    //return admin by default
    default: {
      return "#0088FE";
    }
  }
};

const getPieChartData = () => {
  const pieChartData: { name: CellTypes; value: number }[] = [
    {
      name: "teacher",
      value: 350,
    },
    {
      name: "student",
      value: 550,
    },
    {
      name: "admin",
      value: 100,
    },
  ];

  const pieChartColors = [
    { color: "#00C49F", type: "teacher" },
    { color: "#FFBB28", type: "student" },
    { color: "#0088FE", type: "admin" },
  ];

  return { pieChartData, pieChartColors };
};

export const PieChartComponent = () => {
  const { pieChartData, pieChartColors } = getPieChartData();

  return (
    <div className="flex flex-col items-center gap-4 flex-1">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            innerRadius={50}
            label
          >
            {pieChartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={getPieChartCellColor(entry.name)}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-row items-center justify-center flex-wrap gap-4">
        {pieChartColors.map((item) => (
          <div key={item.color} className="flex flex-row items-center gap-1">
            <div style={{ backgroundColor: item.color }} className="w-3 h-3" />
            <span className="text-sm font-medium capitalize">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
