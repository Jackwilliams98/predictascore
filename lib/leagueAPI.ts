import { generateJoinCode } from "@/utils";
import prisma from "./prisma";
import { League, UserLeagueInfo } from "@/app/types";

export const getCurrentSeason = async () => {
  const season = await prisma.season.findFirst({
    where: { isActive: true },
  });
  if (!season) throw new Error("No active season found");
  return season;
};

export const getActiveUserLeagues = async (
  userId: string | undefined
): Promise<League[]> => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return [];
  }

  const userLeagues = await prisma.leagueMember.findMany({
    where: {
      userId,
      AND: { leftAt: null },
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

  // Filter out any leagueMembers where league is null (shouldn't happen, but for safety)
  const validUserLeagues = userLeagues.filter((lm) => lm.league);

  return validUserLeagues;
};

export const getUserLeagues = async (
  userId: string | undefined
): Promise<UserLeagueInfo[]> => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return [];
  }

  const userLeagues = await getActiveUserLeagues(userId);

  const leaguesWithRank = await Promise.all(
    userLeagues.map(async (leagueMember) => {
      // Calculate overall rank
      const overallRank = await prisma.leagueMember.count({
        where: {
          leagueId: leagueMember.leagueId,
          points: {
            gt: leagueMember.points,
          },
        },
      });

      const league = await prisma.league.findUnique({
        where: { id: leagueMember.leagueId },
        include: {
          currentGameweek: { select: { id: true } },
        },
      });

      const currentGameweek = league?.currentGameweek;

      let gameweekRank = null;
      if (currentGameweek) {
        const userGameweekPrediction =
          await prisma.gameweekPrediction.findFirst({
            where: {
              userId,
              gameweekId: currentGameweek.id,
            },
          });

        const userGameweekPoints = userGameweekPrediction?.points || 0;

        gameweekRank = await prisma.gameweekPrediction.count({
          where: {
            gameweekId: currentGameweek.id,
            points: { gt: userGameweekPoints },
          },
        });

        gameweekRank += 1;
      }

      return {
        id: leagueMember.league.id,
        name: leagueMember.league.name,
        overallRank: overallRank + 1,
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

async function generateUniqueJoinCode(): Promise<string> {
  let joinCode: string;
  let isUnique = false;

  do {
    joinCode = generateJoinCode();
    const existingLeague = await prisma.league.findUnique({
      where: { joinCode },
    });
    isUnique = !existingLeague; // If no league exists, the code is unique
  } while (!isUnique);

  return joinCode;
}

// Create a new league
export const createLeague = async (leagueName: string, userId: string) => {
  const joinCode = await generateUniqueJoinCode();
  const { id: seasonId } = await getCurrentSeason();

  const league = await prisma.league.create({
    data: {
      name: leagueName,
      creatorId: userId,
      joinCode,
      members: {
        create: {
          userId,
          points: 0,
          seasonId,
        },
      },
    },
  });

  const currentGameweek = await prisma.gameweek.findFirst({
    where: {
      seasonId,
      status: "ACTIVE",
    },
  });

  if (currentGameweek) {
    await prisma.gameweek.update({
      where: {
        id: currentGameweek.id,
      },
      data: {
        League: {
          connect: { id: league.id },
        },
      },
    });
  }

  return league;
};

// Join an existing league
export const joinLeague = async (joinCode: string, userId: string) => {
  // Check if the league exists
  const league = await prisma.league.findUnique({
    where: {
      joinCode,
    },
  });

  if (!league) {
    throw new Error("League not found");
  }

  const { id: seasonId } = await getCurrentSeason();

  // Check if the user is already a member of the league
  const existingMember = await prisma.leagueMember.findUnique({
    where: {
      userId_leagueId_seasonId: {
        userId,
        leagueId: league.id,
        seasonId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this league");
  }

  // Add the user to the league
  const newMember = await prisma.leagueMember.create({
    data: {
      userId,
      leagueId: league.id,
      seasonId,
      points: 0,
    },
  });

  return newMember;
};

// Leave a league
export const leaveLeague = async (leagueId: string, userId: string) => {
  const { id: seasonId } = await getCurrentSeason();

  // Check if the user is a member of the league
  const existingMember = await prisma.leagueMember.findUnique({
    where: {
      userId_leagueId_seasonId: {
        userId,
        leagueId,
        seasonId, // Ensure we're checking the current season
      },
    },
  });

  if (!existingMember) {
    throw new Error("User is not a member of this league");
  }

  // Update the `leftAt` field to mark the user as inactive
  await prisma.leagueMember.update({
    where: {
      userId_leagueId_seasonId: {
        userId,
        leagueId,
        seasonId, // Ensure we're updating the current season
      },
    },
    data: {
      leftAt: new Date(), // Set the current timestamp
    },
  });

  const remainingActiveMembers = await prisma.leagueMember.count({
    where: {
      leagueId,
      seasonId,
      leftAt: null,
    },
  });

  if (remainingActiveMembers === 0) {
    // Delete the league (cascade will remove related data)
    await prisma.league.delete({
      where: { id: leagueId },
    });
    return { deletedLeague: true };
  }

  return { deletedLeague: false };
};

export const deleteLeague = async (leagueId: string, userId: string) => {
  const league = await prisma.league.findUnique({ where: { id: leagueId } });
  if (!league) throw new Error("League not found");
  if (league.creatorId !== userId) throw new Error("Not authorized");

  await prisma.league.delete({ where: { id: leagueId } });
  return { deleted: true };
};
