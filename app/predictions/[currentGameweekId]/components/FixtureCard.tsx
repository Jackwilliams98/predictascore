import { useState } from "react";
import { Dialog } from "@chakra-ui/react";
import Text from "@/components/Text/Text";
import { Card } from "@/components/Card";
import classes from "../../Predictions.module.css";
import EditFixtureModal from "./EditFixtureModal";
import EditScoreModal from "./EditScoreModal";
import { FixtureStatus } from "@prisma/client";

interface FixtureCardProps {
  id: string;
  homeTeam: string;
  homeScore: number | null;
  awayTeam: string;
  awayScore: number | null;
  kickoff: string;
  points: number | null;
  prediction?: {
    homeScore: number | null;
    awayScore: number | null;
  };
  isEditGameweek?: boolean;
  isGameweekLive?: boolean;
  status?: FixtureStatus;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({
  id,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  kickoff,
  points,
  prediction,
  isEditGameweek = false,
  isGameweekLive = false,
  status,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardComponent = (
    <Card
      key={id}
      style={{
        marginBottom: "16px",
        position: "relative",
        cursor: isEditGameweek ? "pointer" : "default",
      }}
    >
      <Text>
        {new Date(kickoff).toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text.Title className={classes.fixtureCardTitle}>
        <div className={classes.flex}>{homeTeam}</div>
        {isEditGameweek ? (
          isGameweekLive && (
            <Text className={classes.fixtureCardScore}>
              Score:
              {homeScore !== null && awayScore !== null
                ? `${homeScore}:${awayScore}`
                : " N/A"}
            </Text>
          )
        ) : (
          <div className={classes.flex} style={{ marginBottom: "8px" }}>
            Prediction: {prediction?.homeScore}:{prediction?.awayScore}
          </div>
        )}
        <div className={classes.flex}>{awayTeam}</div>
      </Text.Title>
      {!isEditGameweek && isGameweekLive && (
        <Text className={classes.fixtureCardScore}>
          Score:
          {homeScore !== null && awayScore !== null
            ? `${homeScore}:${awayScore}`
            : " N/A"}
        </Text>
      )}
      {isEditGameweek && status && (
        <Text className={classes.fixtureCardStatus}>
          Fixture status: {status}
        </Text>
      )}
      {points !== null && (
        <span
          className={classes.points}
          style={{
            backgroundColor:
              points === 0 ? "#fff9c4" : points > 0 ? "#d4edda" : "#f8d7da",
          }}
        >
          <Text style={{ marginInlineStart: "2px" }}>{points}</Text>
        </span>
      )}
    </Card>
  );

  if (isEditGameweek) {
    return (
      <Dialog.Root onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
        <Dialog.Trigger asChild>{cardComponent}</Dialog.Trigger>
        {isGameweekLive ? (
          <EditScoreModal
            id={id}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={homeScore}
            awayScore={awayScore}
            status={status}
            kickoff={kickoff}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ) : (
          <EditFixtureModal
            id={id}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            kickoff={kickoff}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </Dialog.Root>
    );
  } else {
    return cardComponent;
  }
};
