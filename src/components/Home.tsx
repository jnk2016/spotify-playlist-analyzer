import React, {Component,} from 'react';
import { View, Text, StyleSheet, TextInput, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import background from '../assets/images/player-background.jpg';
import trackbar from '../assets/images/trackbar.jpg';
import playButton from '../assets/images/playButton.jpg';
import skipButton from '../assets/images/skipButton.jpg';
import backButton from '../assets/images/backButton.jpg';
import emptySongAlbum from '../assets/images/emptySongAlbum.jpg'

interface Props{
  navigation:any
}

class Home extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      infoType:'data',
    };
  }
  
  renderInfo=()=>{
    if(this.state.infoType=='data'){
      return(
        <View style={styles.rightSide}>
          <Text style={styles.rightHeaderText}>SORT BY</Text>
          <Text style={styles.rightDataText}>    KEY    </Text>
          <Text style={styles.rightDataText}>CAMELOT</Text>
          <Text style={styles.rightDataText}>   ENERGY   </Text>
          <Text style={styles.rightDataText}>    BPM    </Text>
        </View>
      );
    }
    else if(this.state.infoType=='features'){
      return(
        <View style={styles.rightSide}>
          <Text style={styles.rightHeaderText}>FIND THE</Text>
          <View style={{flexDirection:'row', justifyContent:'space-evenly',}}>
            <View>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>DURATION</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>POPULARITY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>MODALITY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>TIME SIGNATURE</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>SECTIONS</Text>
              </View> 
            </View>
            <View>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>KEY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BEATS</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BPM</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BARS</Text>
              </View>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{height:'8vh', width:'5vw', resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>SEGMENTS</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
    else if(this.state.infoType=='analysis'){
      return(
        <View style={styles.rightSide}>
            <Text style={styles.rightHeaderText}>ANALYZE</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#9C1EFF', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>valence</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#3E3BD6', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>speechiness</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#7280FF', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>liveness</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#5BCC96', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>instrumentalness</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FFE70F', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>energy</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF7A00', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>danceability</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF0000', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>acousticness</Text>
          </View>
        </View>
      );
    }
  }

  render(){return(
    <View style={{backgroundColor:'#353535', minHeight:'100vh'}}>
      <View style={styles.headerOptions}>
          <TouchableOpacity style = {styles.headerText} onPress={()=>{this.setState({infoType:'data'})}}>audio data</TouchableOpacity>
          <TouchableOpacity style = {styles.headerText} onPress={()=>{this.setState({infoType:'features'})}}>audio features</TouchableOpacity>
          <TouchableOpacity style = {styles.headerText} onPress={()=>{this.setState({infoType:'analysis'})}}>audio analysis</TouchableOpacity>
      </View>
      <View style={{flexDirection:'row'}}>
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
          <Text style={styles.sortText}>CLICK THE PLAY BUTTON TO ANALYZE</Text>
          <Image source = {{uri:trackbar}} style={{alignSelf:'center', width:'100%', paddingVertical:'10%', resizeMode:'contain'}}/>
          <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:'7%'}}>
            <Image source = {{uri:backButton}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain'}}/>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Playlist')} style={{height:'10vh', width:'5vw'}}>
              <Image source = {{uri:playButton}} style={{alignSelf:'center', width:'100%', height:'100%', resizeMode:'contain'}}/>
            </TouchableOpacity>
            <Image source = {{uri:skipButton}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain'}}/>
          </View>
        </View>
        {/* <View style={styles.rightSide}>   */}
          {this.renderInfo()}
        {/* </View> */}
      </View>
    </View>
  )}
}

const styles = StyleSheet.create({
  rightAnalysisText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    // fontWeight:'700',
    borderRadius:50,
    padding:'1%',
    width:'20%',
    alignSelf:'center',
  },
  rightFeaturesSingleContainer:{
    flexDirection:'row',
    marginVertical:'3vh',
  },
  rightFeaturesText:{
    // textAlign:'center',
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:25,
    // fontWeight:'600',
    letterSpacing:1
  },
  rightHeaderText:{
    textAlign:'center',
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:30,
    fontWeight:'600',
    letterSpacing:1
  },
  rightDataText:{
    textAlign:'center',
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    // fontWeight:'700',
    borderRadius:50,
    padding:'1%',
    borderWidth:1,
    borderColor:'white',
    width:'20%',
    alignSelf:'center',
    marginTop:'-2%'
  },
  rightSide:{
    flexDirection:'column',
    // height:'20vh',
    // width:'20vw',
    justifyContent:'space-evenly',
    // textAlign:'center'
    // alignSelf:'center',
    width:'64%',
  },
  analysisText:{
    fontFamily:'Segoe UI',  // Gotten from Index
    color:'white',
    fontSize: 25,
    marginTop:'2%',
    fontWeight:'700',
    letterSpacing:1
  },
  sortText:{
    fontFamily:'Segoe UI',
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
    width:'36%',
    height:'auto',
    marginTop:'1%',
    padding:'2%',
    paddingBottom:'1%'
  },
  backgroundImage:{
    resizeMode:'stretch',
    height:'40vh',
    width:'100%',
    alignSelf:'center',
    justifyContent: 'space-evenly',
  },
  headerOptions:{
    flexDirection:'row',
    alignSelf: 'flex-end',
    justifyContent:'space-between',
    width:'50%',
    marginTop:'1%',
    marginRight:'6%',
  },
  headerText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize: 20,
    marginHorizontal:'3%',
    letterSpacing:1,
  }
})

export default Home;