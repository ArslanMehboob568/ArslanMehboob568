import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import PlayerDashboard from './src/screens/PlayerDashboard';
import MatchesScreen from './src/screens/MatchesScreen';
import ScoreTrackerScreen from './src/screens/ScoreTrackerScreen';
import StandingsScreen from './src/screens/StandingsScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import AddMatchScreen from './src/screens/AddMatchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="PlayerDashboard" component={PlayerDashboard} />
          <Stack.Screen name="Matches" component={MatchesScreen} />
          <Stack.Screen name="ScoreTracker" component={ScoreTrackerScreen} />
          <Stack.Screen name="Standings" component={StandingsScreen} />
          <Stack.Screen name="Players" component={PlayersScreen} />
          <Stack.Screen name="Teams" component={TeamsScreen} />
          <Stack.Screen name="AddMatch" component={AddMatchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
