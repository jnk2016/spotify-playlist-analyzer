import React, {Component, useState} from 'react';
import {Button, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text, View, Alert, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios';
import {PieChart} from 'react-minimal-pie-chart';
import in_your_head from '../assets/images/in_your_head.jpeg';
import AxiosGetTrackAnalysis from '../requests/AxiosGetTrackAnalysis';

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
      liveliness: this.props.route.params.liveliness,
      speechiness: this.props.route.params.speechiness,
      instrumentalness: this.props.route.params.instrumentalness,
      energy: this.props.route.params.energy,
      danceability: this.props.route.params.danceability,
      acousticness: this.props.route.params.acousticness,
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
      let trackAnalysis = await AxiosGetTrackAnalysis.GetTrackAnalysis(this.state.id, this.state.token);
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
      {/* <ScrollView> */}
        <TouchableOpacity style={styles.spotifyButton}>
          <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
        </TouchableOpacity>
        <View style={{justifyContent: 'center'}}>
          {/* <View style={styles.circleImage}> */}
          <Image source={{uri: this.state.artwork}} style={{ height: 500, width: 500, resizeMode: 'contain', alignSelf: 'center', borderRadius: 500, zIndex: 2,}} blurRadius={20}/>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 400, width: 400}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.energy*100), color: '#D630FF' },
                  { title: 'Two', value: 100-Math.round(this.state.energy*100), color: '#EEAAFF' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={15} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 341, width: 341}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.valence*100), color: '#3E3BD6' },
                  { title: 'Two', value: 100-Math.round(this.state.valence*100), color: '#8E8CD4' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={16} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 287, width: 287}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.danceability*100), color: '#7280FF' },
                  { title: 'Two', value: 100-Math.round(this.state.danceability*100), color: '#A5AEFF' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={18} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 236, width: 236}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.acousticness*100), color: '#5BCC96' },
                  { title: 'Two', value: 100-Math.round(this.state.acousticness*100), color: '#96EAC2' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={21} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 186, width: 186}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.instrumentalness*100), color: '#FFE70F' },
                  { title: 'Two', value: 100-Math.round(this.state.instrumentalness*100), color: '#FFF7B1' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={27} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 137, width: 137}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.speechiness*100), color: '#FF7A00' },
                  { title: 'Two', value: 100-Math.round(this.state.speechiness*100), color: '#FFC48D' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={34} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:4, opacity: .4,position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', height: 91, width: 91}}>
            <PieChart style={{alignSelf: 'center', justifySelf: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', verticalAlign: 'center'}}
              data={[
                  { title: 'One', value: Math.round(this.state.liveliness*100), color: '#FF0000' },
                  { title: 'Two', value: 100-Math.round(this.state.liveliness*100), color: '#FF9696' },
                  // { title: 'Two', value: 85, color: '#FFF9C3' },
              ]} lineWidth={41} viewBoxSize={[100,100]} totalValue={200} startAngle={90}
            />
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 400, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>energy</Text>
            <Text style={styles.graphValues}>{this.state.energy}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 341, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>valence</Text>
            <Text style={styles.graphValues}>{this.state.valence}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 287, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>danceability</Text>
            <Text style={styles.graphValues}>{this.state.danceability}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 236, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>acousticness</Text>
            <Text style={styles.graphValues}>{this.state.acousticness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 186, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>instrumentalness</Text>
            <Text style={styles.graphValues}>{this.state.instrumentalness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 137, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>speechiness</Text>
            <Text style={styles.graphValues}>{this.state.speechiness}</Text>
          </View>
          <View style={{zIndex:5,position: 'absolute', alignSelf: 'auto', height: 91, justifyContent: 'space-between', marginLeft: '51%'}}>
            <Text style={styles.graphValues}>liveliness</Text>
            <Text style={styles.graphValues}>{this.state.liveliness}</Text>
          </View>
          <View style={{zIndex:0,position: 'absolute', alignSelf: 'center',  width: '100%'}}>
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
      {/* </ScrollView> */}
    </ImageBackground>
  );}
}

const styles = StyleSheet.create({
  songTitle:{
    color: 'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'left',
    // marginVertical: '2%',
  },
  songArtist:{
    color: 'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    // marginVertical: '2%',
  },
  songTypeYear:{
    color: 'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 15,
    textAlign: 'left',
    // marginVertical: '2%',
  },
  songInfoContainer:{
    // width: '60%',
    alignSelf: 'center',
    marginBottom: '2%',
    marginTop:'1%',
    justifyContent:'space-between',
    height: '15%',
    // paddingBottom:'10%'
  },
  statTextLeft:{
    color: 'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 20,
    fontWeight: '700',
  },
  statTextRight:{
    color: 'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
  statDescText:{
    color: 'white',
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 15,
  },
  statDescTextRight:{
    color: 'white',
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 15,
    textAlign: 'right',
  },
  graphValues:{
    color: 'white',
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    fontSize: 12,
    textAlign: 'left'
  },
  line:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginVertical: 10,
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
    // flex: 1,
    resizeMode: 'cover',
    // justifyContent: "center",
    // alignItems: 'center',
    // alignText: 'center',
    // alignContent: 'center',
    minHeight: '91vh',
    // height: imageHeight-45,
  },
  spotifyButton:{
    backgroundColor: '#5BCC96',
    // justifyContent: 'center',
    paddingVertical: 10,
    // paddingHorizontal: '5%',
    borderRadius: 100,
    // marginTop: '10%',
    // alignSelf:'center',
    // alignContent: 'center',
    width: 150,
    alignSelf: 'flex-end',
    marginTop: '2%',
    marginRight: '2%',
    marginBottom: '-3%',
  },
  buttonText:{
    color:'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    letterSpacing:1,
    textAlign: 'center',
    // alignSelf: 'center'
  },
})

export default Song;