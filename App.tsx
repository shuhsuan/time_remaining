import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Components/HomeScreen';
import Life from './Components/Life';
import { RootStackParamList } from './pages';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 

      initialRouteName="Home">
        <Stack.Screen
        options={{
          headerShown: false
        }} 
        name="Home" 
        component={Home}
        />
        <Stack.Screen 
        options={{
          headerShown: false
        }} 
        name="Life" 
        component={Life} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
