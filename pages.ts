export type RootStackParamList = {
  Home: undefined;
  Life: {
    firstDataPoint?: {date: string; value: number | null};
    country? : string;
    gender?: "male" | "female" | "total";
    day: number;
    month: string;
    year: number;
    countryCode: string;
  };
};