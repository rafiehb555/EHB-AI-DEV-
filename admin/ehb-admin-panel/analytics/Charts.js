import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  BarChart as RechartsBarChart, 
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * Base chart configuration used across all chart components
 */
const baseChartConfig = {
  width: 500,
  height: 300,
  margin: { top: 20, right: 30, left: 20, bottom: 5 }
};

/**
 * Default color palette for charts
 */
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * LineChart Component
 * 
 * Renders a line chart for time series data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.dataKey - Key to use for the line data value
 * @param {string} props.xAxisKey - Key to use for the x-axis
 * @param {string} props.color - Line color (defaults to first color in COLORS)
 */
export const LineChart = ({ 
  data = [], 
  title = 'Line Chart', 
  dataKey = 'value', 
  xAxisKey = 'name',
  color = COLORS[0]
}) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={baseChartConfig.height}></ResponsiveContainer>
        <RechartsLineChart data={data} margin={baseChartConf<CartesianGrid strokeDasharray="3 3" /></RechartsLineChart></CartesianGrid>rokeDasharray="3 3" />
          <<YAxis /></YAxis>aKe<Tooltip /></Tooltip>}<Legend /></Legend>  <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            activeDot={{ r: 8 }} 
          /></Line>   stroke={color} 
            activeDot={{ r: 8 }} 
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * BarChart Component
 * 
 * Renders a bar chart for categorical data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.dataKey - Key to use for the bar data value
 * @param {string} props.xAxisKey - Key to use for the x-axis
 * @param {Array} props.colors - Bar colors (defaults to COLORS)
 */
export const BarChart = ({ 
  data = [], 
  title = 'Bar Chart', 
  dataKey = 'value', 
  xAxisKey = 'name',
  colors = COLORS
}) => {
  return (data = [], 
  title = 'Bar Chart', 
  dataKey = 'value', 
  xAxisKey = 'name',
  colors = COLORS
}) => {
  return (retu<ResponsiveContainer width="100%" height={baseChartConfig.height}></ResponsiveContainer></Respon<ResponsiveContainer width="100%<CartesianGrid strokeDasharray="3 3" /></ResponsiveContainer></CartesianGrid>rokeDasharray="3 3" /></ResponsiveContainer>keDasharray="3 3" /></CartesianGrid>data={data););
} margin={baseChartCon<Tool<Bar dataKey={dataKey} fill={colors[0]<YAxis /></Tool>ll={colors[0]<YAxis /></Bar>Key={dataKey} fill={colors[0]<YAxis /></YAxis>>da<Tooltip /></T<Bar dataK<Legend /></Bar>Legend>  <Bar dataK<Legend /></Legend>y}<Bar dataKey={dataKey} f<Bar dataKey={dataKey} fill={colors[0]} /></Bar>taKey={dataKey} fill={colors[0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * PieChart Component
 * 
 * Renders a pie chart for proportional data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.dataKey - Key to use for the pie data value
 * @param {string} props.nameKey - Key to use for the segment name
 * @param {Array} props.colors - Segment colors (defaults to COLORS)
 */
export const PieChart = ({ 
  data = [], 
  title = 'Pie Chart', 
  d<ResponsiveContainer width="100%" height={baseChartConfig.height}></ResponsiveContainer> return (
    <div className="chart-container">
<Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label
          ></Pie>   labelLine={true<Cell key={`cell-${index}`} fill={colors[index % col<Tooltip /></Cell>ex}`} fill={colors[index % col<Tooltip /></Tooltip><Tooltip /></Tooltip>{nameKey}
            label
         <Tooltip /><Cell key={`c<Cell key={`cell-$<Cell key={`cell-${index}`} f<Tooltip /></Cell> /><<Le<Tooltip /></Le><Cell key={`cell-${index}`} f<Tooltip /></Tooltip>[<Le<Tooltip /></Tooltip>g<Le<Tooltip /></Tooltip>g<Legend /></Legend>} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * ChartWrapper Component
 * 
 * A generic wrapper for all chart types
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Chart type (line, bar, pie)
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {Object} props.options - Additional chart options
 */
export const ChartWrapper = ({ 
  type = 'line', 
  data = [], 
  title = 'Chart', 
  options<LineChart data={data} title={title} {...options} /></LineChart>, 
  title = 'Cha<PieChart data={d<PieChart data={data} title={title} {...o<BarChart data={data);
} title={title} {...options} /></PieChart>art data={data} title={title} {...o<BarChart data={data);
} title={title} {...options} /></BarChart>.options} />;
      case<PieChart data={d<PieChart data={d<PieChart data={data} title={title} {...options} /></PieChart>...options} />;
      case 'pie':
        return <PieChart data={data} title={title} {...options} />;
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };
  
  return renderChart();
};

export default {
  LineChart,
  BarChart,
  PieChart,
  ChartWrapper
};