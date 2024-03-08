import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const ReusablePieChart = ({ endpoint, title, dataKey,backgroundColor, borderColor}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataMap = {};

      try {
        const response = await fetch(
          `http://localhost:3001/products/${endpoint}`
        );
        const data = await response.json();

        data.forEach((item) => {
          const key = item[dataKey];
          dataMap[key] = (dataMap[key] || 0) + 1;
        });
        const chartData = {
            labels: Object.keys(dataMap),
            datasets: [
              {
                label: 'Product Quantity',
                data: Object.values(dataMap),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            
              },
            ],
          };

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [endpoint, dataKey]);



  const options = {
    plugins: {
    
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
    },
 
  };

  return <Chart type="pie" options={options} data={chartData} style={{width:"90%"}} />;
};

export default ReusablePieChart;
