export default async function Page({
  params,
}: {
  params: { matchday: string };
}) {
  const { matchday } = params;

  //   Await the fetch and get the JSON response
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gameweek?matchday=${matchday}`,
  );
  const data = await response.json();

  return (
    <div>
      {data.matches?.map((match: any) => (
        <div key={match.id}>
          {match.homeTeam.name} vs {match.awayTeam.name}
        </div>
      ))}
    </div>
  );
}
