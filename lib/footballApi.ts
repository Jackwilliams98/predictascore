const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

export const getMatchesByMatchday = async ({
  matchday,
}: {
  matchday: number;
}) => {
  const url = `https://api.football-data.org/v4/competitions/PL/matches?matchday=${matchday}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return response.json();
  } catch (error) {
    console.error("Error fetching data", error);
    return null;
  }
};

export const getCompetitionStandings = async () => {
  const url = "http://api.football-data.org/v4/competitions/PL/standings";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return response.json();
  } catch (error) {
    console.error("Error fetching data", error);
    return null;
  }
};
