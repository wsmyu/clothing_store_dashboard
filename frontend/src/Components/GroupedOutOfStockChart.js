import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

const GroupedOutOfStockChart = ({ endpoint, chartTitle,backgroundColor, borderColor }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products/${endpoint}`);
        const data = await response.json();
        const chartData = {
          labels: data.map((entry) => entry._id),
          datasets: [
            {
              label: 'Out of Stock Count',
              data: data.map((entry) => entry.count),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [endpoint]);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 20,
        },
      },
    },
  };

  return <Chart type="bar" data={chartData} options={options} style={{width:"100%"}}/>;
};

export default GroupedOutOfStockChart;