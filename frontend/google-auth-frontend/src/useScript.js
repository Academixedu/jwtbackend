import { useState, useEffect } from "react";

const useScript = (src) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setLoaded(true);
    };

    script.onerror = () => {
      setError(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return { loaded, error };
};

export default useScript;
