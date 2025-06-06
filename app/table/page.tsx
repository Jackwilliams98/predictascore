"use client";

import { useEffect, useState } from "react";

import { LeagueTable, Loading } from "@/components";
import { LeagueTableType } from "../types";

export default function Table() {
  const [table, setTable] = useState<LeagueTableType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/table`)
      .then((res) => res.json())
      .then((data) => {
        setTable(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? <Loading /> : table && <LeagueTable table={table} />}
      {error && <div>{error}</div>}
    </div>
  );
}
