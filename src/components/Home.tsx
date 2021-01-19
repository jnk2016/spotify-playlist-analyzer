import React, {Component,} from 'react';
import { View, Text, StyleSheet, TextInput, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import background from '../assets/images/player-background.jpg';
import trackbar from '../assets/images/trackbar.jpg';
import playButton from '../assets/images/playButton.jpg'
import skipButton from '../assets/images/skipButton.jpg'
import backButton from '../assets/images/backButton.jpg'

class Home extends React.Component<{},any>{
  constructor(props: {} | Readonly<{}>) {
    super(props)
    this.state = {
      windowHeight: 100,
      windowWidth:200,
    }
  }

  componentDidMount(){
    this.setWindowDimensions();
  }

  setWindowDimensions = () =>{
    const dimensions = Dimensions.get('window')
    this.setState({
      windowHeight:dimensions.height,
      windowWidth:dimensions.width
    })
  }

  render(){return(
    <View style={{backgroundColor:'#353535', minHeight:'100vh'}}>
      <View style={styles.headerOptions}>
          <TouchableOpacity style = {styles.headerText}>audio data</TouchableOpacity>
          <TouchableOpacity style = {styles.headerText}>audio features</TouchableOpacity>
          <TouchableOpacity style = {styles.headerText}>audio analysis</TouchableOpacity>
      </View>
      <View style={styles.playlist}>
        <ImageBackground source = {{uri:background}} style = {styles.backgroundImage}>
          <View style={styles.grayBar}/>
          <TextInput
            style={styles.inputUri}
            placeholder={'Enter a Spotify Playlist URI'}
            allowFontScaling={true}
            placeholderTextColor='#5F5454'/>
          <View style={styles.grayBar}/>
          </ImageBackground>
        <Text style={styles.analysisText}>SPOTIFY PLAYLIST ANALYSIS</Text>
        <Text style={styles.sortText}>SORT YOUR SPOTIFY PLAYLIST</Text>
        <Image source = {{uri:trackbar}} style={{alignSelf:'center', width:'100%', paddingVertical:'10%', resizeMode:'contain'}}/>
        <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:'7%'}}>
          <Image source = {{uri:backButton}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain'}}/>
          <Image source = {{uri:playButton}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain'}}/>
          <Image source = {{uri:skipButton}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain'}}/>
        </View>
      </View>
      <View style={styles.rightSide}>  
        
      </View>
    </View>
  )}
}

const styles = StyleSheet.create({
  analysisText:{
    fontFamily:'Spartan',
    color:'white',
    fontSize: 25,
    marginTop:'2%',
    
  },
  sortText:{
    fontFamily:'Spartan',
    color:'white',
    fontSize: 22,
    marginVertical:'2%',
  },
  grayBar:{
    backgroundColor:'#353535',
    height:'15%',
    marginHorizontal:'8%',
    borderRadius:50,
  },
  inputUri:{
    backgroundColor:'white',
    borderRadius:50,
    borderWidth:2,
    borderColor: 'black',
    textAlign:'center',
    textAlignVertical:'center',
    height:'15%',
    marginHorizontal:'3%'
  },
  playlist:{
    backgroundColor:'#282727',
    flexDirection:'column',
    width:'35vw',
    height:'auto',
    marginTop:'1%',
    padding:'2%',
    // paddingBottom:'50%'
  },
  backgroundImage:{
    resizeMode:'stretch',
    height:'40vh',
    width:'100%',
    alignSelf:'center',
    justifyContent: 'space-evenly',
  },
  rightSide:{
    flexDirection:'column',
  },
  headerOptions:{
    flexDirection:'row',
    alignSelf: 'flex-end',
    justifyContent:'space-between',
    width:'50%',
    marginTop:'1%'
  },
  headerText:{
    fontFamily:'Spartan',
    color:'white',
    fontSize: 20,
    marginHorizontal:'3%'
  }
})

export default Home;