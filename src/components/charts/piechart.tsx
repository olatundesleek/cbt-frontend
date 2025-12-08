"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type CellTypes = 'teacher' | 'student' | 'class' | 'course' | 'test' | 'admin';

const getPieChartCellColor = (type: CellTypes): string => {
  switch (type) {
    case 'teacher': {
      return '#00C49F';
    }

    case 'student': {
      return '#FFBB28';
    }

    case 'class': {
      return '#0088FE';
    }

    case 'course': {
      return '#FF8042';
    }

    case 'test': {
      return '#8884D8';
    }
      
    case 'admin': {
      return '#09ff1d';
    }

    default: {
      return '#0088FE';
    }
  }
};

interface PieChartData {
  name: CellTypes;
  value: number;
  [key: string]: string | number;
}

interface PieChartColor {
  color: string;
  type: CellTypes;
}

interface PieChartComponentProps {
  pieChartData: PieChartData[];
  pieChartColors: PieChartColor[];
}

export const PieChartComponent = ({
  pieChartData,
  pieChartColors,
}: PieChartComponentProps) => {
  return (
    <div className='flex flex-col items-center gap-4 flex-1'>
      <ResponsiveContainer width='100%' height='100%' minHeight={300}>
        <PieChart>
          <Pie
            dataKey='value'
            isAnimationActive={false}
            data={pieChartData}
            cx='50%'
            cy='50%'
            outerRadius={80}
            fill='#8884d8'
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

      <div className='flex flex-row items-center justify-center flex-wrap gap-4'>
        {pieChartColors.map((item) => (
          <div key={item.color} className='flex flex-row items-center gap-1'>
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div className='w-3 h-3' style={{ backgroundColor: item.color }} />
            <span className='text-sm font-medium capitalize'>{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
