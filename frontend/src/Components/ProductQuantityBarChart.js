import React,{useState,useEffect} from 'react'
import { Chart } from 'primereact/chart';


const ProductQuantityBarChart = ({backgroundColor,borderColor}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await fetch('http://localhost:3001/products/');
        const data = await response.json();

        // Assuming each product has a 'name' and 'totalStock' property
        const chartData = {
          labels: data.map((product) => product.name),
          datasets: [
            {
              label: 'Product Quantity',
              backgroundColor: backgroundColor,
              borderColor:borderColor,
              borderWidth:1,
              data: data.map((product) => product.totalStock),
            },
          ],
        };

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

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
            text: 'Products Inventory',
            font: {
                size:20
              },
           
        },
        },
      };
  return (
    <div>
       
      <Chart type="bar" data={chartData} options={options} style={{width:"100%", height:"250px"}}  />
   
      
    </div>
  )
}

export default ProductQuantityBarChart
