import React from 'react';
import './App.css';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Song from './components/Song';
import backButton from './assets/images/backButton.jpg';

function App() {
  const config = {
    screens:{
      Home: 'home',
    }
  }
  const linking = {
    prefixes:['https://jnk2016.github.io/spotify-playlist-analyzer/', 'http://localhost:3000/spotify-playlist-analyzer'],
    config,
  }
  // const state = {
  //   routes:[
  //     {
  //       name:'Home',
  //     }
  //   ]
  // }

  const Stack = createStackNavigator();
  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name='Song' component={Song} options={{headerShown: true, headerBackTitle:'Back',}}/>
        <Stack.Screen name='Playlist' component={Playlist} options={{headerShown: true}}/>
        <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
