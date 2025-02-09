import React, { useEffect, useState } from "react";

const useFetch = (url, typeRequest = "GET", body = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // טריגר לרענון

  useEffect(() => {
    if (!url) return; // בדוק אם ה-URL ריק ואם כן, עזוב את הפונקציה

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const options = {
        method: typeRequest,
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body && typeRequest !== "GET" && typeRequest !== "DELETE")
        options.body = JSON.stringify(body);

      try {
        const res = await fetch(url, options);
        if (res.ok) {
          const data = await res.json();
          setData(data);
        } else {
          const error = await res.json();
          setError(error);
        }
        setResponse(res);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, typeRequest, body, refreshTrigger]);
  const refresh = () => {
    setRefreshTrigger((prev) => prev + 1); // שינוי הערך מפעיל את ה-Effect מחדש
  };
  return { data, loading, error, response, refresh };
};

export default useFetch;
