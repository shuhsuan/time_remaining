export interface CountryOption {
  id: string;
  name: string;
}

export const fetchCountries = async (): Promise<CountryOption[]> => {
  try {
    const res = await fetch(
      "https://api.worldbank.org/v2/country?format=json&per_page=300"
    );
    const json = await res.json();

    if (!Array.isArray(json) || !Array.isArray(json[1])) {
      throw new Error("Invalid country data");
    };

    return json[1]
    .filter((c) => c.region.id !== 'NA')
    .map((c) => ({id: c.id, name: c.name}))
    .sort((a,b) => a.name.localeCompare(b.name));


  } catch (err) {
    console.error("Failed to fetch countries:", err);
    return [];
  }
};
