import React, {Component} from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, ImageBackground} from 'react-native';
import {PieChart} from 'react-minimal-pie-chart';
import { GetTrackAnalysis} from '../requests/Index';
import { isMacOs, isMobile } from "react-device-detect";
import {Hoverable} from 'react-native-web-hover';

interface Props{
  navigation:any,
  route: any
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
    };
  }

  componentDidMount() {
    this.renderValues();
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
      })
    }catch (err) {
      console.log(err);
    }
  }

  render() {return (
    <ImageBackground source = {{uri:this.state.artwork}} style = {styles.backgroundimage} blurRadius= {200}>
        <Hoverable>
          {({hovered})=>(<TouchableOpacity style={{ backgroundColor: '#1DB954', justifyContent:'center', borderRadius: 100, width: 150, height:'4vh', alignSelf: 'flex-end', marginRight: '2%', marginBottom: '-1%', marginTop: 80, shadowColor:'black', shadowRadius:6, shadowOffset:{width:2,height:1},zIndex:1, opacity: (hovered? .6:1)}} onPress={()=>{window.open(this.state.externalUrl,'_blank')}}>
            <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
          </TouchableOpacity>)}
        </Hoverable>
        <View style={{justifyContent: 'center'}}>
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
                <Text style={styles.statTextLeft}>{this.state.key}</Text>
                <Text style={styles.statDescText}>KEY</Text>
              </View>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextRight}>{this.state.bars}</Text>
                <Text style={styles.statDescTextRight}>BARS</Text>
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.featureContainer}>
                <Text style={styles.statTextLeft}>{this.state.mode}</Text>
                <Text style={styles.statDescText}>MODALITY</Text>
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
        <View style={styles.songInfoContainer}>
          <Text style={styles.songTitle}>{this.state.name}</Text>
          <Text style={styles.songArtist}>{this.state.artists}</Text>
          <Text style={styles.songTypeYear}>{this.state.album}</Text>
        </View>
    </ImageBackground>
  );}
}

const styles = StyleSheet.create({
  songTitle:{
    color: 'white',
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:3,
    textShadowOffset: {width:2,height:1},
    letterSpacing:1,
    fontSize: 25,
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
    fontSize: 20,
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
    alignSelf: 'center',
    // marginBottom: '2%',
    paddingBottom:'1vh',
    paddingTop:(isMobile? 220:'0%'),
    marginTop:'1%',
    justifyContent:'space-between',
    height: '15%',
    paddingHorizontal:(isMobile? '1%':'0%')
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
  backgroundimage: {
    resizeMode: 'cover',
    minHeight: '100vh',
    marginTop:-65,
    overflow:(isMobile?'scroll':'hidden'),
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