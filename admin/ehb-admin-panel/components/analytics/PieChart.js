import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Pie Chart Component
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data [{name, value, color}]
 * @param {string} props.dataKey - Data key for values
 * @param {string} props.nameKey - Data key for names
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height
 */
const PieChart = ({ data, dataKey, nameKey, title, height = 300 }) => {
  return (
    <div className="bg-card rounded-lg shadow p-4">
      {title && (
        <h3 className="text-lg font-medium mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}></ResponsiveContainer>
        <Rechar<Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) =></Rechar></Pie>({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {(data || []).map((entry<Cell key={`cell-${index}`} fill={entry.color} /></Cell>dex}`} fill={entry.color} />
        <Tooltip formatter={(value) =></Tooltip></Tool<<Legend /></Legend><Legend /></Legend></Tooltip>Legend /></Legend>value) => `${val<Legend /<Legend /></Legend><Legend /></Legend>Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;