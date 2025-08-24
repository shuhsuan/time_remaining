import { StyleSheet, Text, View, Button } from "react-native";
import { RootStackParamList } from "../pages";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SetStateAction, useState, useEffect } from "react";
import { ScrollPicker } from "./Scroller";
import { fetchCountries } from "./redux/countries";
import { fetchLifeExpectancy } from "./redux/lifeExpectancy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable } from "react-native";

type HomeScreenNavigaionProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigaionProp;
}



const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.toLocaleString('default', { month: 'long' });
const currentYear = today.getFullYear();

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',]
const years = Array.from({ length: 221 }, (_, i) => currentYear - 110 + i);

export default function HomeScreen({ navigation }: Props) {

  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedCountry, setSelectedCountry] = useState<{ id: string; name: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "total">("female");
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userInfo');
        if (stored !== null) {
          const user = JSON.parse(stored);
          const lifeData = await fetchLifeExpectancy(user.countryCode, user.gender);
          const firstDataPoint = lifeData.find(entry => entry.value !== null);
          navigation.navigate("Life", { firstDataPoint, ...user })
        }

      }
      catch (e) { console.log(e) }



      // if(stored){
      //   const user = JSON.parse(stored);
      //   const lifeData = await fetchLifeExpectancy(user.countryCode, user.gender);
      //   const firstDataPoint = lifeData.find(entry => entry.value !==null);
      //   navigation.navigate("Life", {firstDataPoint, ...user})
      // }
    };
    checkStoredUser();
  }, [])

  useEffect(() => {
    const loadCountries = async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
      const mid = Math.floor(countryList.length / 2);

      setSelectedCountry(countryList[mid]);
    };
    loadCountries();
  }, [])

  const calcDays = (month: string, year: number): number[] => {
    let daysInMonth = 31;
    switch (month) {
      case 'February':
        daysInMonth = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
        break;
      case 'April':
      case 'June':
      case 'September':
      case 'November':
        daysInMonth = 30;
        break;
    }
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  async function nav_n_save() {

    if (!selectedCountry) {
      console.warn("No country selected");
      return;
    }

    await AsyncStorage.setItem("userInfo", JSON.stringify({
      country: selectedCountry.name,
      gender: selectedGender,
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear,
      countryCode: selectedCountry?.id,
    }))

    const data = await fetchLifeExpectancy(selectedCountry?.id, selectedGender);
    const firstDataPoint = data.find(entry => entry.value !== null);
    navigation.navigate("Life", { firstDataPoint: firstDataPoint, country: selectedCountry.name, gender: selectedGender, day: selectedDay, month: selectedMonth, year: selectedYear, countryCode: selectedCountry?.id })
  }



  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollCont}>
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateCont}>
          <ScrollPicker
            data={calcDays(selectedMonth, selectedYear)}
            onValueChange={(value) => { setSelectedDay(value) }}
            initialValue={selectedDay}
          />
          <ScrollPicker
            data={months}
            onValueChange={(value) => { setSelectedMonth(value) }}
            initialValue={selectedMonth}
          />
          <ScrollPicker
            data={years}
            onValueChange={(value) => {
              setSelectedYear(value)
            }}
            initialValue={selectedYear}
          />
        </View>
      </View>
      <View style={styles.scrollCont}>
        <Text style={styles.label}>Country of Residence</Text>
        <View style={styles.otherScrollsCont}>
          <ScrollPicker
            data={countries}
            onValueChange={(value) => { setSelectedCountry(value) }}
            renderItemText={(item) => item ? item.name : ''}
            initialValue={selectedCountry}
          />
        </View>
      </View>
      <View style={styles.scrollCont}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.otherScrollsCont}>
          <ScrollPicker
            data={["Male", "Female", "Other"]}
            onValueChange={(value) => {
              switch (value) {
                case "Male": setSelectedGender("male"); break;
                case "Female": setSelectedGender("female"); break;
                case "Other": setSelectedGender("total"); break;
              }
            }}
            initialValue={"female"}
          />
        </View>
      </View>

      <Pressable
      onPress={nav_n_save}
      style={({pressed})=>[
        styles.button, {
          transform:[
            { translateY: pressed ? 2 : 0 },
            { scale: pressed ? 0.98 : 1 }
          ]
        }
      ]}
      >
<Text style={styles.lifeButtText}>Your Life View 🍃</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#e7e7cdff',
  },
  label: {
    fontSize: 20,
    marginBottom: 15,
    marginTop: 10,
    fontWeight: 'bold',
    color: "#c7a84cff",
    paddingTop: 3
  },
  dateCont: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  otherScrollsCont: {
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  scrollCont: {
    alignItems: 'center',
    // borderWidth: 5,
    margin: 4,
    padding: 5,
    borderRadius: 7,
    backgroundColor: '#ddddc5ff',
    borderColor: 'black',
    borderWidth: 0.7,
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
    // boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
  },

  lifeButtText: {
    margin: 5,
    fontWeight: 'bold',
  },
  button: {
    padding: 5,
    margin: 15,
    borderRadius: 7,
    borderWidth: 0.7,
    backgroundColor: "#c7a84cff",
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
  },


});

