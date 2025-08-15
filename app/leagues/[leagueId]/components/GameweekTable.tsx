"use client";

import { useEffect, useState } from "react";
import LeagueTable from "./LeagueTable";
import { Button, Loading } from "@/components";
import { IconButton } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Text from "@/components/Text/Text";

export default function GameweekTable({
  leagueId,
  session,
  totalGameweeks,
}: {
  leagueId: string;
  session: any;
  totalGameweeks: number;
}) {
  const [gameweekNumber, setGameweekNumber] = useState(1);
  const [leagueMembers, setLeagueMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGameweekTable = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/getGameweek?leagueId=${leagueId}&gameweekNumber=${gameweekNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch gameweek table");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch gameweek table");
        }
        const data = await response.json();

        setLeagueMembers(data.members);
      } catch (error) {
        console.error("Failed to fetch gameweek table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameweekTable();
  }, [leagueId, gameweekNumber]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <IconButton
          type="button"
          onClick={() => setGameweekNumber((prev) => Math.max(prev - 1, 1))}
          disabled={gameweekNumber <= 1}
          style={{
            aspectRatio: "1",
            backgroundColor: "#31511e",
            color: "#fff",
          }}
        >
          <AiOutlineMinus />
        </IconButton>
        <Text.Large style={{ textAlign: "center", flex: 1 }}>
          Gameweek {gameweekNumber} Table
        </Text.Large>
        <IconButton
          type="button"
          onClick={() =>
            setGameweekNumber((prev) => Math.min(prev + 1, totalGameweeks))
          }
          disabled={gameweekNumber >= totalGameweeks}
          style={{
            aspectRatio: "1",
            backgroundColor: "#31511e",
            color: "#fff",
          }}
        >
          <AiOutlinePlus />
        </IconButton>
      </div>
      {loading ? (
        <Loading />
      ) : leagueMembers.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No members in this gameweek</Text>
      ) : (
        <LeagueTable leagueMembers={leagueMembers} session={session} />
      )}
    </div>
  );
}
