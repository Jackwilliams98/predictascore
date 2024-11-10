import { transformStandings } from "@/utils";

const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

export interface StandingsResponse {
  // Define the structure of the response if known
}

export const getCompetitionStandings =
  async (): Promise<StandingsResponse | null> => {
    const url = "https://api.football-data.org/v4/competitions/PL/standings";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const table = transformStandings(data);

      return table;
    } catch (error) {
      console.error("Error fetching data", error);
      return null;
    }
  };
