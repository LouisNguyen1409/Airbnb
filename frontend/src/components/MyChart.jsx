import React from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Chart, Legend, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Legend, Tooltip);

const dataOriginal = {
  labels: ['30', '29', '28', '27', '26', '25', '24', '23', '22', '21',
    '20', '19', '18', '17', '16', '15', '14', '13', '12', '11',
    '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
  datasets: [
    {
      label: 'Total Money earned',
      data: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const options = {
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: true,
    },
  },
};

const MyChart = (props) => {
  const [dataDate, setDataDate] = React.useState(dataOriginal);
  React.useEffect(() => {
    getData();
  }, []);

  function getDaysWithinPast30Days (startDateStr, endDateStr) {
    // Parse startDate and endDate strings into Date objects
    const startDate = new Date(startDateStr.split('/').reverse().join('-'));
    const endDate = new Date(endDateStr.split('/').reverse().join('-'));

    // Get the current date
    const currentDate = new Date();

    // Calculate the date 30 days ago from the current date
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Adjust the start date to be at least thirtyDaysAgo
    const adjustedStartDate = startDate > thirtyDaysAgo ? startDate : thirtyDaysAgo;

    // Calculate the number of days within the past 30 days
    const daysWithinPast30Days = Math.max(
      Math.min(
        Math.floor((currentDate - adjustedStartDate) / (1000 * 60 * 60 * 24)) + 1,
        Math.floor((endDate - adjustedStartDate) / (1000 * 60 * 60 * 24)) + 1
      ),
      0
    );

    return daysWithinPast30Days;
  }

  const getData = async () => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
    });
    const data = await response.json();
    if (data.error) {
      props.setError(data.error);
    } else {
      for (const listing of data.listings) {
        if (listing.owner === localStorage.getItem('userEmail')) {
          const response2 = await fetch('http://localhost:5005/bookings', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          });
          const data2 = await response2.json();
          if (data2.error) {
            props.setError(data2.error);
          } else {
            for (const booking of data2.bookings) {
              if (parseInt(booking.listingId) === listing.id && booking.status === 'accepted') {
                const days = getDaysWithinPast30Days(booking.dateRange.startDate, booking.dateRange.endDate);
                for (let i = 0; i <= Math.min(days, 30); i++) {
                  dataOriginal.datasets[0].data[30 - i] = parseInt(dataOriginal.datasets[0].data[30 - i]) + listing.price;
                  setDataDate(dataOriginal);
                }
                break;
              }
            }
          }
        }
      }
    }
  }

  return (
    <div>
      <h2>Profit from past 30 days</h2>
      <Line data={dataDate} options={options} />
    </div>
  );
};

export default MyChart;
