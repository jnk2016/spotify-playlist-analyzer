import React, {Component,} from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import trackbar from '../assets/images/trackbar.jpg';
import playButton from '../assets/images/playButton.jpg';
import skipButton from '../assets/images/skipButton.jpg';
import backButton from '../assets/images/backButton.jpg';
import skipIcon from '../assets/images/skipIcon.jpg';
import emptySongAlbum from '../assets/images/emptySongAlbum.jpg';
import linkedInLogo from '../assets/images/linkedinLogo.png';
import LinearGradient from '../assets/Features/LinearGradient';

interface Props{
  navigation:any
}

class Home extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      infoType:'data',
      uri: '0fCpH2h614ebCnRW4Wmy9L',
    };
  }
  
  renderInfo=()=>{
    if(this.state.infoType=='data'){
      return(
        <View style={styles.rightSide}>
          <Text style={styles.rightHeaderText}>SORT BY</Text>
          <Text style={styles.rightDataText}>BPM</Text>
          <Text style={styles.rightDataText}>KEY</Text>
          <Text style={styles.rightDataText}>ENERGY</Text>
          <Text style={styles.rightDataText}>NAME</Text>
          <Text style={styles.rightDataText}>ARTISTS</Text>
          <Text style={styles.rightDataText}>TIME SIG</Text>
        </View>
      );
    }
    else if(this.state.infoType=='features'){
      return(
        <View style={styles.rightSideFeature}>
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
            <Text style={styles.rightAnalysisText}>energy | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>intensity of a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#3E3BD6', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>valence | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>positivity of a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#7280FF', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>danceability | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>how suitable a track is for dancing</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#5BCC96', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>acousticness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>how acoustic a track is</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FFE70F', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>instrumentalness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of instruments rather than vocals</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF7A00', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>liveness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of audience in a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF0000', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}>speechiness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of spoken words in a track</Text></Text>
          </View>
        </View>
      );
    }
  }

  render(){return(
    <LinearGradient  colors = {['#353535', '#494949','#252525']} style={{ minHeight:'100vh'}}>
      <View style={styles.header}>
          <View style={styles.headerLinks}>
            <Text style={styles.headerLinkText}>Developer:</Text>
            <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500,}} onPress={()=>{window.open('https://www.linkedin.com/in/jackson-kim-480949191/','_blank')}}>
              <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
            </TouchableOpacity>
            <Text style={styles.headerLinkText}>Designer:</Text>
            <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500,}} onPress={()=>{window.open('https://www.linkedin.com/in/danphuong-hoang-0baa58138/','_blank')}}>
              <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
            </TouchableOpacity>
          </View>
          <View style={styles.headerOptions}>
            <TouchableOpacity onPress={()=>{this.setState({infoType:'data'})}}><Text style = {styles.headerOptionsText}>audio data</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.setState({infoType:'features'})}}><Text style = {styles.headerOptionsText}>audio features</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.setState({infoType:'analysis'})}}><Text style = {styles.headerOptionsText}>audio analysis</Text></TouchableOpacity>
          </View>
      </View>
      <View style={{flexDirection:'row'}}>
        <LinearGradient  colors = {['#202020','#505050','#404040','#303030','#282727','#282727','black']} style={styles.playlist}>
          <LinearGradient colors = {['#9FFFC0', '#1DB954', '#2D6240']} style = {styles.backgroundImage}>
            <View style={styles.grayBar}/>
            <TextInput
              style={styles.inputUri}
              placeholder={"Copy and Paste Playlist Link of Public Spotify Playlist"}
              allowFontScaling={true}
              placeholderTextColor='#5F5454'
              onChangeText={inputUri=>{
                inputUri = inputUri.replace('https://open.spotify.com/playlist/', '');
                inputUri = inputUri.slice(0,22);
                this.setState({uri:inputUri});
                }}/>
            <View style={styles.grayBar}/>
            </LinearGradient>
          <Text style={styles.analysisText}>SPOTIFY PUBLIC PLAYLIST ANALYZER</Text>
          <Text style={styles.clickText}>CLICK THE PLAY BUTTON TO ANALYZE</Text>
          <Image source = {{uri:trackbar}} style={{alignSelf:'center', width:'100%', paddingVertical:'10%', resizeMode:'contain'}}/>
          <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:'6%'}}>
            <Image source = {{uri:skipIcon}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain', tintColor:'white', transform:[{rotate:'180deg'}]}}/>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Playlist Analysis', {playlistUri:this.state.uri})} style={{height:'12vh', width:'12vh', borderRadius:500, shadowColor:'white', shadowRadius:20, backgroundColor:'white'}}>
              <Image source = {{uri:playButton}} style={{alignSelf:'center', width:'12vh', height:'12vh', resizeMode:'cover', borderRadius:500, shadowColor:'white', shadowRadius:20, backgroundColor:'white'}}/>
            </TouchableOpacity>
            <Image source = {{uri:skipIcon}} style={{alignSelf:'center', width:'20%', paddingVertical:'7%', resizeMode:'contain', tintColor:'white'}}/>
          </View>
        </LinearGradient>
          {this.renderInfo()}
      </View>
    </LinearGradient>
  )}
}

const styles = StyleSheet.create({
  rightAnalysisText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    borderRadius:50,
    padding:'1%',
    width:'57%',
    alignSelf:'center',
  },
  rightFeaturesSingleContainer:{
    flexDirection:'row',
    marginVertical:'3vh',
  },
  rightFeaturesText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:25,
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
    justifyContent:'space-evenly',
    width:'64%',
  },
  rightSideFeature:{
    flexDirection:'column',
    justifyContent:'space-evenly',
    width:'64vw',
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
  clickText:{
    fontFamily:'Segoe UI',
    color:'#A4A4A4',
    fontSize: 22,
    marginVertical:'2%',
    fontWeight:'500'
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
    textAlign:'center',
    textAlignVertical:'center',
    height:'15%',
    marginHorizontal:'3%',
    shadowColor:'black',
    shadowRadius:10,
    shadowOffset:{width: 5,height:6}
  },
  playlist:{
    flexDirection:'column',
    width:'36%',
    height:'91vh',
    marginTop:'1vh',
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
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    marginTop:'1%',
  },
  headerLinks:{
    flexDirection:'row',
    width:'36%',
  },
  headerLinkText:{
    fontFamily:'Segoe UI',
    color:'#A4A4A4',
    textShadowColor:'white',
    textShadowRadius:1,
    fontSize: 15,
    letterSpacing:1,
    marginLeft:'7%'
  },
  linkImage:{
    height:'4vh',
    width:'4vh',
    resizeMode:'cover',
    accessible:false,
    alignSelf:'center',
    borderRadius:500,
  },
  headerOptions:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    width:'62%',
    marginLeft:'2vh',
  },
  headerOptionsText:{
    fontFamily:'Segoe UI',
    color:'white',
    textShadowColor:'white',
    textShadowRadius:6,
    fontSize: 20,
    letterSpacing:1,
  },
})

export default Home;