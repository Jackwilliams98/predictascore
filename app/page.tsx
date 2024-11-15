"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [table, setTable] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("@@@URL@@@: ", url);

  useEffect(() => {
    fetch(`/api/gameweek?matchday=1`)
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

  console.log(table);

  return <div>Home page</div>;
}
