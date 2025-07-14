import { StyleSheet, Text, View, Button } from "react-native";
import { RootStackParamList } from "../pages";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import { Picker } from "@react-native-picker/picker";
import { SetStateAction, useState } from "react";
import {Picker, DatePicker} from 'react-native-wheel-pick'

type HomeScreenNavigaionProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigaionProp;
}

const days = Array.from({length: 31}, (_, i) => i+1);
const months = [  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',]
const currentYear = new Date().getFullYear();
const years = Array.from({length:221}, (_, i) => currentYear - 110 + i)

export default function HomeScreen({navigation}: Props){

    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedMonth, setSelectedMonth] = useState<string>('January');
    const [selectedYear, setSelectedYear] = useState<number>(2000);

    return(
        <View style={styles.container}>
           <Text style={styles.label}>Date of Birth</Text>
           <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedDay}
                onValueChange={(value: number) => setSelectedDay(value)}
                pickerData={days.map((day)=>({value: day, label: day.toString()}))} 
            />
            {/* <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue: string)=>setSelectedMonth(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            >
                {months.map((month)=>(
                    <Picker.Item key={month} label={month} value={month}/>
                ))}
            </Picker>
            <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue: number)=>setSelectedYear(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            >
                {years.map((year)=> (
                    <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
            </Picker> */}
           </View>
           <Button title="Go to life" onPress={() => navigation.navigate('Life')} />
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  picker: {
    height: 200,
    width: 100,
  },
  pickerItem: {
    height: 200,
    fontSize: 18,
  },
});