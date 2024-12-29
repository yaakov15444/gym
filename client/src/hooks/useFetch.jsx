import React, { useEffect, useState } from "react";

const useFetch = (url, typeRequest = "GET", body = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

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
  }, [url, typeRequest, body]);

  return { data, loading, error, response };
};

export default useFetch;
