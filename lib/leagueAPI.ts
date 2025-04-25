import prisma from "./prisma";

// Get all leagues for a user
export const getUserLeagues = async (userId: string | undefined) => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return []; // Return an empty array if userId is undefined
  }

  console.log(`Fetching leagues for user: ${userId}`);

  const userLeagues = await prisma.leagueMember.findMany({
    where: {
      userId,
    },
    include: {
      league: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Calculate the user's rank in each league
  const leaguesWithRank = await Promise.all(
    userLeagues.map(async (leagueMember) => {
      // Calculate overall rank
      const overallRank = await prisma.leagueMember.count({
        where: {
          leagueId: leagueMember.leagueId,
          points: {
            gt: leagueMember.points, // Count members with more points
          },
        },
      });

      // Get the current gameweek for the league
      const currentGameweek = await prisma.gameweek.findFirst({
        where: {
          leagueId: leagueMember.leagueId,
        },
        orderBy: {
          startDate: "desc", // Get the most recent gameweek
        },
      });

      let gameweekRank = null;
      if (currentGameweek) {
        // Get the user's gameweek points
        const userGameweekPrediction =
          await prisma.gameweekPrediction.findFirst({
            where: {
              userId,
              gameweekId: currentGameweek.id,
            },
          });

        const userGameweekPoints = userGameweekPrediction?.points || 0;

        // Calculate gameweek rank
        gameweekRank = await prisma.gameweekPrediction.count({
          where: {
            gameweekId: currentGameweek.id,
            points: {
              gt: userGameweekPoints, // Count members with more points
            },
          },
        });

        gameweekRank += 1; // Convert to 1-based rank
      }

      return {
        id: leagueMember.league.id,
        name: leagueMember.league.name,
        overallRank: overallRank + 1, // Convert to 1-based rank
        overallPoints: leagueMember.points,
        gameweekRank: gameweekRank || "...",
      };
    })
  );

  return leaguesWithRank;
};

// Get information about a specific league
export const getLeagueInfo = async (leagueId: string) => {
  return await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
  });
};

// Get all members of a league
export const getLeagueMembers = async (leagueId: string) => {
  return await prisma.leagueMember.findMany({
    where: {
      leagueId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      points: "desc", // Order by points in descending order
    },
  });
};
