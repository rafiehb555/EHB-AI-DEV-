import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Bar Chart Component
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data
 * @param {Array} props.bars - Bars configuration [{name, key, color}]
 * @param {string} props.xAxisKey - X-axis data key
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height
 */
const BarChart = ({ data, bars, xAxisKey, title, height = 300 }) => {
  return (
    <div className="bg-card rounded-lg shadow p-4">
      {title && (
        <h3 className="text-lg font-medium mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}></ResponsiveContainer>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }<CartesianGrid strokeDasharray="3 3" stroke="#eee" /></RechartsBarChart></CartesianGrid>"3 3" stroke="#eee" />
          <<YAxis /></YAxis>aKe<Tooltip /></Tooltip>}<Leg<YAxis /></Leg></YAxis>ege<Tooltip /></Tooltip>i<Leg<Bar
              key={index}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
            /></Leg>      fill={bar.color}
            /></Bar>    name={bar.name}
              fill={bar.color}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;