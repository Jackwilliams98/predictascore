"use client";

import { useState } from "react";

import { getMatchesByMatchday } from "../lib/footballApi";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    method: string,
    params: Record<string, any> = {},
  ) => {
    setLoading(true);
    setError(null);

    const queryString = new URLSearchParams({ method, ...params }).toString();
    const url = `/api/football?${queryString}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      setError("error.message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      Home page
      <button
        onClick={() => fetchData("getMatchesByMatchday", { matchday: 1 })}
        style={{ padding: 14, backgroundColor: "blue " }}
      >
        Fetch Matchday 1
      </button>
      <button
        onClick={() => fetchData("getCompetitionStandings")}
        style={{ padding: 14, backgroundColor: "green " }}
      >
        Fetch Matchday 2
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
