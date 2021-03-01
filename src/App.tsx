import React from 'react';
import './App.css';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Song from './components/Song';
import spotifylogo from './assets/images/spotifylogo.png';
import goback from './assets/images/goback.png'
import {Hoverable} from 'react-native-web-hover';

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
    <NavigationContainer fallback={<View><Text>Loading...</Text></View>}>
      <Stack.Navigator initialRouteName={'Spotify Public Playlist Analyzer'}>
        <Stack.Screen name='Song Analysis' component={Song} 
          options={{
            headerBackImage: ()=>(
            <Hoverable>
            {({hovered})=>( <Image source={{uri:goback}} style={{height:60, width:60, resizeMode:'contain'}}/>
            )}
            </Hoverable>
            ),
            headerShown: true, 
            headerBackTitle:'Back',
            headerStyle: {
              borderBottomColor: 'transparent',
              backgroundColor: '#282727', //Set Header color
              elevation: 5,
              shadowColor:'black',
              shadowRadius:10,
            },
            headerTitleStyle: {
              fontWeight: '600', //Set Header text style
              fontFamily: 'Segoe UI',
              letterSpacing:2,
              color:'white',
            },
          }}/>
        <Stack.Screen name='Playlist Analysis' component={Playlist}
          options={{
            headerBackImage: ()=>(
            <Hoverable>
            {({hovered})=>( <Image source={{uri:spotifylogo}} style={{height:50, width:50, resizeMode:'contain', opacity:(hovered?.5:1)}}/>
            )}
            </Hoverable>
            ),
            headerShown: true, 
            headerBackTitle:'Back',
            headerStyle: {
              borderBottomColor: 'transparent',
              backgroundColor: '#282727', //Set Header color
              elevation: 5,
              shadowColor:'black',
              shadowRadius:10,
            },
            headerTitleStyle: {
              fontWeight: '600', //Set Header text style
              fontFamily: 'Segoe UI',
              letterSpacing:2,
              color:'white',
            },
          }}/>
        <Stack.Screen name='Spotify Public Playlist Analyzer' component={Home} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
