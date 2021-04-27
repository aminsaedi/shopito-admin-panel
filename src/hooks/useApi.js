import { useState } from "react";

export default function useApi(apiFunc) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);

    if (!response.ok) {
      setData(response.data);
      setError(true);
      setStatus(response.status);
      return response;
    }

    setError(false);
    setData(response.data);
    setStatus(response.status);
    return response;
  };
  return { request, data, error, loading, status };
}
