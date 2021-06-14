import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, ImageBackground, FlatList, ScrollView } from 'react-native';
import {PieChart} from 'react-minimal-pie-chart';
import { GetTrackAnalysis} from '../requests/Index';
import { isMacOs, isMobile } from "react-device-detect";
import {Hoverable} from 'react-native-web-hover';
import TrackInfo from '../assets/Features/TrackInfo';
import LinearGradient from '../assets/Features/LinearGradient';
import {rgba} from 'polished';

interface Props{
  navigation:any,
  route: any
}

function determineSimilarKeys(keyWheelNum: string) {
  var keys: string[] = [];

  var num = parseInt(keyWheelNum);
  var numAbove = (num === 12 ? 1 : num+1);
  var numBelow = (num === 1 ? 12 : num-1);

  var letter = keyWheelNum.substring(keyWheelNum.length-1, keyWheelNum.length);
  var oppLetter = (letter === "A" ? "B" : "A");

  var minor = (letter === "A" ? true : false);

  // Energy Boost Rule:                   +1 (same letter)
  keys.push(`${numAbove}${letter}`);

  // Lower Energy/Go Deeper Rule:         -1 (same letter)
  keys.push(`${numBelow}${letter}`);

  // Relative Major - minor Switch Rule:  change letter (same number)
  keys.push(`${num}${oppLetter}`);
  
  // Sub Dominant Key Rule:               change letter (minor: -1 | major: +1)
  keys.push(`${(minor ? numBelow : numAbove)}${oppLetter}`);

  return keys;
}

class Song extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      token: this.props.route.params.token,
      /* Basic Song Info */
      id: this.props.route.params.songID,
      artwork: this.props.route.params.artwork,
      name: this.props.route.params.name,
      artists: this.props.route.params.artists,
      album: this.props.route.params.album,
      /* Slightly More Detail */
      duration: this.props.route.params.duration,
      popularity: this.props.route.params.popularity,
      key: this.props.route.params.key,
      bars: '', // Not included in route params
      mode: this.props.route.params.mode,
      keyWheelNum: this.props.route.params.keyWheelNum,
      beats: '',  // Not included in route params
      timeSig: this.props.route.params.timeSig,
      sections: '', // Not included in route params
      bpm: this.props.route.params.bpm,
      segments: '', // Not included in route params
      /* In Depth Detail */
      valence: this.props.route.params.valence,
      liveness: this.props.route.params.liveness,
      speechiness: this.props.route.params.speechiness,
      instrumentalness: this.props.route.params.instrumentalness,
      energy: this.props.route.params.energy,
      danceability: this.props.route.params.danceability,
      acousticness: this.props.route.params.acousticness,
      externalUrl: this.props.route.params.externalUrl,

      /* Similar Tracks (via Mixing in key using Camelot Wheel) */
      songsInPlaylist: this.props.route.params.songs,
      similarTracks: [],
    };
  }

  componentDidMount() {
    this.renderValues();
    this.props.navigation.addListener('blur', () => {
      window.removeEventListener('scroll', this.handleOnScroll, false);
    });
    this.props.navigation.addListener('focus', () => {
      window.addEventListener('scroll', this.handleOnScroll, false);
      window.scrollTo(0, this.state.scrollPosition)
    });
  }

  renderValues = async() =>{
    this.setState({
      token: this.props.route.params.token,
      id: this.props.route.params.songID,
    });
    try{
      let trackAnalysis = await GetTrackAnalysis(this.state.id, this.state.token);
      this.setState({
        bars: trackAnalysis.bars.length,
        beats: trackAnalysis.beats.length,
        sections: trackAnalysis.sections.length,
        segments: trackAnalysis.segments.length,
      });
      await this.getSimilarTracks();

    }catch (err) {
      console.log(err);
    };
  }

  getSimilarTracks = async() => {
    const similarKeys = determineSimilarKeys(this.state.keyWheelNum);
    let similarTrackDetails = this.state.songsInPlaylist.filter((track: any)=> similarKeys.includes(track.keyWheelNum));

    similarTrackDetails = similarTrackDetails.sort((a:any,b:any) => (a.bpm > b.bpm) ? 1 : -1)
    similarTrackDetails = similarTrackDetails.sort((a:any,b:any) => (a.keyWheelNum > b.keyWheelNum) ? 1 : -1)

    this.setState({
      similarTracks: await similarTrackDetails
    });
  }

  handleOnScroll = () => {
    this.setState({scrollPosition:window.pageYOffset});
  }

  render() {
    return (
    <ScrollView style = {{ flex:1 }}>
      <ImageBackground source = {{uri:this.state.artwork}} blurRadius= {200}>
        <View style = {{flex:1, flexDirection:'row', marginLeft:(isMobile? 0:'35vw'),}}>
          <View style={styles.songInfoContainer}>
            <Text style={styles.songTitle}>{this.state.name}</Text>
            <Text style={styles.songArtist}>{this.state.artists}</Text>
            <Text style={styles.songTypeYear}>{this.state.album}</Text>
          </View>
          <Hoverable>
            {({hovered})=>(<TouchableOpacity 
            style={{ 
              backgroundColor: '#1DB954', 
              justifyContent:'center', 
              borderRadius: 100, 
              width: 150, 
              height:'4vh', 
              alignSelf: 'flex-end', 
              marginRight: '1vw',
              marginTop: '1vh', 
              shadowColor:'black', 
              shadowRadius:6, 
              shadowOffset:{width:2,height:1}, 
              opacity: (hovered? .6:1)}
            } 
            onPress={()=>{window.open(this.state.externalUrl,'_blank')}}>
              <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
            </TouchableOpacity>)}
          </Hoverable>
        </View>
        <View style={{justifyContent: 'center', marginVertical:'1%', paddingBottom: (isMobile? 230 : 0)}}>
          <View style={{shadowColor:'black',shadowRadius:70,  height: (isMobile? 341:500), width: (isMobile? 341:500), alignSelf: 'center', borderRadius: 500, zIndex:3,}}>
            <Image source={{uri: this.state.artwork}} style={{resizeMode:'contain', height: (isMobile? 341:500), width: (isMobile? 341:500), alignSelf: 'center', borderRadius: 500, zIndex:3,}} blurRadius={20}/>
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 341:400), width: (isMobile? 341:400)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'energy', value: Math.round(this.state.energy*100), color: '#D630FF' },
                  { title: 'energy', value: 100-Math.round(this.state.energy*100), color: '#EEAAFF' },
              ]} lineWidth={isMobile? 16:15} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 287:341), width: (isMobile? 287:341)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'valence', value: Math.round(this.state.valence*100), color: '#3E3BD6' },
                  { title: 'valence', value: 100-Math.round(this.state.valence*100), color: '#8E8CD4' },
              ]} lineWidth={isMobile? 18:16} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 236:287), width: (isMobile? 236:287)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'danceability', value: Math.round(this.state.danceability*100), color: '#4D6BF8' },
                  { title: 'danceability', value: 100-Math.round(this.state.danceability*100), color: '#A5AEFF' },
              ]} lineWidth={isMobile? 21:18} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 186:236), width: (isMobile? 186:236)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'acousticness', value: Math.round(this.state.acousticness*100), color: '#5BCC96' },
                  { title: 'acousticness', value: 100-Math.round(this.state.acousticness*100), color: '#96EAC2' },
              ]} lineWidth={isMobile? 27:21} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 137:186), width: (isMobile? 137:186)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'instrumentalness', value: Math.round(this.state.instrumentalness*100), color: '#FFE70F' },
                  { title: 'instrumentalness', value: 100-Math.round(this.state.instrumentalness*100), color: '#FFF7B1' },
              ]} lineWidth={isMobile? 34:27} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 91:137), width: (isMobile? 91:137)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'liveness', value: Math.round(this.state.liveness*100), color: '#FF7A00' },
                  { title: 'liveness', value: 100-Math.round(this.state.liveness*100), color: '#FFC48D' },
              ]} lineWidth={isMobile? 41:34} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .5,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: (isMobile? 53:91), width: (isMobile? 53:91)}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'speechiness', value: Math.round(this.state.speechiness*100), color: '#FF0000' },
                  { title: 'speechiness', value: 100-Math.round(this.state.speechiness*100), color: '#FF9696' },
              ]} lineWidth={isMobile? 52:41} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 341:400), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>energy</Text>
            <Text style={styles.graphValues}>{this.state.energy}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 287:341), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>valence</Text>
            <Text style={styles.graphValues}>{this.state.valence}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 236:287), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>danceability</Text>
            <Text style={styles.graphValues}>{this.state.danceability}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 186:236), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>acousticness</Text>
            <Text style={styles.graphValues}>{this.state.acousticness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 137:186), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>instrumentalness</Text>
            <Text style={styles.graphValues}>{this.state.instrumentalness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 91:137), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>liveness</Text>
            <Text style={styles.graphValues}>{this.state.speechiness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: (isMobile? 53:91), justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>speechiness</Text>
            <Text style={styles.graphValues}>{this.state.liveness}</Text>
          </View>
          <View style={{zIndex:0,position: 'absolute', alignSelf: 'center', width: '100%', marginTop:(isMobile? 580:'0%')}}>
            <View style={{zIndex:-1,position: 'absolute', alignSelf: 'center',  width: '98%', height:'100%', backgroundColor:'black', opacity:.1, borderColor:'white',borderWidth:1}}/>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.duration}</Text>
                <Text style={styles.statDescText}>DURATION</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.popularity}%</Text>
                <Text style={styles.statDescTextRight}>POPULARITY</Text>
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.keyWheelNum}</Text>
                <Text style={styles.statDescText}>KEY</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.bars}</Text>
                <Text style={styles.statDescTextRight}>BARS</Text>
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.key} {this.state.mode}</Text>
                <Text style={styles.statDescText}>PITCH {'&'} MOD.</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.beats}</Text>
                <Text style={styles.statDescTextRight}>BEATS</Text>
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.timeSig}</Text>
                <Text style={styles.statDescText}>TIME SIGNATURE</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.sections}</Text>
                <Text style={styles.statDescTextRight}>SECTIONS</Text>
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.bpm}</Text>
                <Text style={styles.statDescText}>TEMPO (BPM)</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.segments}</Text>
                <Text style={styles.statDescTextRight}>SEGMENTS</Text>
              </View>
            </View>
          </View>
        </View>
      
      <LinearGradient colors={[rgba('#353535', 0), rgba('#353535', 0.2), rgba('#353535', 0.4), rgba('#353535', 0.7), rgba('#353535', 0.9), '#353535']} style={{height:150}}>
        <Text style={styles.similarTracksText}>Tracks In Similar Keys:</Text>
        </LinearGradient>
      </ImageBackground>
      <LinearGradient  colors = {['#353535', '#494949','#252525']} style={{flex:1, paddingVertical: '2%'}}>
        <View style={styles.headBar}>
          <View style={styles.leftBar}>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>TRACK</Text>
          </View>
          <View style={styles.middleBar}>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>ARTIST</Text>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>ALBUM</Text>
          </View>
          <View style={styles.rightBar}>
            <Text style={styles.barText}>DUR.</Text>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>KEY</Text>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>ENERGY</Text>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>BPM</Text>
              <Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1 }}>TIME SIG.</Text>
          </View>
        </View>
        <FlatList
          data={this.state.similarTracks}
          renderItem={({item}) => 
            <TrackInfo navigation={this.props.navigation} token={this.state.token} song={item} songs={this.state.songsInPlaylist} push={true}/>
          }
          keyExtractor={(song:any) => song.id}
          scrollEnabled={false}
        />
      </LinearGradient>
    </ScrollView>
  );}
}

const styles = StyleSheet.create({
  headBar: {
    borderWidth:1,
    borderColor:'white',
    width:'95%',
    height:'auto',
    padding:10,
    flexDirection:'row',
    alignSelf:'center',
    justifyContent:'space-between',
    shadowColor:'white',
    shadowRadius:4,
  },
  leftBar: {
    width:'26%',
    paddingLeft: '7%',
  },
  middleBar: {
    width:'35%',
    flexDirection:'row',
  },
  rightBar: {
    width:'36%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  barText: {
    color:'white',
    fontSize:(isMobile? 9:18),
    fontWeight: '700',
    textShadowColor:'white',
    textShadowRadius:1,
    flex:1,
  },
  similarTracksText:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 18: 25),
    fontWeight: '700',
    textAlign: 'left',
    padding: 10,
    marginLeft:'2%',
    marginTop:'3%'
  },
  songTitle:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 18:25),
    fontWeight: '700',
    textAlign: 'left',
  },
  songArtist:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 15:20),
    fontWeight: '500',
    textAlign: 'left',
  },
  songTypeYear:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: 15,
    textAlign: 'left',
  },
  songInfoContainer:{
    alignSelf: (isMobile ? 'center' : 'flex-start'),
    width:(isMobile ? '100%':'80%'),
    height:(isMobile? 80:110),
    marginVertical:'1%',
    justifyContent:'space-between',
    flex:1,
  },
  statTextLeft:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 14:20),
    fontWeight: '700',
  },
  statTextRight:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 14:20),
    fontWeight: '700',
    textAlign: 'right',
  },
  statDescText:{
    color: 'white',
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 14:15),
  },
  statDescTextRight:{
    color: 'white',
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: (isMobile? 14:15),
    textAlign: 'right',
  },
  graphValues:{
    color: 'white',
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: 12,
    textAlign: 'left'
  },
  line:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginVertical: (isMobile? 0:10),
    marginHorizontal: '2%',
  },
  featureContainer:{

  },
  circleImage:{
    height: 500,
    width: 500,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 500,
    zIndex: 2,
  },
  valence:{
    zIndex: 4,
  },
  spotifyButton:{
    backgroundColor: '#1DB954',
    justifyContent:'center',
    borderRadius: 100,
    width: 150,
    height:'4vh',
    alignSelf: 'flex-end',
    marginRight: '2%',
    marginBottom: '-1%',
    marginTop: 80,
    textAlign: 'center',
    textAlignVertical:'center',
    shadowColor:'black',
    shadowRadius:6,
    shadowOffset:{width:2,height:1},
    zIndex:1,
  },
  buttonText:{
    color:'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    letterSpacing:1,
    textAlign: 'center',
    textAlignVertical:'center',
  },
})

export default Song;