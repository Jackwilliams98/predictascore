"use client";

import { useEffect, useState } from "react";

import { LeagueTable } from "@/components";
import { LeagueTableType } from "../types";
import { fetchData } from "@/utils";

export default function Table() {
  const [table, setTable] = useState<LeagueTableType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTable = async () => {
    setLoading(true);
    const table = await fetchData("getCompetitionStandings");

    if (!table) {
      setError("Error fetching data");
      setLoading(false);
      return;
    }

    setTable(table);
    setLoading(false);
  };

  useEffect(() => {
    fetchTable();
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
