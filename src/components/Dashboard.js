import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      {data ? <p>Welcome, {data.logged_in_as}!</p> : <p>Loading...</p>}
    </div>
  );
}

export default Dashboard;
