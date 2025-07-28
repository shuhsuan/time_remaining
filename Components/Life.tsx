import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../pages";
import { RouteProp, useRoute } from "@react-navigation/native";

type LifeRouteProp = RouteProp<RootStackParamList, "Life">

export default function Life(){

  const route = useRoute<LifeRouteProp>();
  const {lifeData, country, gender} = route.params;

    return(
        <View style={styles.container}>
           <Text>{lifeData?.value}</Text> 
           <Text>{country}</Text>
           <Text>{gender}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});