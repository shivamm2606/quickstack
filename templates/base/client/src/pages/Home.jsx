import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/test")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{{PROJECT_NAME}}</h1>
      <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
        <span>⚡</span>
        <span>QuickStack · Full-Stack Template</span>
      </p>

      <div className="mt-4 w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-xs font-mono text-gray-500 mb-3">GET /api/test</p>

        {loading && (
          <p className="text-yellow-400 text-sm animate-pulse">
            Connecting to API...
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-950 border border-red-800 p-4">
            <p className="text-red-400 text-sm font-semibold">
              Connection failed
            </p>
            <p className="text-red-300 text-xs mt-1 font-mono">{error}</p>
          </div>
        )}

        {data && (
          <div className="rounded-lg bg-green-950 border border-green-800 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-300 text-sm font-semibold">
                {data.message}
              </p>
            </div>
            <p className="text-gray-500 text-xs font-mono">{data.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}
