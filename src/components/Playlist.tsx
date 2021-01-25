import React, {Component, useState} from 'react';
import {Button, Image, StyleSheet, TextInput, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import AxiosGetPlaylist from '../requests/AxiosGetPlaylist';
import AxiosGetToken from '../requests/AxiosGetToken';
import LinearGradient from '../assets/Features/LinearGradient';

interface Props{
  navigation:any,
  route: any,
}

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
      Descrip: "",
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
      // New URL to playlist
      playlistUrl: 'spotify.com',
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
          return response.data;
      })
      .catch(err =>{
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
          let allArtists = track.track.artists.map((artist:any)=>{return artist.name});
          allArtists=allArtists.join(', ');
          return({
            artwork: track.track.album.images[1].url,
            name: track.track.name,
            // artists: track.track.artists[0].name,
            artists: allArtists,
            album: track.track.album.name,
            duration: dur,
            id: track.track.id,
            popularity: track.track.popularity,
            externalUrl: track.track.external_urls.spotify,
          });
        }),
        TrackAmount: playlist.tracks.total,
        playlistUrl: playlist.external_urls.spotify,
      })
      this.setState({
        trackIdStr: this.state.trackIds.join(',')
      })
      
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
            return response.data;
        })
        .catch(err =>{
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
            liveness: songFeatures.liveness,
            speechiness: songFeatures.speechiness,
            instrumentalness: songFeatures.instrumentalness,
            danceability: songFeatures.danceability,
            acousticness: songFeatures.acousticness,
          });
        })
      })
      //start of even newer stuff
      let iterations = Math.floor(this.state.TrackAmount/100);
      for(var i = 0; i<iterations; i++){
        /* Get all the tracks from the playlist */
        let newPlaylist = await axios({
        method: 'get',
        url:`https://api.spotify.com/v1/playlists/${this.state.playlistUri}/tracks`,
        headers: {
          Authorization: `Bearer ${this.state.AuthToken}`
        },
        params:{
          offset: 100*(1+i)
        },
        })
        .then(response=>{
            return response.data;
        })
        .catch(err =>{
            return err.response;
        });
        // New Stuff
        this.setState({
          trackIds: newPlaylist.items.map((track:any)=>{
            return(track.track.id);
          }),
          TrackSimple: this.state.TrackSimple.concat(newPlaylist.items.map((track:any)=>{
            let minutes = Math.floor(track.track.duration_ms/60000);
            let seconds = Math.round((track.track.duration_ms - (60000*minutes))/1000);
            let dur = `${minutes}:${seconds}`;
            let artUrl = '';
            if(seconds<10){dur = `${minutes}:0${seconds}`;}
            return({
              artwork: track.track.album.images[1].url,
              name: track.track.name,
              artists: track.track.artists[0].name,
              album: track.track.album.name,
              duration: dur,
              id: track.track.id,
              popularity: track.track.popularity,
              externalUrl: track.track.external_urls.spotify,
            });
          }))
        })
        this.setState({
          trackIdStr: this.state.trackIds.join(',')
        })
        
        let newFeatures = await axios({
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
              return response.data;
          })
          .catch(err =>{
              return err.response;
          });
        /* features.audio_features */
        this.setState({
          TrackFeatures: this.state.TrackFeatures.concat(newFeatures.audio_features.map((songFeatures:any)=>{
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
              liveness: songFeatures.liveness,
              speechiness: songFeatures.speechiness,
              instrumentalness: songFeatures.instrumentalness,
              danceability: songFeatures.danceability,
              acousticness: songFeatures.acousticness,
            });
          }))
        })
      }
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
        Descrip: playlist.description.replace(/&#x27;|&quot;/gi, "'"),
        TrackAmount: playlist.tracks.total,

        BasicInfo: this.state.TrackDetails.map((song:any, i:any) => {
          return(
          <TouchableOpacity style={styles.songList} onPress={()=>{
              this.props.navigation.navigate('Song Analysis', {
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
                liveness: song.liveness,
                speechiness: song.speechiness,
                instrumentalness: song.instrumentalness,
                energy: song.energy,
                danceability: song.danceability,
                acousticness: song.acousticness,
                externalUrl: song.externalUrl,
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
                <Text style={styles.songText}>{song.duration}</Text>
                <Text style={styles.songText}>{song.key}</Text>
                <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
                <Text style={styles.songText}>{song.bpm}</Text>
                <Text style={styles.songText}>{song.timeSig}</Text>
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
            this.props.navigation.navigate('Song Analysis', {
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
              liveness: song.liveness,
              speechiness: song.speechiness,
              instrumentalness: song.instrumentalness,
              energy: song.energy,
              danceability: song.danceability,
              acousticness: song.acousticness,
              externalUrl: song.externalUrl,
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
              <Text style={styles.songText}>{song.duration}</Text>
              <Text style={styles.songText}>{song.key}</Text>
              <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
              <Text style={styles.songText}>{song.bpm}</Text>
              <Text style={styles.songText}>{song.timeSig}</Text>
          </View>
        </TouchableOpacity>
      )})
    })
  }

  filterPlaylist = async (filterMethod:any, params:any) => {
    let newArray = [];
    if(filterMethod == 'key'){
        newArray =  this.state.TrackDetails.filter((track: { keyNum: any; })=> (track.keyNum==params))
    }
    else if(filterMethod == 'energy'){
        newArray =  this.state.TrackDetails.filter((track: { energy: any; })=> ((Math.round(track.energy * 10) >= params.minEnergy) && Math.round(track.energy * 10) <= params.maxEnergy))
    }
    else if(filterMethod == 'time sig.'){
        newArray = this.state.TrackDetails.filter((track: { timeSig: any; })=> (track.timeSig==params))
    }
    else if(filterMethod == 'bpm'){
        newArray =  this.state.TrackDetails.filter((track: { bpm: any; })=> (track.bpm >= params.minBpm && track.bpm <= params.maxBpm))
    }
    else if(filterMethod == 'artists'){
        newArray =  this.state.TrackDetails.filter((track: { artists: any; })=> (track.artists==params.artists))
    }
    this.setState({
      TrackDetails:await newArray
    })
    this.setState({
      BasicInfo: this.state.TrackDetails.map((song: any,i: any) => {
        return(
        <TouchableOpacity style={styles.songList} onPress={()=>{
            this.props.navigation.navigate('Song Analysis', {
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
              liveness: song.liveness,
              speechiness: song.speechiness,
              instrumentalness: song.instrumentalness,
              energy: song.energy,
              danceability: song.danceability,
              acousticness: song.acousticness,
              externalUrl: song.externalUrl,
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
              <Text style={styles.songText}>{song.duration}</Text>
              <Text style={styles.songText}>{song.key}</Text>
              <Text style={styles.songText}>{Math.round(song.energy * 10)}</Text>
              <Text style={styles.songText}>{song.bpm}</Text>
              <Text style={styles.songText}>{song.timeSig}</Text>
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
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 0))}>
                <Text style={styles.filterSpecText}>    C    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 1))}>
                <Text style={styles.filterSpecText}>C♯ / D♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 2))}>
                <Text style={styles.filterSpecText}>    D    </Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 3))}>
                <Text style={styles.filterSpecText}>D♯ / E♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 4))}>
                <Text style={styles.filterSpecText}>    E    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 5))}>
                <Text style={styles.filterSpecText}>    F    </Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 6))}>
                <Text style={styles.filterSpecText}>F♯ / G♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 7))}>
                <Text style={styles.filterSpecText}>    G    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 8))}>
                <Text style={styles.filterSpecText}>G♯ / A♭</Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.threeKeyContainer}>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 9))}>
                <Text style={styles.filterSpecText}>    A    </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 10))}>
                <Text style={styles.filterSpecText}>A♯ / B♭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterSpecButton} onPress={()=>(this.filterPlaylist('key', 11))}>
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
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#1DB954', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50, shadowColor:'black',shadowRadius:5, shadowOffset:{width:1,height:1}}} onPress={()=>{this.filterPlaylist('energy', {minEnergy:this.state.min, maxEnergy:this.state.max})}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI', letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
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
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: '10%'}}>
            <Text style={styles.filterSpecMinMaxText}>max bpm</Text>
            <TextInput
              style={styles.filterSpecInput}
              onChangeText = {maxBpm=>this.setState({max:parseInt(maxBpm)})}
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-evenly',marginBottom:'3%', marginTop: '1%',}}>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#1DB954', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50, shadowColor:'black',shadowRadius:5, shadowOffset:{width:1,height:1}}} onPress={()=>{this.filterPlaylist('bpm', {minBpm:this.state.min, maxBpm:this.state.max})}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI', letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
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
              allowFontScaling = {true}
              placeholderTextColor='#C4C4C4'
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-evenly',marginBottom:'3%', marginTop: '1%',}}>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#1DB954', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50, shadowColor:'black',shadowRadius:5, shadowOffset:{width:1,height:1}}} onPress={()=>{this.filterPlaylist('time sig.', this.state.max)}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Segoe UI', letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  render(){return (
    <LinearGradient  colors = {['#353535', '#494949','#252525']} style={{minHeight:'100vh'}}>
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
          <TouchableOpacity style={styles.spotifyButton} onPress={()=>{window.open(this.state.playlistUrl, '_blank')}}>
            <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
          </TouchableOpacity>
        </View>
        {this.renderFilterSpecs()}
        <View style={styles.optionsContainer}>
          <View style={styles.leftOptions}>
            <Text style={styles.optionsText}>FILTER BY:</Text>
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
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('bpm'))}>BPM ˬ</Text>
            <Text style={styles.barText} onPress={()=>(this.sortPlaylist('timeSig'))}>TIME SIG. ˬ</Text>
          </View>
        </View>

        {this.state.BasicInfo}

      </ScrollView>
    </LinearGradient>
  );}
}


const styles = StyleSheet.create({
  pickerItemStyle:{
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    textAlign: 'center',
  },
  filterSpecContainer:{
    zIndex:5,
    position:'absolute',
    marginLeft:'9%',
    backgroundColor: '#282727',
    marginTop:'5%',
    width:'20%',
    padding:'1%',
  },
  filterSpecInputContainer:{
    zIndex:5,
    position:'absolute',
    marginLeft:'13%',
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
    alignSelf: 'center',
    width:'120%',
    textAlign: 'center',
    borderWidth:1,
    borderColor:'#E5E5E5'
  },
  filterSpecText:{
    fontSize:12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    color:'white',
  },
  filterSpecMinMaxText:{
    fontSize:12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
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
    textShadowColor:'white',
    textShadowRadius:1,
    fontWeight:'600',
    fontSize:14,
    letterSpacing:1,
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
    fontSize:18,
    fontWeight: '700',
    textShadowColor:'white',
    textShadowRadius:1,
    flex:1
  },
  barTextArtist: {
    color:'white',
    fontSize:18,
    fontWeight: '700',
    flex: 1,
    textShadowColor:'white',
    textShadowRadius:1,
    paddingRight: '2%'
  },
  songList: {
    width:'95%',
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
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
    paddingRight: '2%',
  },
  songTextAlbum: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
  },
  songText: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
  },
  songTextTrack: {
    color:'white',
    fontSize:16,
    fontFamily:'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    flex:1,
    width: '80%',
    paddingHorizontal: '2%',
  },
  rightLeft: {  // dur, key, energy
    flexDirection:'row',
    justifyContent:'space-between',
  },
  rightRight: { // bpm, timeSig
    marginLeft:35,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  backgroundimage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: "center",
    minHeight: '100vh',
    minWidth:'100%',
  },
  headerContainer:{
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginVertical: '1%'
  },
  spotifyButton:{
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: '1%',
    width: 150,
    height:'4vh',
    shadowColor:'black',
    shadowRadius:6,
    shadowOffset:{width:2,height:1}
  },
  buttonText:{
    color:'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Segoe UI',
    textAlign: 'center',
    alignSelf: 'center'
  },
  playlistContainer:{
    flexDirection: 'row',
  },
  playArtContainer:{
    width:'30vh',
    height:'30vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistArtwork:{
    width: '100%',
    height: '100%', 
    resizeMode: 'contain',
  },
  playlistInfo:{
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    marginLeft: 10,
    width: '100%'
  },
  playlistName:{
    color: 'white',
    fontSize: 24,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    fontWeight: '600'
  },
  playlistUser:{
    color: '#C4C4C4',
    fontSize: 12,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    fontWeight: '600',
  },
  playlistDesc:{
    color: 'white',
    fontSize: 14,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    width: '90%',
  },
  trackAmount:{
    color: 'white',
    fontSize: 13,
    fontFamily: 'Segoe UI',
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
  },

})

export default PlaylistItems;