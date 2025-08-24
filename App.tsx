import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Components/HomeScreen';
import Life from './Components/Life';
import { RootStackParamList } from './pages';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor="transparent" />
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
          <Stack.Screen options={{headerShown: false}} name="Home" component={Home}/>
          <Stack.Screen options={{ headerShown: false }} name="Life" component={Life} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#e7e7cdff"
  },
});
