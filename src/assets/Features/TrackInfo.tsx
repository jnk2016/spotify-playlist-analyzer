import { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';
import {Hoverable} from 'react-native-web-hover';
import { isMacOs, isMobile } from "react-device-detect";

interface Props{
  navigation:any,
  token: any,
  song: any,
  songs: [],
  push: boolean,
}

export default class TrackInfo extends PureComponent<Props, any> {
  static defaultProps = {
    token: "",
    song: {
      id: "",
      artwork: "",
      name: "",
      artists: [],
      album: "",
      duration: "",
      key: "",
      timeSig: 0,
      bpm: 0,
      popularity: 0,
      mode: "",
      keyWheelNum: "",

      valence: 0,
      liveness: 0,
      speechiness: 0,
      instrumentalness: 0,
      energy: 0,
      danceability: 0,
      acousticness: 0,
      externalUrl: "",
    },
    songs: [],
    push: false,
  }

  render() {
    const {
      token,
      song,
      songs,
      push,
    } = this.props;

    return(
      <Hoverable>
      {({hovered})=>(<TouchableOpacity style={{  width:'95%',  overflow:'hidden', opacity: (hovered?.5:1), height: (isMobile? 60:110),  padding:10,  borderBottomWidth:1,  borderBottomColor:'white',  flexDirection:'row',  alignSelf:'center',  justifyContent:'space-between'}} onPress={()=>{
          push ? 
          this.props.navigation.push('Song Analysis', {
            token: this.props.token,
            songID:this.props.song.id,
            artwork: this.props.song.artwork,
            name: this.props.song.name,
            artists: this.props.song.artists,
            album: this.props.song.album,
            duration: this.props.song.duration,
            key: this.props.song.key,
            timeSig: this.props.song.timeSig,
            bpm: this.props.song.bpm,
            popularity: this.props.song.popularity,
            mode: this.props.song.mode,
            keyWheelNum: this.props.song.keyWheelNum,
            // in depth audio features
            valence: this.props.song.valence,
            liveness: this.props.song.liveness,
            speechiness: this.props.song.speechiness,
            instrumentalness: this.props.song.instrumentalness,
            energy: this.props.song.energy,
            danceability: this.props.song.danceability,
            acousticness: this.props.song.acousticness,
            externalUrl: this.props.song.externalUrl,

            songs: this.props.songs,
          }) :
          this.props.navigation.navigate('Song Analysis', {
            token: this.props.token,
            songID:this.props.song.id,
            artwork: this.props.song.artwork,
            name: this.props.song.name,
            artists: this.props.song.artists,
            album: this.props.song.album,
            duration: this.props.song.duration,
            key: this.props.song.key,
            timeSig: this.props.song.timeSig,
            bpm: this.props.song.bpm,
            popularity: this.props.song.popularity,
            mode: this.props.song.mode,
            keyWheelNum: this.props.song.keyWheelNum,
            // in depth audio features
            valence: this.props.song.valence,
            liveness: this.props.song.liveness,
            speechiness: this.props.song.speechiness,
            instrumentalness: this.props.song.instrumentalness,
            energy: this.props.song.energy,
            danceability: this.props.song.danceability,
            acousticness: this.props.song.acousticness,
            externalUrl: this.props.song.externalUrl,

            songs: this.props.songs,
          });
        }}>
        <View style={styles.songLeft}>
        <Image source={{uri: this.props.song.artwork}} style={styles.albumArtwork}/>
          <Text style={styles.songTextTrack}>{this.props.song.name}</Text>
        </View>
        <View style={styles.songMiddle}>
          <Text style={styles.songTextArtist}>{this.props.song.artists}</Text>
          <Text style={styles.songTextAlbum}>{this.props.song.album}</Text>
        </View>
        <View style={styles.songRight}>
            <Text style={styles.songText}>{this.props.song.duration}</Text>
            {/* <Text style={styles.songText}>{this.props.song.key}{(this.props.song.mode == "Minor" ? "m" : "")}</Text> */}
            <Text style={styles.songText}>{this.props.song.keyWheelNum}</Text>
            <Text style={styles.songText}>{Math.round(this.props.song.energy * 10)}</Text>
            <Text style={styles.songText}>{this.props.song.bpm}</Text>
            <Text style={styles.songText}>{this.props.song.timeSig}</Text>
        </View>
      </TouchableOpacity>)}
      </Hoverable>
    )
  }
}

const styles = StyleSheet.create({
  songLeft: {
    width: '26%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  songMiddle: {
    width: '35%',
    flexDirection:'row',
    textAlign:'left',
  },
  songRight: {
    width: '36%',
    flexDirection:'row',
    textAlign:'left',
  },
  albumArtwork: {
    width:'25%',
    height:'100%',
    resizeMode: 'contain',
  },
  songTextArtist: {
    color:'white',
    fontSize:(isMobile? 9:16),
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
    paddingRight: '2%',
  },
  songTextAlbum: {
    color:'white',
    fontSize:(isMobile? 9:16),
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
  },
  songText: {
    color:'white',
    fontSize:(isMobile? 9:16),
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
  },
  songTextTrack: {
    color:'white',
    fontSize:(isMobile? 9:16),
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
    width: '80%',
    paddingHorizontal: '2%',
  },
})