"use client";

import { useEffect, useState } from "react";

import { LeagueTable } from "@/components";
import { LeagueTableType } from "../types";
import { fetchData, transformStandings } from "@/utils";

export default function Table() {
  const [table, setTable] = useState<LeagueTableType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const queryString = new URLSearchParams({
      method: "getCompetitionStandings",
    }).toString();

    fetch(`/api/football?${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        setTable(data);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? <>Loading</> : table && <LeagueTable table={table} />}
      {error && <div>{error}</div>}
    </div>
  );
}
