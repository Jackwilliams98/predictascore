export const fetchData = async (
  method: string,
  params: Record<string, any> = {},
) => {
  const queryString = new URLSearchParams({ method, ...params }).toString();
  const url = `/api/football?${queryString}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    return "Error fetching data";
  }
};
