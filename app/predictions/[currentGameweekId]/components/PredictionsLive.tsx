import { GameweekFixture } from "@/app/types";
import { Button } from "@/components";
import { FixtureCard } from "./FixtureCard";

export default function PredictionsLive({
  fixtures,
  onEdit,
  isGameweekLive,
}: {
  fixtures: GameweekFixture[];
  onEdit?: () => void;
  isGameweekLive: boolean;
}) {
  return (
    <>
      {fixtures.map((fixture) => {
        const {
          id,
          homeTeam,
          homeScore,
          awayTeam,
          awayScore,
          kickoff,
          points,
          prediction,
          status,
        } = fixture;

        return (
          <div key={id}>
            <FixtureCard
              id={id}
              homeTeam={homeTeam}
              homeScore={homeScore}
              awayTeam={awayTeam}
              awayScore={awayScore}
              kickoff={kickoff}
              points={points}
              prediction={prediction}
              isGameweekLive={isGameweekLive}
              status={status}
            />
          </div>
        );
      })}
      {onEdit && (
        <Button fontSize={20} onClick={onEdit}>
          Edit
        </Button>
      )}
    </>
  );
}
