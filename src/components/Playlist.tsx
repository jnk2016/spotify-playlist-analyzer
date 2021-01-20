import React, {Component, useState} from 'react';
import {Button, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text, View, Alert, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios';
import AxiosGetPlaylist from '../requests/AxiosGetPlaylist';
import AxiosGetToken from '../requests/AxiosGetToken';

interface Props{
  navigation:any,
  route: any,
}

//DP: 1HhAiDpmQdi5ryyFjzjlyD, JK(Test): 4y7pEAyFZCDl2fW8SHrEKJ  7am: 0fCpH2h614ebCnRW4Wmy9L yumi:1cum7ExwRDhcWJi8BoNxWC
// const playlistUriCode = '1cum7ExwRDhcWJi8BoNxWC';

function determineKey(key: any){
  if(key == 0)      {return 'C'}
  else if(key == 1) {return 'C♯ / D♭'}
  else if(key == 2) {return 'D'}
  else if(key == 3) {return 'D♯ / E♭'}
  else if(key == 4) {return 'E'}
  else if(key == 5) {return 'F'}
  else if(key == 6) {return 'F♯ / G♭'}
  else if(key == 7) {return 'G'}
  else if(key == 8) {return 'G♯ / A♭'}
  else if(key == 9) {return 'A'}
  else if(key == 10){return 'A♯ / B♭'}
  else if(key == 11){return 'B'}
}

class PlaylistItems extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      BasicInfo: [],
      Name: '',
      ImageUrl: '',
      Owner: '',
      Descrip: '',
      TrackAmount: '',
      TrackDetails: [],
      AuthToken: '',
      selectedValue:'date added',
      keyPickerVal:'',
      showFilterSpecs: 'initial',
      min:0,
      max:200,
      playlistUri:this.props.route.params.playlistUri,
      // New state stuff
      trackIds:[],
      trackIdStr:'',
      TrackSimple:[],
      TrackFeatures:[],
    };
  }

  componentDidMount() {
    this.renderValues();
  }

  renderValues = async() =>{
    try{
      /* Getting the access token  */
      let token = await AxiosGetToken.GetToken();
      this.setState({
        AuthToken: token.access_token
      })
      /* Get all the tracks from the playlist */
      let playlist = await axios({
      method: 'get',
      url:`https://api.spotify.com/v1/playlists/${this.state.playlistUri}`,
      headers: {
        Authorization: `Bearer ${this.state.AuthToken}`
      },
      })
      .then(response=>{
          console.log(response.data);
          
          return response.data;
      })
      .catch(err =>{
          console.log(err, err.response);
          return err.response;
      });
      // New Stuff
      this.setState({
        trackIds: playlist.tracks.items.map((track:any)=>{
          return(track.track.id);
        }),
        TrackSimple: playlist.tracks.items.map((track:any)=>{
          let minutes = Math.floor(track.track.duration_ms/60000);
          let seconds = Math.round((track.track.duration_ms - (60000*minutes))/1000);
          let dur = `${minutes}:${seconds}`;
          if(seconds<10){dur = `${minutes}:0${seconds}`;}
          return({
            artwork: track.track.album.images[1].url,
            name: track.track.name,
            artists: track.track.artists[0].name,
            album: track.track.album.name,
            duration: dur,
            id: track.track.id,
            popularity: track.track.popularity,
          });
        })
      })
      this.setState({
        trackIdStr: this.state.trackIds.join(',')
      })
      // console.log(this.state.trackIds);
      
      let features = await axios({
        method: 'get',
        url:`https://api.spotify.com/v1/audio-features`,
        headers: {
          Authorization: `Bearer ${this.state.AuthToken}`
        },
        params:{
          ids:`${this.state.trackIdStr}`
        }
        })
        .then(response=>{
            console.log(response.data);
            return response.data;
        })
        .catch(err =>{
            console.log(err, err.response);
            return err.response;
        });
      /* features.audio_features */
      this.setState({
        TrackFeatures: features.audio_features.map((songFeatures:any)=>{
          let keyString = determineKey(songFeatures.key);
          let modality = 'Major';
          if(songFeatures.mode == 0){modality = 'Minor';}
          return({
            id: songFeatures.id,
            bpm: Math.round(songFeatures.tempo),
            keyNum: songFeatures.key,
            key: keyString,
            energy: songFeatures.energy,
            timeSig: songFeatures.time_signature,
            mode: modality,
            // even more features
            valence: songFeatures.valence,
            liveliness: songFeatures.liveliness,
            speechiness: songFeatures.speechiness,
            instrumentalness: songFeatures.instrumentalness,
            danceability: songFeatures.danceability,
            acousticness: songFeatures.acousticness,
          });
        })
      })
      // console.log(this.state.TrackFeatures)
      /* combining features with simple */
      let merged = [];
      for(let i=0; i< this.state.TrackSimple.length; i++){
        merged.push({
          ...this.state.TrackSimple[i],
          ...(this.state.TrackFeatures.find((itmInner:any)=>itmInner.id === this.state.TrackSimple[i].id))
        })
      }
      this.setState({
        TrackDetails:merged
      })

      this.setState({
        Name: playlist.name,
        ImageUrl: playlist.images[0].url,
        Owner: playlist.owner.display_name,
        Descrip: playlist.description,
        TrackAmount: playlist.tracks.total,

        BasicInfo: this.state.TrackDetails.map((song:any, i:any) => {
          return(
          <TouchableOpacity style={styles.songList} onPress={()=>{
              this.props.navigation.navigate('Song', {
                token: this.state.AuthToken,
                songID:song.id,
                artwork: song.artwork,
                name: song.name,
                artists: song.artists,
                album: song.album,
                duration: song.duration,
                key: song.key,
                timeSig: song.timeSig,
                bpm: song.bpm,
                popularity: song.popularity,
                mode: song.mode,
                // in depth audio features
                valence: song.valence,
                liveliness: song.liveliness,
                speechiness: song.speechiness,
                instrumentalness: song.instrumentalness,
                energy: song.energy,
                danceability: song.danceability,
                acousticness: song.acousticness,
              })
            }} key={i}>
            <View style={styles.songLeft}>
            <Image source={{uri: song.artwork}} style={styles.albumArtwork}/>
              <Text style={styles.songTextTrack}>{song.name}</Text>
            </View>
            <View style={styles.songMiddle}>
              <Text style={styles.songTextArtist}>{song.artists}</Text>
              <Text style={styles.songTextAlbum}>{song.album}</Text>
            </View>
            <View style={styles.songRight}>
              {/* <View style={styles.rightLeft}> */}
                <Text style={styles.songText}>{song.duration}</Text>
                <Text style={styles.songText}>{song.key}</Text>
                <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
              {/* </View> */}
              {/* <View style={styles.rightRight}> */}
                <Text style={styles.songText}>{song.bpm}</Text>
                <Text style={styles.songText}>{song.timeSig}</Text>
              {/* </View> */}
            </View>
          </TouchableOpacity>
        )})

      });
    }catch (err) {
      console.log(err);
    }
  }

  sortPlaylist = (sortMethod: string) => {
    if(sortMethod == 'bpm'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.bpm > b.bpm) ? 1 : -1)
    })}
    else if(sortMethod == 'key'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.keyNum > b.keyNum) ? 1 : -1)
    })}
    else if(sortMethod == 'energy'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.energy > b.energy) ? 1 : -1)
    })}
    else if(sortMethod == 'name'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.name > b.name) ? 1 : -1)
    })}
    else if(sortMethod == 'timeSig'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.timeSig > b.timeSig) ? 1 : -1)
    })}
    else if(sortMethod == 'artists'){
    this.setState({
      TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.artists > b.artists) ? 1 : -1)
    })}
    this.setState({
      BasicInfo: this.state.TrackDetails.map((song:any,i:any) => {
        return(
        <TouchableOpacity style={styles.songList} onPress={()=>{
            this.props.navigation.navigate('Song', {
              token: this.state.AuthToken,
              songID:song.id,
              artwork: song.artwork,
              name: song.name,
              artists: song.artists,
              album: song.album,
              duration: song.duration,
              key: song.key,
              timeSig: song.timeSig,
              bpm: song.bpm,
              popularity: song.popularity,
              mode: song.mode,
              // in depth audio features
              valence: song.valence,
              liveliness: song.liveliness,
              speechiness: song.speechiness,
              instrumentalness: song.instrumentalness,
              energy: song.energy,
              danceability: song.danceability,
              acousticness: song.acousticness,
            })
          }} key={i}>
          <View style={styles.songLeft}>
          <Image source={{uri: song.artwork}} style={styles.albumArtwork}/>
            <Text style={styles.songTextTrack}>{song.name}</Text>
          </View>
          <View style={styles.songMiddle}>
            <Text style={styles.songTextArtist}>{song.artists}</Text>
            <Text style={styles.songTextAlbum}>{song.album}</Text>
          </View>
          <View style={styles.songRight}>
            {/* <View style={styles.rightLeft}> */}
              <Text style={styles.songText}>{song.duration}</Text>
              <Text style={styles.songText}>{song.key}</Text>
              <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
            {/* </View> */}
            {/* <View style={styles.rightRight}> */}
              <Text style={styles.songText}>{song.bpm}</Text>
              <Text style={styles.songText}>{song.timeSig}</Text>
            {/* </View> */}
          </View>
        </TouchableOpacity>
      )})
    })
  }

  filterPlaylist = (filterMethod:any, params:any) => {
    if(filterMethod == 'key'){
    this.setState({
      TrackDetails: this.state.TrackDetails.filter((track: { keyNum: any; })=> (track.keyNum==params))
    })}
    else if(filterMethod == 'energy'){
    this.setState({
      TrackDetails: this.state.TrackDetails.filter((track: { energy: number; })=> ((Math.round(track.energy * 10) >= params.minEnergy) && Math.round(track.energy * 10) <= params.maxEnergy))
    })}
    else if(filterMethod == 'time sig.'){
    this.setState({
      TrackDetails: this.state.TrackDetails.filter((track: { timeSig: any; })=> (track.timeSig==params))
    })}
    else if(filterMethod == 'bpm'){
    this.setState({
      TrackDetails: this.state.TrackDetails.filter((track: { bpm: number; })=> (track.bpm >= params.minBpm && track.bpm <= params.maxBpm))
    })}
    else if(filterMethod == 'artists'){
    this.setState({
      TrackDetails: this.state.TrackDetails.filter((track: { artists: any; })=> (track.artists==params.artists))
    })}
    this.setState({
      BasicInfo: this.state.TrackDetails.map((song: { id: any; artwork: any; name: any; artists: any; album: any; duration: any; key: any; timeSig: any; bpm: any; popularity: any; mode: any; valence: any; liveliness: any; speechiness: any; instrumentalness: any; energy: number; danceability: any; acousticness: any; },i: any) => {
        return(
        <TouchableOpacity style={styles.songList} onPress={()=>{
            this.props.navigation.navigate('Song', {
              token: this.state.AuthToken,
              songID:song.id,
              artwork: song.artwork,
              name: song.name,
              artists: song.artists,
              album: song.album,
              duration: song.duration,
              key: song.key,
              timeSig: song.timeSig,
              bpm: song.bpm,
              popularity: song.popularity,
              mode: song.mode,
              // in depth audio features
              valence: song.valence,
              liveliness: song.liveliness,
              speechiness: song.speechiness,
              instrumentalness: song.instrumentalness,
              energy: song.energy,
              danceability: song.danceability,
              acousticness: song.acousticness,
            })
          }} key={i}>
          <View style={styles.songLeft}>
          <Image source={{uri: song.artwork}} style={styles.albumArtwork}/>
            <Text style={styles.songTextTrack}>{song.name}</Text>
          </View>
          <View style={styles.songMiddle}>
            <Text style={styles.songTextArtist}>{song.artists}</Text>
            <Text style={styles.songTextAlbum}>{song.album}</Text>
          </View>
          <View style={styles.songRight}>
            {/* <View style={styles.rightLeft}> */}
              <Text style={styles.songText}>{song.duration}</Text>
              <Text style={styles.songText}>{song.key}</Text>
              <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
            {/* </View> */}
            {/* <View style={styles.rightRight}> */}
              <Text style={styles.songText}>{song.bpm}</Text>
              <Text style={styles.songText}>{song.timeSig}</Text>
            {/* </View> */}
          </View>
        </TouchableOpacity>
      )})
    })
  }

  renderFilterSpecs=()=>{
    if(this.state.showFilterSpecs == 'initial'){
      return(
        <View></View>
      );}
    else if (this.state.showFilterSpecs == 'key'){
      return(
        <View style={styles.filterSpecContainer}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', width:'90%', alignSelf:'center'}}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState({showFilterSpecs:'initial'})}}>
              <Text style={styles.filterSpecText}> X </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#8F8F8F', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius: 50}} onPress={()=>{this.renderValues()}}>
              <Text style={styles.filterSpecText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: '5%'}}>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 0);}}>
                <Text style={styles.filterSpecText}>    C    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 1);}}>
                <Text style={styles.filterSpecText}>C♯ / D♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 2);}}>
                <Text style={styles.filterSpecText}>    D    </Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 3);}}>
                <Text style={styles.filterSpecText}>D♯ / E♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 4);}}>
                <Text style={styles.filterSpecText}>    E    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 5);}}>
                <Text style={styles.filterSpecText}>    F    </Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 6);}}>
                <Text style={styles.filterSpecText}>F♯ / G♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 7);}}>
                <Text style={styles.filterSpecText}>    G    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 8);}}>
                <Text style={styles.filterSpecText}>G♯ / A♭</Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 9);}}>
                <Text style={styles.filterSpecText}>    A    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 10);}}>
                <Text style={styles.filterSpecText}>A♯ / B♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>{this.filterPlaylist('key', 11);}}>
                <Text style={styles.filterSpecText}>    B    </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else if (this.state.showFilterSpecs == 'energy'){
      return(
        <View style={styles.filterSpecInputContainer}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', width:'90%', alignSelf:'center'}}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState({showFilterSpecs:'initial'})}}>
              <Text style={styles.filterSpecText}> X </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#8F8F8F', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius: 50}} onPress={()=>{this.renderValues()}}>
              <Text style={styles.filterSpecText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:'10%'}}>
            <Text style={styles.filterSpecMinMaxText}>min  energy</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {minEnergy=>this.setState({min:parseInt(minEnergy)})}
              placeholder={'0'}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: '10%'}}>
            <Text style={styles.filterSpecMinMaxText}>max energy</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {maxEnergy=>this.setState({max:parseInt(maxEnergy)})}
              placeholder={'10'}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-evenly',marginBottom:'3%', marginTop: '1%',}}>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#5BCC96', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50}} onPress={()=>{this.filterPlaylist('energy', {minEnergy:this.state.min, maxEnergy:this.state.max})}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI'}}>FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (this.state.showFilterSpecs == 'bpm'){
      return(
        <View style={styles.filterSpecInputContainer}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', width:'90%', alignSelf:'center'}}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState({showFilterSpecs:'initial'})}}>
              <Text style={styles.filterSpecText}> X </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#8F8F8F', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius: 50}} onPress={()=>{this.renderValues()}}>
              <Text style={styles.filterSpecText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:'10%'}}>
            <Text style={styles.filterSpecMinMaxText}>min  bpm</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {minBpm=>this.setState({min:parseInt(minBpm)})}
              // placeholder={'0'}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: '10%'}}>
            <Text style={styles.filterSpecMinMaxText}>max bpm</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {maxBpm=>this.setState({max:parseInt(maxBpm)})}
              // placeholder={'10'}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-evenly',marginBottom:'3%', marginTop: '1%',}}>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#5BCC96', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50}} onPress={()=>{this.filterPlaylist('bpm', {minBpm:this.state.min, maxBpm:this.state.max})}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI'}}>FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (this.state.showFilterSpecs == 'timeSig'){
      return(
        <View style={styles.filterSpecInputContainer}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', width:'90%', alignSelf:'center'}}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState({showFilterSpecs:'initial'})}}>
              <Text style={styles.filterSpecText}> X </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#8F8F8F', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius: 50}} onPress={()=>{this.renderValues()}}>
              <Text style={styles.filterSpecText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: '10%'}}>
            <Text style={styles.filterSpecMinMaxText}>time signature</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {timeSig=>this.setState({max:parseInt(timeSig)})}
              // placeholder={'10'}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-evenly',marginBottom:'3%', marginTop: '1%',}}>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#5BCC96', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50}} onPress={()=>{this.filterPlaylist('time sig.', this.state.max)}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI'}}>FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  render(){return (
    // <ImageBackground source = {{uri:this.state.ImageUrl}} style = {styles.backgroundimage} imageStyle={{resizeMode:'cover'}} blurRadius= {200}>
    <View style={{backgroundColor:'#353535', minHeight:'100vh'}}>
      <ScrollView style = {{paddingBottom:'3%'}}>
        <View style={styles.headerContainer}>
          <View style={styles.playlistContainer}>
            <View style={styles.playArtContainer}>
              <Image source={{uri: this.state.ImageUrl}} style={styles.playlistArtwork}/>
            </View>
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName}>{this.state.Name}</Text>
              <Text style={styles.playlistUser}>by {this.state.Owner}</Text>
              <Text style={styles.playlistDesc}>{this.state.Descrip}</Text>
              <Text style={styles.trackAmount}>{this.state.TrackAmount} Tracks</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.spotifyButton}>
            <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
          </TouchableOpacity>
        </View>
        {this.renderFilterSpecs()}
        <View style={styles.optionsContainer}>
          <View style={styles.leftOptions}>
            <Text style={styles.optionsText}>filter by:</Text>
            <TouchableOpacity style={styles.optionsButton} onPress={()=>{this.setState({showFilterSpecs:'key'})}}>
              <Text style={styles.navText}>key</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsButton} onPress={()=>{this.setState({showFilterSpecs:'energy'})}}>
              <Text style={styles.navText}>energy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsButton} onPress={()=>{this.setState({showFilterSpecs:'bpm'})}}>
              <Text style={styles.navText}>bpm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsButton} onPress={()=>{this.setState({showFilterSpecs:'timeSig'})}}>
              <Text style={styles.navText}>time sig.</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headBar}>
          <View style={styles.leftBar}>
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('name'))}>TRACK ˬ</Text>
          </View>
          <View style={styles.middleBar}>
            <Text style={styles.barTextArtist} onPress={()=>(this.sortPlaylist('artists'))}>ARTIST ˬ</Text>
            <Text style={styles.barText}>ALBUM</Text>
          </View>
          <View style={styles.rightBar}>
            <Text style={styles.barText}>DUR.</Text>
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('key'))}>KEY ˬ</Text>
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('energy'))}>ENERGY ˬ</Text>
            <TouchableOpacity style={styles.barText} onPress={()=>(this.sortPlaylist('bpm'))}>BPM ˬ</TouchableOpacity>
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('timeSig'))}>TIME SIG. ˬ</Text>
          </View>
        </View>

        {this.state.BasicInfo}

      </ScrollView>
    {/* </ImageBackground> */}
    </View>
  );}
}


const styles = StyleSheet.create({
  pickerItemStyle:{
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textAlign: 'center',
  },
  filterSpecContainer:{
    // height:100,
    zIndex:5,
    position:'absolute',
    // alignSelf:'flex-end',
    marginLeft:'7%',
    backgroundColor: '#282727',
    marginTop:'5%',
    width:'20%',
    padding:'1%',
  },
  filterSpecInputContainer:{
    // height:100,
    zIndex:5,
    position:'absolute',
    // alignSelf:'flex-end',
    marginLeft:'12%',
    backgroundColor: '#282727',
    marginTop:'2%',
    width:'12%',
    padding: '1%'
  },
  threeKeyContainer:{
    flexDirection:'column',
    marginHorizontal: '4%'
  },
  filterSpecButton:{
    marginVertical:'10%',
    paddingVertical:'2%',
    // paddingHorizontal:'1%',
    alignSelf: 'center',
    // backgroundColor:'#C4C4C4',
    width:'120%',
    textAlign: 'center',
    borderWidth:1,
    borderColor:'#E5E5E5'
    // width:60,
  },
  filterSpecText:{
    fontSize:12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    color:'white',
  },
  filterSpecMinMaxText:{
    fontSize:12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    color:'white',
    paddingRight:'20%'
  },
  filterSpecInput:{
    color:'white',
    borderColor:'#C4C4C4',
    borderWidth:1,
    width:'50%',
  },
  optionsContainer:{
    flexDirection: 'row',
    width:'95%',
    paddingVertical: 5,
    justifyContent:'space-between',
    alignSelf:'center',
  },
  leftOptions: {
    display:'flex',
    flexDirection:'row',
    width:'50%',
    height:'100%',
  },
  optionsText: {
    color:'white',
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    fontSize:14,
    paddingRight: '1%'
  },
  optionsNav: {
    width: '20%',
    height:'auto',
    padding:5,
    backgroundColor:'#e5e5e5',
    borderRadius:20,
    fontFamily: 'Segoe UI',
    textAlign: 'center',
  },
  navText: {
    color:'black',
    fontSize:14,
    textAlign:'center',
    fontFamily: 'Segoe UI',
  },
  rightOptions: {
    width:'30%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignContent:'flex-end',
  },
  optionsButton: {
    padding:5,
    backgroundColor:'#e5e5e5',
    width:90,
    borderRadius:20,
    fontFamily: 'Segoe UI',
  },
  headBar: {
    borderWidth:1,
    borderColor:'white',
    width:'95%',
    height:'auto',
    padding:10,
    flexDirection:'row',
    alignSelf:'center',
    // marginTop:10,
    justifyContent:'space-between',
    shadowColor:'black',
    shadowRadius:3,
    // marginRight: 10
  },
  leftBar: {
    // width:142,
    width:'26%',
    paddingLeft: '7%',
    // textAlign:'right',
    // marginLeft:10,
  },
  middleBar: {
    // width:260,
    width:'35%',
    flexDirection:'row',
    // justifyContent:'space-between',
    // marginLeft:-45, // Going to start making edits
  },
  rightBar: {
    // width:420,
    width:'36%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  barText: {
    color:'white',
    fontSize:18,
    fontWeight: '700',
    textShadowColor:'black',
    textShadowRadius:4,
    flex:1
  },
  barTextArtist: {
    color:'white',
    fontSize:18,
    fontWeight: '700',
    flex: 1,
    textShadowColor:'black',
    textShadowRadius:4,
    paddingRight: '2%'
  },
  songList: {
    width:'95%',
    // height:'100%',
    height: 110,
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'white',
    color:'white',
    flexDirection:'row',
    alignSelf:'center',
    justifyContent:'space-between'
  },
  songLeft: {
    // width:240,
    width: '26%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  songMiddle: {
    // width:400,
    width: '35%',
    flexDirection:'row',
    // justifyContent:'space-between',
    textAlign:'left',
    // marginLeft: '2%',
  },
  songRight: {
    // width:360,
    width: '36%',
    flexDirection:'row',
    textAlign:'left',
  },
  albumArtwork: {
    width:'25%',
    height:'100%',
    // paddingRight: '2%',
    // width:imageHeight/19,
    // height:imageWidth/19,
    // marginRight: '4%',
    // marginLeft: '-4%',
    resizeMode: 'contain',
  },
  songTextArtist: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    flex:1,
    // width: '100%',
    // paddingHorizontal: '2%',
    // paddingLeft: '2%',
    paddingRight: '2%',
  },
  songTextAlbum: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    flex:1,
    // width: '80%',
    // marginLeft: '9%',
  },
  songText: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    flex:1,
  },
  songTextTrack: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    flex:1,
    width: '80%',
    paddingHorizontal: '2%',
  },
  rightLeft: {  // dur, key, energy
    // width:160,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  rightRight: { // bpm, timeSig
    // width:250,
    marginLeft:35,
    flexDirection:'row',
    justifyContent:'space-between',
    // marginRight:10
  },
  backgroundimage: {
    flex: 1,
    resizeMode: 'cover',
    // minWidth: imageWidth,
    // // resizeMethod: 'resize',
    justifyContent: "center",
    // alignItems: 'center',
    // alignText: 'center',
    // alignContent: 'center',
    minHeight: '100vh',
    minWidth:'100%'
    // height: imageHeight-45,
  },
  headerContainer:{
    flexDirection: 'row',
    width: '95%',
    // alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginVertical: '1%'
  },
  spotifyButton:{
    backgroundColor: '#5BCC96',
    justifyContent: 'center',
    // paddingVertical: '1%',
    // paddingHorizontal: '1%',
    borderRadius: 100,
    marginTop: '1%',
    // alignSelf:'center',
    // alignContent: 'center',
    width: 120,
    height:'5vh'
  },
  buttonText:{
    color:'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textAlign: 'center',
    alignSelf: 'center'
  },
  playlistContainer:{
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  playArtContainer:{
    width:200,
    height:200,
    // paddingVertical: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistArtwork:{
    width: '100%',
    height: '100%', 
    // padding: '100%',
    resizeMode: 'contain',
    // marginLeft: '4%',
    // resizeMethod:'auto'
  },
  playlistInfo:{
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    // paddingVertical: '10%',
    marginLeft: 10,
    width: '100%'
  },
  playlistName:{
    color: 'white',
    fontSize: 24,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    fontWeight: '600'
  },
  playlistUser:{
    color: '#C4C4C4',
    fontSize: 12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    fontWeight: '600',
  },
  playlistDesc:{
    color: 'white',
    fontSize: 14,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    width: '90%',
  },
  trackAmount:{
    color: 'white',
    fontSize: 13,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
  },

})

export default PlaylistItems;