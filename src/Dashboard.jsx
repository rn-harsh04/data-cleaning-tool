import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  BarController, 
  BarElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  DoughnutController
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  BarController, 
  BarElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend,
  PieController,
  ArcElement,
  DoughnutController
);

const Dashboard = ({ data }) => {
  const missingValuesChartRef = useRef(null);
  const dataTypesChartRef = useRef(null);
  const improvementChartRef = useRef(null);
  const chartInstances = useRef([]);

  useEffect(() => {
    // Destroy previous charts
    chartInstances.current.forEach(chart => chart && chart.destroy());
    chartInstances.current = [];

    if (data.missingValues.length > 0) {
      // 1. Missing Values Comparison Chart
      const missingValuesCtx = missingValuesChartRef.current.getContext('2d');
      const sortedMissingValues = [...data.missingValues].sort((a, b) => b.before - a.before);
      
      const missingValuesChart = new ChartJS(missingValuesCtx, {
        type: 'bar',
        data: {
          labels: sortedMissingValues.map(item => item.column),
          datasets: [
            {
              label: 'Before Cleaning',
              data: sortedMissingValues.map(item => item.before),
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: 'rgba(239, 68, 68, 1)',
              borderWidth: 1
            },
            {
              label: 'After Cleaning',
              data: sortedMissingValues.map(item => item.after),
              backgroundColor: 'rgba(16, 185, 129, 0.7)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                afterLabel: (context) => {
                  const item = sortedMissingValues[context.dataIndex];
                  return `Improvement: ${item.improvement}\nType: ${item.dtype}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Missing Values Count'
              }
            }
          }
        }
      });
      chartInstances.current.push(missingValuesChart);

      // 2. Data Types Distribution Chart
      const dataTypesCtx = dataTypesChartRef.current.getContext('2d');
      
      const typeCounts = data.columnTypes.reduce((acc, item) => {
        acc[item.dtype] = (acc[item.dtype] || 0) + 1;
        return acc;
      }, {});

      const dataTypesChart = new ChartJS(dataTypesCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(typeCounts),
          datasets: [{
            data: Object.values(typeCounts),
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(153, 102, 255, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Data Types Distribution'
            }
          }
        }
      });
      chartInstances.current.push(dataTypesChart);

      // 3. Improvement Percentage Chart
      const improvementCtx = improvementChartRef.current.getContext('2d');
      const improvementData = sortedMissingValues
        .filter(item => item.before > 0)
        .map(item => ({
          column: item.column,
          improvement: Math.round((item.improvement / item.before) * 100)
        }))
        .sort((a, b) => b.improvement - a.improvement);

      const improvementChart = new ChartJS(improvementCtx, {
        type: 'bar',
        data: {
          labels: improvementData.map(item => item.column),
          datasets: [{
            label: 'Improvement %',
            data: improvementData.map(item => item.improvement),
            backgroundColor: 'rgba(124, 58, 237, 0.7)',
            borderColor: 'rgba(124, 58, 237, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Improvement Percentage'
              }
            }
          }
        }
      });
      chartInstances.current.push(improvementChart);
    }

    return () => {
      chartInstances.current.forEach(chart => chart && chart.destroy());
    };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h3 className="text-2xl font-bold text-center mb-6">📈 Data Insights Dashboard</h3>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">File Read Time</p>
          <p className="text-2xl font-bold">{data.performance.readTime} ms</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium">Processing Time</p>
          <p className="text-2xl font-bold">{data.performance.processTime} ms</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Server Total</p>
          <p className="text-2xl font-bold">{data.performance.totalTime} ms</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-600 font-medium">Client Time</p>
          <p className="text-2xl font-bold">{data.performance.frontendTime} ms</p>
        </div>
      </div>

      {/* Chart Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-3">Missing Values Comparison</h4>
          <div className="h-64">
            <canvas ref={missingValuesChartRef} />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-3">Data Types Distribution</h4>
          <div className="h-64">
            <canvas ref={dataTypesChartRef} />
          </div>
        </div>
      </div>

      {/* Chart Row 2 */}
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-3">Improvement Percentage by Column</h4>
          <div className="h-64">
            <canvas ref={improvementChartRef} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Cleaning Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.summaryStats).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">{key}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Before</p>
                  <p className="text-red-500 font-bold">{value.before}{value.unit}</p>
                </div>
                <span className="text-gray-400 mx-2">→</span>
                <div className="text-center">
                  <p className="text-xs text-gray-500">After</p>
                  <p className="text-green-500 font-bold">{value.after}{value.unit}</p>
                </div>
                <div className="ml-auto text-center">
                  <p className="text-xs text-gray-500">Improvement</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    value.before - value.after > 0 ? 
                    'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {value.before - value.after > 0 ? `↓ ${value.before - value.after}` : 'No change'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;