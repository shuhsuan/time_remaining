import { StyleSheet, Text, View, Button } from "react-native";
import { RootStackParamList } from "../pages";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SetStateAction, useState, useEffect } from "react";
import { ScrollPicker } from "./Scroller";
import { fetchCountries } from "./redux/countries";
import { fetchLifeExpectancy } from "./redux/lifeExpectancy";

type HomeScreenNavigaionProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigaionProp;
}

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',]
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 221 }, (_, i) => currentYear - 110 + i);
const gender: ("male" | "female" | "total")[] = ["male", "female", "total"];

export default function HomeScreen({ navigation }: Props) {

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [selectedYear, setSelectedYear] = useState<number>(2000);
  const [selectedCountry, setSelectedCountry] = useState<{ id: string; name: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "total">("total");
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);


  useEffect(() => {
    const loadCountries = async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
      setSelectedCountry(countryList[Math.floor(countryList.length / 2)]);
    };
    loadCountries();
  }, [])

   async function lifeCalc(){

    if(!selectedCountry){
      console.warn("No country selected");
      return;
    }
    const data = await fetchLifeExpectancy(selectedCountry?.id, selectedGender);
    const firstDataPoint = data.find(entry => entry.value !==null);
    console.log(firstDataPoint)
    navigation.navigate("Life", {lifeData: firstDataPoint, country: selectedCountry.name, gender: selectedGender})
   }



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dateCont}>
        <ScrollPicker
          data={days}
          onValueChange={(value) => { console.log('Selected: ', value); setSelectedDay(value) }}
        />
        <ScrollPicker
          data={months}
          onValueChange={(value) => { console.log('Selected: ', value); setSelectedMonth(value) }}
        />
        <ScrollPicker
          data={years}
          onValueChange={(value) => { console.log('Selected: ', value); setSelectedYear(value) }}
        />
      </View>
      <Text style={styles.label}>Country of Residence</Text>
      <View style={styles.country}>
        <ScrollPicker
          data={countries}
          onValueChange={(value) => { console.log('Selected: ', value); setSelectedCountry(value) }}
          renderItemText={(item) => item.name}
        />
      </View>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.country}>
        <ScrollPicker
          data={gender}
          onValueChange={(value) => { console.log('Selected: ', value); setSelectedGender(value) }}
        />
      </View>


      <Button title="Go to life" onPress={() => lifeCalc()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  dateCont: {
    flexDirection: 'row',
  },
  country: {
    backgroundColor:'blue',
  }
});