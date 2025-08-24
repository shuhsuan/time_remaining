import { StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { RootStackParamList } from "../pages";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";
import { useState, useEffect, useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useWindowDimensions } from "react-native";
import React from "react";
import { Pressable } from "react-native";






type LifeRouteProp = RouteProp<RootStackParamList, "Life">
type ViewMode = "Years" | "Weeks";

function getMonth(s: string): number {
  switch (s) {
    case "January": return 1;
    case "February": return 2;
    case "March": return 3;
    case "April": return 4;
    case "May": return 5;
    case "June": return 6;
    case "July": return 7;
    case "August": return 8;
    case "September": return 9;
    case "October": return 10;
    case "November": return 11;
    case "December": return 12;
    default: return 13;

  }
}

function calcAge(bday: Date): number {
  const today = new Date();

  let age = today.getFullYear() - bday.getFullYear();
  const monthDiff = today.getMonth() - bday.getMonth(); //if it's more than 0, it's past 
  const dayDiff = today.getDay() - bday.getDay(); //if it's more than 0, its past

  if (monthDiff < 0 || (monthDiff == 0 && dayDiff < 0)) {
    age--;
  };

  return age;
}

export default function Life() {

  const [viewMode, setViewMode] = useState<ViewMode>("Years");
  const [fitToScreen, setFitToScreen] = useState(true);
  const [loading, setLoading] = useState(true);
  const route = useRoute<LifeRouteProp>();
  const { firstDataPoint, country, gender, day, month, year } = route.params;
  const bday = new Date(year, getMonth(month) - 1, day);
  const [boxesWidth, setBoxesWidth] = useState(0);
  const [boxesHeight, setBoxesHeight] = useState(0);


  function BoxesView({ mode, bday, lifeExpectancy, boxesWidth, boxesHeight }: { mode: ViewMode, bday: Date, lifeExpectancy: number, boxesWidth: number, boxesHeight: number }) {

    const [boxes, setBoxes] = useState<number[]>([]);
    const [filledBoxCount, setFilledBoxCount] = useState(0);

    useEffect(() => {
      const today = new Date();

      let weeksTotal = lifeExpectancy * 52;
      let daysTotal = weeksTotal * 7;

      const ageYears = calcAge(bday);
      const ageWeeks = ageYears * 52 + ((today.getMonth()) * 4) + (today.getDate() / 7); //today.getMonth is one less but that's fine
      const ageDays = ageWeeks * 7 + (bday.getDate() % 7);

      function getHighlight() {
        switch (mode) {
          case "Years":
            return Math.floor(ageYears);
          case "Weeks":
            return Math.floor(ageWeeks);
          // case "Days":
          //   return Math.floor(ageDays);
          default:
            return 0;
        }
      }

      function getBoxes() {
        switch (mode) {
          case "Years":
            return lifeExpectancy;
          case "Weeks":
            return weeksTotal
          // case "Days":
          //   return daysTotal
          default:
            return 0;
        }
      };

      const boxCount = getBoxes();
      setFilledBoxCount(getHighlight());
      setBoxes(Array.from({ length: boxCount }, (_, i) => i));
    }, [mode, bday, lifeExpectancy]);

    const MARGIN = 2;

    const { columns, rows, boxSize, offsetXHalf } = useMemo(() => {
      if (!boxesWidth || !boxesHeight || boxes.length === 0) {
        return { columns: 1, rows: 1, boxSize: 20 };
      }

      if (fitToScreen) {
        const aspect = boxesWidth / boxesHeight;
        let columns = Math.max(1, Math.round(Math.sqrt(boxes.length * aspect)));
        let rows = Math.ceil(boxes.length / columns);

        // take margins into account
        const usableWidth = boxesWidth - columns * (MARGIN * 2);
        const usableHeight = boxesHeight - rows * (MARGIN * 2);

        const boxW = Math.floor(usableWidth / columns);
        const boxH = Math.floor(usableHeight / rows);

        const boxSize = Math.min(boxW, boxH)

        const totalGridWidth = columns * (boxSize + MARGIN * 2);

        const totalGridHeight = rows * (boxSize + MARGIN * 2);

        // leftover space to center the grid
        const offsetX = Math.max(0, (boxesWidth - totalGridWidth) / 2);
        const offsetXHalf = offsetX / 2;


        return {
          columns,
          rows,
          boxSize: boxSize,
          offsetXHalf
        };
      }
      else {
        const columns = 6;
        const usableWidth = boxesWidth - columns * (MARGIN * 4);
        const boxSize = Math.floor(usableWidth / columns);
        const totalGridWidth = columns * (boxSize + MARGIN * 2);
        const offsetX = Math.max(0, (boxesWidth - totalGridWidth) / 2);
        const offsetXHalf = offsetX * 2;
        return { columns, boxSize, offsetXHalf }
      }
    }, [boxesWidth, boxesHeight, boxes.length]);



    return (

      <FlatList
        data={boxes}
        key={`grid-${columns}`}
        keyExtractor={(item) => item.toString()}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{
        //   // marginHorizontal: offsetXHalf,
        //   // alignItems: "center"
        // }}
        renderItem={({ item }) => (
          <View
            style={{
              width: boxSize,
              height: boxSize,
              margin: MARGIN,
              borderRadius: 8,
              backgroundColor: item < filledBoxCount ? "#c7a84cff" : "#ccc",
              borderColor: (viewMode === "Weeks" && fitToScreen === true) ? '' : 'black',
              borderWidth: (viewMode === "Weeks" && fitToScreen === true) ? 0 : 1,
              boxShadow: (viewMode === "Weeks" && fitToScreen === true) ? '' : '0px 10px 15px -3px rgba(0,0,0,0.3)'

            }}
          />
        )}
      />
    )

  }

  async function clearData() {
    await AsyncStorage.removeItem('userInfo');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Time You've Held and Time That Awaits
      </Text>
      <Text style={styles.subTitle}>
        Make the most of it
      </Text>
      <View style={styles.timeToggle}>
        {["Years", "Weeks"].map(mode => {
          const isActive = viewMode === mode;
          return (
            <Pressable key={mode} style={[styles.option, isActive ? styles.activeOption : styles.inactiveOption]} onPress={() => setViewMode(mode as ViewMode)
            }>
              <Text style={[styles.text, viewMode === mode && styles.activeText]}>
                {mode}
              </Text>
            </Pressable>
          )
        }

        )}

      </View>
      <Pressable onPress={() => setFitToScreen(!fitToScreen)} style={({ pressed }) => [
        styles.button,
        {
          transform: [
            { translateY: pressed ? 2 : 0 },
            { scale: pressed ? 0.98 : 1 }
          ]
        }
      ]} >
        <Text style={{
          padding: 10,
          fontWeight: 'bold',
          borderRadius: 7,
          borderColor: 'black',
          borderWidth: 1,
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.3)',
          marginTop: 0,
        }}>{fitToScreen ? "Scroll Mode" : "Fit to Screen"}</Text>
      </Pressable>

      <View style={{ flex: 1, width: "100%", alignItems: "center", marginRight: 10, marginLeft: 10 }} onLayout={e => { setBoxesWidth(e.nativeEvent.layout.width); setBoxesHeight(e.nativeEvent.layout.height); }}>
        {viewMode === "Years" && <BoxesView mode="Years" bday={bday} lifeExpectancy={firstDataPoint?.value ?? 0} boxesWidth={boxesWidth} boxesHeight={boxesHeight} />}
        {viewMode === "Weeks" && <BoxesView mode="Weeks" bday={bday} lifeExpectancy={firstDataPoint?.value ?? 0} boxesWidth={boxesWidth} boxesHeight={boxesHeight} />}
        {/* {viewMode === "Days" && <BoxesView mode="Days" bday={bday} lifeExpectancy={firstDataPoint?.value ?? 0} boxesWidth={boxesWidth} boxesHeight={boxesHeight} />} */}
      </View>
      <Pressable
        onPress={() => { clearData() }}
        style={({ pressed }) => [
          styles.button,
          {
            transform: [
              { translateY: pressed ? 2 : 0 },
              { scale: pressed ? 0.98 : 1 }
            ]
          }
        ]}
      >

        <Text style={{
          padding: 10,
          fontWeight: 'bold',
          borderRadius: 7,
          borderColor: 'black',
          borderWidth: 1,
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.3)'
        }}>Clear data</Text>

      </Pressable>
    </View>
  )
}
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7e7cdff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeToggle: {
    flexDirection: "row",
    // overflow: "hidden",
    backgroundColor: '#e7e7cdff',
    width: 200,
    // height: 45,
    alignItems: "center",
    marginTop: 15,
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    // borderRadius: 7,
    // margin: 15,
  },
  inactiveOption: {
    // boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
    // borderWidth: 2,
    backgroundColor: '#e7e7cdff',
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 2
  },

  activeOption: {
    // boxShadow: '0 0 2px 1px black inset'
    // backgroundColor: '#e7e7cdff',
    // elevation: 0,
    // shadowOpacity: 0,
    // borderWidth: 2
  backgroundColor: '#d1d1b7ff',
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 2,
  borderLeftWidth: 2,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderColor: "#aaa",
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#444",
  },
  activeText: {
    fontWeight: "bold",
    color: "#000",
  },
  // boxes: {
  //   flex: 1,

  // },
  // filled: {
  //   backgroundColor: "#c7a84cff",
  // },
  // empty: {
  //   backgroundColor: "#eee",
  // },
  title: {
    fontWeight: "bold",
    paddingTop: 55,
    fontSize: 20
  },
  subTitle: {
        fontWeight: "bold",
    paddingTop: 5,
    fontSize: 6
  },
  button: {
    margin: 20,
    fontWeight: "bold",
    borderRadius: 7,
    borderColor: 'black',
    borderWidth: 1,
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.3)'
  }
});