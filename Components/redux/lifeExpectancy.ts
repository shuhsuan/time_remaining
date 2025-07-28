export interface LifeExpectancyEntry {
  date: string;
  value: number | null;
}

export const fetchLifeExpectancy = async (
  countryCode: string,
  gender: "male" | "female" | "total"
): Promise<LifeExpectancyEntry[]> => {
  const indicatorMap = {
    male: "SP.DYN.LE00.MA.IN",
    female: "SP.DYN.LE00.FE.IN",
    total: "SP.DYN.LE00.IN",
  };

  const indicator = indicatorMap[gender];

  try {
    const res = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=100`
    );
    const json = await res.json();

    if (!Array.isArray(json) || !Array.isArray(json[1])) {
      throw new Error("Invalid life expectancy data");
    }

    return json[1].map((entry: any) => ({
      date: entry.date,
      value: entry.value,
    }));
  } catch (err) {
    console.error("Failed to fetch life expectancy:", err);
    return [];
  }
};
