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
import CheckMark from '../assets/images/Checkmark.png';
import { BrowserView, MobileView, isMobile } from "react-device-detect";

interface Props{
  navigation:any
}

class Home extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      infoType:'data',
      uri: '37i9dQZF1DWSP55jZj2ES3',
    };
  }
  
  renderInfo=()=>{
    if(this.state.infoType=='data'){
      return(
          <View style={styles.dataContainer}>
            <Text style={styles.infoHeaderText}>SORT BY</Text>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>BPM</Text>
            </View>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>KEY</Text>
            </View>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>ENERGY</Text>
            </View>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>NAME</Text>
            </View>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>ARTISTS</Text>
            </View>
            <View style={styles.rightData}>
              <Image source={{uri:CheckMark}} style={{height:'5vh', width:'5vh', resizeMode: 'contain', tintColor:'white'}}/>
              <Text style={styles.rightDataText}>TIME SIG</Text>
            </View>
          </View>
      );
    }
    else if(this.state.infoType=='features'){
      return(
        <View style={styles.featureContainer}>
          <Text style={styles.infoHeaderText}>FIND THE</Text>
          <View style={{flexDirection:'row', justifyContent:'space-evenly',}}>
            <View style={{paddingLeft:'3%'}}>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>DURATION</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>POPULARITY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>MODALITY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>TIME SIG.</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>SECTIONS</Text>
              </View> 
            </View>
            <View style={{paddingLeft:'3%'}}>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>KEY</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BEATS</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BPM</Text>
              </View> 
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>BARS</Text>
              </View>
              <View style={styles.rightFeaturesSingleContainer}>
                <Image source={{uri:emptySongAlbum}} style={{minHeight:40, minWidth: 40, resizeMode:'contain'}}/>
                <Text style={styles.rightFeaturesText}>SEGMENTS</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
    else if(this.state.infoType=='analysis'){
      return(
        <View style={styles.analysisContainer}>
          <Text style={styles.infoHeaderText}>ANALYZE</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#9C1EFF', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> energy | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>intensity of a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#3E3BD6', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> valence | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>positivity of a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#7280FF', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> danceability | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>how suitable a track is for dancing</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#5BCC96', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> acousticness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>how acoustic a track is</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FFE70F', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> instrumentalness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of instruments rather than vocals</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF7A00', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> liveness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of audience in a track</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{borderRadius:100, borderColor:'white', borderWidth:1, opacity:.5, backgroundColor:'#FF0000', height:'7vh',width:'7vh'}}/>
            <Text style={styles.rightAnalysisText}> speechiness | <Text style={{fontSize:19, fontStyle: 'italic', color:'#A4A4A4'}}>presence of spoken words in a track</Text></Text>
          </View>
        </View>
      );
    }
  }

  render(){return(
    <LinearGradient  colors = {['#353535', '#494949','#252525']} style={{ minHeight:'100vh'}}>
      <View style={styles.header}>
          <Text style={styles.analysisText}>SPOTIFY PUBLIC PLAYLIST ANALYZER</Text>
          <BrowserView>
            <View style={styles.headerLinks}>
              <Text style={styles.headerLinkText}>Developer:</Text>
              <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500, height:35, width:35,marginHorizontal:'10%'}} onPress={()=>{window.open('https://www.linkedin.com/in/jackson-kim-480949191/','_blank')}}>
                <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
              </TouchableOpacity>
              <Text style={styles.headerLinkText}>Designer:</Text>
              <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500, height:35, width:35,marginHorizontal:'10%'}} onPress={()=>{window.open('https://www.linkedin.com/in/danphuong-hoang-0baa58138/','_blank')}}>
                <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
              </TouchableOpacity>
            </View>
          </BrowserView>
          <MobileView>
            <View style={{flexDirection:'column', flex:1}}>
              <Text style={styles.headerLinkText}>Developer:</Text>
              <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500, height:35, width:35}} onPress={()=>{window.open('https://www.linkedin.com/in/jackson-kim-480949191/','_blank')}}>
                <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
              </TouchableOpacity>
              <Text style={styles.headerLinkText}>Designer:</Text>
              <TouchableOpacity style={{marginLeft:'2%', shadowColor:'white', shadowRadius:10, borderRadius:500, height:35, width:35}} onPress={()=>{window.open('https://www.linkedin.com/in/danphuong-hoang-0baa58138/','_blank')}}>
                <Image source={{uri:linkedInLogo}} style={styles.linkImage}/>
              </TouchableOpacity>
            </View>
          </MobileView>
      </View>
        <LinearGradient  colors = {['black','#505050','#404040','#282727','#282727','#282727','#191919','#191919','black']} style={styles.playlist}>
          <LinearGradient colors = {['#2D6240','#9FFFC0','#1DB954']} style = {styles.backgroundImage}>
            <View style={styles.grayBar}/>
            <TextInput
              style={styles.inputUri}
              placeholder={"Copy and Paste Playlist Link of Public Spotify Playlist"}
              allowFontScaling={true}
              placeholderTextColor='white'
              onChangeText={inputUri=>{
                inputUri = inputUri.replace('https://open.spotify.com/playlist/', '');
                inputUri = inputUri.slice(0,22);
                this.setState({uri:inputUri});
                }}/>
            <View style={styles.grayBar}/>
          </LinearGradient>
          <View style={{alignSelf:'center', width:'40%', minWidth: 300,}}>
            <Text style={styles.clickText}>CLICK THE PLAY BUTTON TO ANALYZE</Text>
            <Image source = {{uri:trackbar}} style={{alignSelf: 'flex-start', width:'100%', paddingVertical:'3vh', resizeMode:'contain'}}/>
            <View style={{flexDirection:'row', justifyContent:'space-evenly', paddingVertical:'2vh'}}>
              <Image source = {{uri:skipIcon}} style={{alignSelf:'center', width:'20vw', paddingVertical:'5vh', resizeMode:'contain', tintColor:'white', transform:[{rotate:'180deg'}]}}/>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('Playlist Analysis', {playlistUri:this.state.uri})} style={{height:'12vh', width:'12vh', borderRadius:500, shadowColor:'white', shadowRadius:20, backgroundColor:'white'}}>
                <Image source = {{uri:playButton}} style={{alignSelf:'center', width:'12vh', height:'12vh', resizeMode:'cover', borderRadius:500, shadowColor:'white', shadowRadius:20, backgroundColor:'white'}}/>
              </TouchableOpacity>
              <Image source = {{uri:skipIcon}} style={{alignSelf:'center', width:'20vw', paddingVertical:'5vh', resizeMode:'contain', tintColor:'white'}}/>
            </View>
          </View>
          <BrowserView>
            <View style={styles.headerOptions}>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'data'})}}><Text style = {styles.headerOptionsText}>audio data</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'features'})}}><Text style = {styles.headerOptionsText}>audio features</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'analysis'})}}><Text style = {styles.headerOptionsText}>audio analysis</Text></TouchableOpacity>
            </View>
          </BrowserView>
          <MobileView>
            <View style={styles.headerOptionsMobile}>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'data'})}}><Text style = {styles.headerOptionsText}>audio data</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'features'})}}><Text style = {styles.headerOptionsText}>audio features</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.setState({infoType:'analysis'})}}><Text style = {styles.headerOptionsText}>audio analysis</Text></TouchableOpacity>
            </View>
          </MobileView>
          <View style={{flexDirection:'row', justifyContent:'space-evenly', paddingBottom:'3%',paddingTop:'1vh'}}>
            {this.renderInfo()}
          </View>
        </LinearGradient>
    </LinearGradient>
  )}
}

const styles = StyleSheet.create({
  rightFeaturesSingleContainer:{
    flexDirection:'row',
    marginVertical:'3vh',
  },
  rightFeaturesText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    letterSpacing:1,
    paddingHorizontal:'2%'
  },
  infoHeaderText:{
    textAlign:'center',
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:30,
    fontWeight:'600',
    letterSpacing:1,
    borderColor:'white',
    borderBottomWidth:1,
    // borderTopWidth:1,
    marginTop:'1vh',
    // paddingHorizontal:'2vw'
  },
  rightDataText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    padding:'1%',
    width:'10vw',
    minWidth:100,
    alignSelf:'center',
    letterSpacing:1
  },
  rightData:{
    justifyContent:'center',
    flexDirection:'row',
    // marginTop:'-2%',
  },
  featureContainer:{
    flexDirection:'column',
    justifyContent:'space-between',
    width:'80%',
    minHeight:'60vh',
  },
  dataContainer:{
    flexDirection:'column',
    justifyContent:'space-between',
    // paddingBottom:'1%',
    width:'80%',
    minHeight:'60vh',
  },
  analysisContainer:{
    flexDirection:'column',
    justifyContent:'space-between',
    width:'80%',
    minHeight:'60vh',
  },
  rightAnalysisText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize:22,
    borderRadius:50,
    // paddingLeft:'1%',
    // padding:'1%',
    // width:'57%',
    flex:1,
    flexDirection:'row',
    alignSelf:'center',
  },
  analysisText:{
    fontFamily:'Segoe UI',  // Gotten from Index
    color:'white',
    fontSize: 25,
    // marginTop:'2%',
    fontWeight:'700',
    letterSpacing:1,
    // paddingLeft: '2%',
    flex:1,
  },
  sortText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize: 22,
    marginVertical:'2%',
  },
  clickText:{
    fontFamily:'Segoe UI',
    color:'white',
    fontSize: (isMobile? 20:25),
    marginVertical:'2%',
    fontWeight:'500',
    // alignSelf:'center',
  },
  grayBar:{
    backgroundColor:'#353535',
    height:'10%',
    width:'80%',
    marginHorizontal:'10%',
    borderRadius:50,
    zIndex:1,
    marginLeft:'-2%',
  },
  inputUri:{
    backgroundColor:'#353535',
    borderRadius:50,
    textAlign:'center',
    textAlignVertical:'center',
    height:'15%',
    marginHorizontal:'3%',
    borderColor:'white',
    borderWidth:3,
    // shadowColor:'black',
    // shadowRadius:10,
    // shadowOffset:{width: 5,height:6}
  },
  playlist:{
    flexDirection:'column',
    // width:'36vw',
    width:'80vw',
    minWidth: 370,
    // minHeight:500,
    // height:'93vh',
    marginTop:'2vh',
    padding:'2%',
    paddingBottom:'1%',
    // marginLeft:'32vw',
    alignSelf:'center',
    position:'relative',
  },
  backgroundImage:{
    // resizeMode:'stretch',
    height:'26vw',
    width:'26vw',
    minHeight:270,
    minWidth:270,
    alignSelf:'center',
    justifyContent: 'space-evenly',
    borderRadius:500,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    width:'90%',
    marginTop:'1%',
    flex:1,
    alignSelf:'center',
    // zIndex:10,
    // position:'absolute'
  },
  headerLinks:{
    flexDirection:'row',
    flex:1,
    // width:'36%',
  },
  headerLinkText:{
    fontFamily:'Segoe UI',
    color:'#A4A4A4',
    textShadowColor:'white',
    textShadowRadius:1,
    fontSize: 15,
    letterSpacing:1,
    // marginLeft:'%',
    // flex:1
  },
  linkImage:{
    height:35,
    width:35,
    resizeMode:'cover',
    accessible:false,
    alignSelf:'center',
    borderRadius:500,
  },
  headerOptions:{
    flexDirection:'row',
    flex:1,
    justifyContent:'space-evenly',
    width:'100%',
    // marginLeft:'2vh',
    marginVertical:'2vh',
    paddingVertical:'2vh',
    borderColor:'white',
    borderWidth:1,
    alignSelf:'center',
  },
  headerOptionsMobile:{
    flexDirection:'column',
    flex:1,
    justifyContent:'space-evenly',
    textAlign:'center',
    width:'100%',
    alignSelf:'center',
    // marginLeft:'2vh',
    marginVertical:'2vh',
    paddingVertical:'2vh',
    borderColor:'white',
    borderWidth:1,
  },
  headerOptionsText:{
    fontFamily:'Segoe UI',
    color:'white',
    textShadowColor:'white',
    textShadowRadius:14,
    fontSize: 20,
    letterSpacing:1,
  },
})

export default Home;