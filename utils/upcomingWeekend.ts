export const getUpcomingWeekendDates = (): {
  saturday: string;
  sunday: string;
} => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // Days until next Saturday and Sunday
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;

  const nextSaturday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilSaturday
    )
  );
  const nextSunday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilSunday
    )
  );

  // Format as yyyy-mm-dd
  const format = (d: Date) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getUTCDate()).padStart(2, "0")}`;

  return {
    saturday: format(nextSaturday),
    sunday: format(nextSunday),
  };
};
