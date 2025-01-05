import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
const base_url = import.meta.env.VITE_BASE_URL;
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// רישום מודולים של Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisitChart = () => {
  const [visitData, setVisitData] = useState([]);
  const [loading, setLoading] = useState(true);

  // בקשה לשרת לקבלת סיכום הביקורים
  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await fetch(`${base_url}gymVisit/summary`); // ה-URL של ה-API שלך
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);

        // הוספת כל השעות מ-6 בבוקר עד 22 בלילה
        const allHours = Array.from({ length: 17 }, (_, i) => i + 6); // יצירת שעות 6 עד 22
        const formattedData = allHours.map((hour) => {
          const visit = data.find((item) => item._id === hour);
          return visit ? visit.count : 0; // אם יש ביקור בשעה זו, מחזירים את המספר, אחרת 0
        });

        setVisitData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visit data:", error);
        setLoading(false);
      }
    };

    fetchVisitData();
  }, []);

  // יצירת נתוני הגרף
  const chartData = {
    labels: Array.from({ length: 17 }, (_, i) => `${i + 6}:00`), // השעות בגרף (6 עד 22)
    datasets: [
      {
        label: "Number of Visits",
        data: visitData, // מספר הביקורים לכל שעה
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // הגדרת אפשרויות הגרף
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Gym Visit Summary by Hour", // טקסט למעלה
        font: {
          size: 18,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2
        style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}
      >
        Gym Visit Summary
      </h2>
      <p
        style={{ textAlign: "center", fontSize: "16px", marginBottom: "30px" }}
      >
        The chart below shows the number of gym visits for each hour of the day.
        It helps visualize the peak hours for gym activity.
      </p>

      <div style={{ marginBottom: "30px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VisitChart;