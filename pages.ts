export type RootStackParamList = {
  Home: undefined;
  Life: {
    lifeData?: {date: string; value: number | null};
    country? : string;
    gender?: "male" | "female" | "total";
  };
};