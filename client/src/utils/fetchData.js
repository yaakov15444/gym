export const fetchData = async (url, typeRequest = "GET", body = null) => {
  let data = null;
  let error = null;
  let response = null;
  let loading = true;

  const options = {
    method: typeRequest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && typeRequest !== "GET" && typeRequest !== "DELETE") {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    response = res;
    if (res.ok) {
      data = await res.json();
    } else {
      error = await res.json();
    }
  } catch (err) {
    error = err;
  } finally {
    loading = false;
  }

  return { data, loading, error, response };
};
