import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Line Chart Component
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data
 * @param {Array} props.lines - Lines configuration [{name, key, color}]
 * @param {string} props.xAxisKey - X-axis data key
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height
 */
const LineChart = ({ data, lines, xAxisKey, title, height = 300 }) => {
  return (
    <div className="bg-card rounded-lg shadow p-4">
      {title && (
        <h3 className="text-lg font-medium mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}></ResponsiveContainer>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }<CartesianGrid strokeDasharray="3 3" stroke="#eee" /></RechartsLineChart></CartesianGrid>"3 3" stroke="#eee" />
          <<YAxis /></YAxis>aKe<Tooltip /></Tooltip>}<Le<YAxis /></Le></YAxis>Leg<Tooltip /></Tooltip>x<Legen<Line
              key={index}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              activeDot={{ r: 8 }}
            /></Legen>   activeDot={{ r: 8 }}
            /></Line>ke={line.color}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;