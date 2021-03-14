import React, {Component, useState} from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { GetToken, GetPlaylist, GetPlaylistTracks, GetAlbum, GetAllArtistTracks, GetAudioFeatures } from '../requests/Index';
import LinearGradient from '../assets/Features/LinearGradient';
import { isMacOs, isMobile } from "react-device-detect";
import {Hoverable} from 'react-native-web-hover';

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
      Uri:this.props.route.params.Uri,
      // New state stuff
      trackIds:[],
      trackIdStr:'',
      TrackSimple:[],
      TrackFeatures:[],
      // New URL to playlist
      Url: 'spotify.com',
      // Error Popup
      errorStatus:false,

      // Type of track collection (album, playlist, artist)
      collectionType: this.props.route.params.Type,
      // 
    };
  }

  componentDidMount() {
    this.renderValues();
  }

  renderValues = async() =>{
    try{

      /* Getting the access token  */
      let token = await GetToken();
      this.setState({
        AuthToken: token.access_token
      })

      /* Get all the tracks from the playlist */
      const GetCollection =async()=>{
        if(this.state.collectionType == 'playlist'){
          return await GetPlaylist(this.state.Uri, this.state.AuthToken);
        }
        else if(this.state.collectionType == 'album'){
          return await GetAlbum(this.state.Uri, this.state.AuthToken);
        }
        else if(this.state.collectionType == 'artist'){
          return await GetAllArtistTracks(this.state.Uri, this.state.AuthToken);
        }
      }

      let collection = await GetCollection();
      if(collection == true){ this.setState({errorStatus: true})}

      // New Stuff
      this.setState({
        trackIds: (this.state.collectionType == 'artist' ? collection.tracks : collection.tracks.items).filter((track:any, index=0)=> {  // Use filter since spotify takes down songs that are already in a playlist...
          if((this.state.collectionType == 'artist' && index >= 100) || (this.state.collectionType == 'playlist'? track.track.name: track.name) == ""){
            index++;
            return false;
          }
          index++;
          return true;
        }).map((track:any)=>{
          return((this.state.collectionType == 'playlist'? track.track.id: track.id));
        }),
        TrackSimple: (this.state.collectionType == 'artist' ? collection.tracks : collection.tracks.items).filter((track:any)=> {
          if((this.state.collectionType == 'playlist'? track.track.name: track.name) == ""){
            return false;
          }
          return true;
        }).map((track:any)=>{
          
          let minutes = Math.floor((this.state.collectionType == 'playlist'? track.track.duration_ms : track.duration_ms)/60000);
          let seconds = Math.round(((this.state.collectionType == 'playlist' ? track.track.duration_ms : track.duration_ms) - (60000*minutes))/1000);
          
          let dur = `${minutes}:${seconds}`;
          if(seconds<10){dur = `${minutes}:0${seconds}`;}

          let allArtists = (this.state.collectionType == 'playlist'? track.track.artists: track.artists).map((artist:any)=>{return artist.name});
          allArtists=allArtists.join(', ');
          return({
            artwork: (this.state.collectionType == 'playlist' ? track.track.album.images[1] : this.state.collectionType == 'artist' ? track.artwork[1] : collection.images[1]).url,
            name: (this.state.collectionType == 'playlist'? track.track : track).name,
            artists: allArtists,
            album: (this.state.collectionType == 'playlist' ? track.track.album.name : this.state.collectionType == 'artist' ? track.album_name : collection.name),
            duration: dur,
            id: (this.state.collectionType == 'playlist'? track.track : track).id,
            popularity: (this.state.collectionType == 'playlist'? track.track : this.state.collectionType == 'artist'? track : collection).popularity,
            externalUrl: (this.state.collectionType == 'playlist'? track.track : track).external_urls.spotify,
          });
        }),
        TrackAmount: (this.state.collectionType == 'artist'? collection.total : collection.tracks.total),
        Url: collection.external_urls.spotify, 
      })
      this.setState({
        trackIdStr: this.state.trackIds.join(',')
      })

      /* features.audio_features */
      let features = await GetAudioFeatures(this.state.AuthToken, this.state.trackIdStr);
      
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
      let iterations = Math.floor(this.state.TrackAmount/100);
      for(var i = 0; i<iterations; i++){
        /* Get all the tracks from the playlist */
        let newCollection = [];
        if(this.state.collectionType == 'playlist'){
          newCollection = await GetPlaylistTracks(this.state.Uri, this.state.AuthToken, 100*(1+i));
        }
        /* Setting retrieved data to this.state.trackIds */
        this.setState({
          trackIds: (this.state.collectionType == 'artist'? collection.tracks : newCollection.items).filter((track:any, index=100*(1+i))=> {
            if((this.state.collectionType == 'artist' && (index < 100*(1+i) || index >= collection.total || index >= 100*(2+i))) || (this.state.collectionType == 'playlist'? track.track.name: track.name) == ""){
              index++;
              return false;
            }
            index++;
            return true;
          }).map((track:any)=>{
            return(this.state.collectionType == 'artist'? track.id : track.track.id);
          }),
        });
        if(this.state.collectionType == 'playlist'){
          this.setState({
            TrackSimple: this.state.TrackSimple.concat(newCollection.items.filter((track:any)=> {
              if(track.track.name == ""){
                return false;
              }
              return true;
            }).map((track:any)=>{
              let minutes = Math.floor(track.track.duration_ms/60000);
              let seconds = Math.round((track.track.duration_ms - (60000*minutes))/1000);
              let dur = `${minutes}:${seconds}`;
              if(seconds<10){dur = `${minutes}:0${seconds}`;}
              let allArtists = track.track.artists.map((artist:any)=>{return artist.name});
              allArtists=allArtists.join(', ');
              return({
                artwork: track.track.album.images[1].url,
                name: track.track.name,
                artists: allArtists,
                album: track.track.album.name,
                duration: dur,
                id: track.track.id,
                popularity: track.track.popularity,
                externalUrl: track.track.external_urls.spotify,
              });
            }))
          });
        }

        this.setState({
          trackIdStr: this.state.trackIds.join(',')
        })
        
        /* features.audio_features */
        let newFeatures = await GetAudioFeatures(this.state.AuthToken, this.state.trackIdStr)
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

        if(this.state.collectionType == 'playlist'){
          this.setState({
            Owner: collection.owner.display_name,
            TrackAmount: collection.tracks.total,
            Descrip: collection.description.replace(/&#x27;|&quot;/gi, "'"),
          })
        }
        else if(this.state.collectionType == 'album'){
          let allOwners = collection.artists.map((artist:any)=>{return artist.name});
          allOwners=allOwners.join(', ');

          this.setState({
            Owner: allOwners,
            TrackAmount: collection.total_tracks,
            Descrip: collection.label,
          })
        }
        else if(this.state.collectionType == 'artist'){
          let description = collection.genres.map((genre:any)=>{return genre});
          description=description.join(', ');

          this.setState({
            Owner: '',
            TrackAmount: collection.total,
            Descrip: description,
          })
        }

      this.setState({
        Name: (this.state.collectionType == 'artist' ? collection.artist : collection.name),
        ImageUrl: collection.images[0].url,

        BasicInfo: this.state.TrackDetails.map((song:any, i:any) => {
          return(
          <Hoverable>
          {({hovered})=>(<TouchableOpacity style={{  width:'95%',  overflow:'hidden', opacity: (hovered?.5:1), height: (isMobile? 60:110),  padding:10,  borderBottomWidth:1,  borderBottomColor:'white',  flexDirection:'row',  alignSelf:'center',  justifyContent:'space-between'}} onPress={()=>{
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
          </TouchableOpacity>)}
          </Hoverable>
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
    else if(sortMethod == 'album'){
      this.setState({
        TrackDetails: this.state.TrackDetails.sort((a:any,b:any) => (a.album > b.album) ? 1 : -1)
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
              <Text style={{color:'white', alignSelf:'center', fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
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
              <Text style={{color:'white', alignSelf:'center', fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
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
              <Text style={{color:'white', alignSelf:'center', fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), letterSpacing:1, fontWeight:'600'}}>FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderErrorMessage=()=>{
    if(this.state.errorStatus == false){
      return(<View/>)
    }
    else if(this.state.errorStatus==true){
      return(
        <View style={{height:'20vh', width:'30vw', justifyContent:'space-between', flexDirection:'column', backgroundColor:'white', borderRadius:20, padding:'1%', position:'absolute',zIndex:10, alignSelf:'center', marginTop:'8%', shadowColor:'black',shadowRadius:10}}>
          <Text style={{fontSize:16, fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), color:'black', fontWeight:'700', letterSpacing:1}}>ERROR RETRIEVING PLAYLIST</Text>
          <Text style={{fontSize:12, fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), color:'black', fontWeight:'500', letterSpacing:1, flex:1, flexDirection:'row', paddingVertical:'2%'}}>Please make sure to 'Copy Playlist Link' and that it links to a valid, public Spotify playlist containing only songs found on Spotify.</Text>
            <TouchableOpacity style={{alignSelf:'center', backgroundColor:'#1DB954', paddingVertical: '1%', paddingHorizontal:'10%', borderRadius:50, shadowColor:'black',shadowRadius:5, shadowOffset:{width:1,height:1}}} onPress={()=>{this.props.navigation.navigate('Spotify Public Playlist Analyzer')}}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'), letterSpacing:1, fontWeight:'600'}}>GO BACK</Text>
            </TouchableOpacity>
        </View>
      )
    }
  }

  render(){return (
    <LinearGradient  colors = {['#353535', '#494949','#252525']} style={{minHeight:'100vh'}}>
      <ScrollView style = {{paddingBottom:'3%'}}>
        {this.renderErrorMessage()}
        <View style={styles.headerContainer}>
          <View style={styles.playlistContainer}>
            <View style={styles.playArtContainer}>
              <Image source={{uri: this.state.ImageUrl}} style={styles.playlistArtwork}/>
            </View>
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName}>{this.state.Name}</Text>
              <Text style={styles.playlistUser}>{this.state.collectionType == 'artist' ? '' : 'by'} {this.state.Owner}</Text>
              <Text style={styles.playlistDesc}>{this.state.Descrip}</Text>
              <Text style={styles.trackAmount}>{this.state.TrackAmount} Tracks</Text>
            </View>
          </View>
          <Hoverable>
            {({hovered})=>(<TouchableOpacity style={{ backgroundColor: '#1DB954', justifyContent: 'center', borderRadius: 100, marginTop: '1%', width: 150, height:'4vh', shadowColor:'black', shadowRadius:6, shadowOffset:{width:2,height:1}, opacity: (hovered? .6:1)}} onPress={()=>{window.open(this.state.Url, '_blank')}}>
              <Text style={styles.buttonText}>PLAY ON SPOTIFY</Text>
            </TouchableOpacity>)}
          </Hoverable>
        </View>
        {this.renderFilterSpecs()}
        <View style={styles.optionsContainer}>
          <View style={styles.leftOptions}>
            <Text style={styles.optionsText}>FILTER BY:</Text>
            <Hoverable>
              {({hovered}) => (<TouchableOpacity style={{ padding:5, backgroundColor:'#e5e5e5', width:(isMobile? 60:90), borderRadius:20, opacity : (hovered ? .8:1) }} onPress={()=>{this.setState({showFilterSpecs:'key'})}}>
                <Text style={styles.navText}>key</Text>
              </TouchableOpacity>)}
            </Hoverable>
            <Hoverable>
              {({hovered}) => (<TouchableOpacity style={{ padding:5, backgroundColor:'#e5e5e5', width:(isMobile? 60:90), borderRadius:20, opacity : (hovered ? .8:1) }} onPress={()=>{this.setState({showFilterSpecs:'energy'})}}>
                <Text style={styles.navText}>energy</Text>
              </TouchableOpacity>)}
            </Hoverable>
            <Hoverable>
              {({hovered}) => (<TouchableOpacity style={{ padding:5, backgroundColor:'#e5e5e5', width:(isMobile? 60:90), borderRadius:20, opacity : (hovered ? .8:1) }} onPress={()=>{this.setState({showFilterSpecs:'bpm'})}}>
                <Text style={styles.navText}>bpm</Text>
              </TouchableOpacity>)}
            </Hoverable>
            <Hoverable>
              {({hovered}) => (<TouchableOpacity style={{ padding:5, backgroundColor:'#e5e5e5', width:(isMobile? 60:90), borderRadius:20, opacity : (hovered ? .8:1) }} onPress={()=>{this.setState({showFilterSpecs:'timeSig'})}}>
                <Text style={styles.navText}>time sig.</Text>
              </TouchableOpacity>)}
            </Hoverable>
          </View>
        </View>
        <View style={styles.headBar}>
          <View style={styles.leftBar}>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('name'))}>TRACK ˬ</Text>)}
            </Hoverable>
          </View>
          <View style={styles.middleBar}>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('artists'))}>ARTIST ˬ</Text>)}
            </Hoverable>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('album'))}>ALBUM ˬ</Text>)}
            </Hoverable>
          </View>
          <View style={styles.rightBar}>
            <Text style={styles.barText}>DUR.</Text>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('key'))}>KEY ˬ</Text>)}
            </Hoverable>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('energy'))}>ENERGY ˬ</Text>)}
            </Hoverable>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('bpm'))}>BPM ˬ</Text>)}
            </Hoverable>
            <Hoverable style={{flex:1}}>
              {({hovered})=>(<Text style={{ color:'white', fontSize:(isMobile? 9:18), fontWeight: '700', textShadowColor:'white', textShadowRadius:1, flex:1, opacity: (hovered?.8:1) }} onPress={()=>(this.sortPlaylist('timeSig'))}>TIME SIG. ˬ</Text>)}
            </Hoverable>
          </View>
        </View>

        {this.state.BasicInfo}

      </ScrollView>
    </LinearGradient>
  );}
}


const styles = StyleSheet.create({
  pickerItemStyle:{
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
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
    marginTop:(isMobile? '50%':'5%'),
    width:(isMobile? '80%':'20%'),
    padding:'1%',
  },
  filterSpecInputContainer:{
    zIndex:5,
    position:'absolute',
    marginLeft:'13%',
    backgroundColor: '#282727',
    marginTop:(isMobile? '50%':'2%'),
    width:(isMobile? '50%':'12%'),
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
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    color:'white',
  },
  filterSpecMinMaxText:{
    fontSize:12,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
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
    fontFamily:(isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'white',
    textShadowRadius:1,
    fontWeight:'600',
    fontSize:(isMobile? 9:14),
    letterSpacing:1,
    paddingRight: '1%'
  },
  optionsNav: {
    width: '20%',
    height:'auto',
    padding:5,
    backgroundColor:'#e5e5e5',
    borderRadius:20,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textAlign: 'center',
  },
  navText: {
    color:'black',
    fontSize:(isMobile? 12:14),
    textAlign:'center',
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
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
    width:(isMobile? 60:90),
    borderRadius:20,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
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
    fontSize:(isMobile? 9:18),
    fontWeight: '700',
    textShadowColor:'white',
    textShadowRadius:1,
    flex:1
  },
  barTextArtist: {
    color:'white',
    fontSize:(isMobile? 9:18),
    fontWeight: '700',
    flex: 1,
    textShadowColor:'white',
    textShadowRadius:1,
    paddingRight: '2%'
  },
  songList: {
    width:'95%',
    overflow:'hidden',
    height: (isMobile? 60:110),
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
    flexDirection: (isMobile? 'column':'row'),
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
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textAlign: 'center',
    alignSelf: 'center'
  },
  playlistContainer:{
    flexDirection: (isMobile? 'column':'row'),
  },
  playArtContainer:{
    width:(isMobile? 200:'30vh'),
    height:(isMobile? 200:'30vh'),
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
    width: '100%',
    paddingBottom:(isMobile? '3%':'0%')
  },
  playlistName:{
    color: 'white',
    fontSize: 24,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    fontWeight: '600'
  },
  playlistUser:{
    color: '#C4C4C4',
    fontSize: 12,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    fontWeight: '600',
  },
  playlistDesc:{
    color: 'white',
    fontSize: 14,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
    width: '90%',
    marginVertical:'3%',
  },
  trackAmount:{
    color: 'white',
    fontSize: 13,
    fontFamily: (isMacOs ? 'BlinkMacSystemFont' : 'Segoe UI'),
    textShadowColor:'black',
    textShadowRadius:4,
    textShadowOffset:{width:2,height:2},
  },

})

export default PlaylistItems;