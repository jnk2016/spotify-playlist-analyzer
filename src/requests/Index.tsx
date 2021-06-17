import axios from "axios";

/**
 * Promise based call using Axios to get access (bearer) token
 * @returns A token for accessing the Spotify API
 */
export const GetToken = () =>
axios({
  method: 'post',
  url:'https://accounts.spotify.com/api/token',
  auth:{
          username: 'e8cc181b4d894651a6e06bff78585bef',
          password: 'a9560ff7171f4af59d8cd49e9a279437',
      },
  headers:{
      'content-type':'application/x-www-form-urlencoded'
  },
  data:'grant_type=client_credentials'
  })
  .then(response=>{
      return response.data;
  })
  .catch(err =>{
      console.log(err.response);
      return err.response.status;
  })
;

/**
 * Promise based call using Axios to get 100 songs and info from a playlist
 * @param playlistUri Playlist uri given by this.state.playlistUri
 * @param token Authorization token given by this.state.AuthToken
 * @returns All basic data from song tracks in the specified playlist
 */
export const GetPlaylist = (playlistUri:any, token:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/playlists/${playlistUri}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  })
  .then(response=>{
      return response.data;
  })
  .catch(err =>{
      console.log(err.response);
      return true;
  })
;

/**
 * Promise based call using Axios to get 100 tracks in a playlist
 * @param playlistUri Playlist uri given by this.state.playlistUri
 * @param token Authorization token given by this.state.AuthToken
 * @param offsetVal Offset from specified index
 * @returns All basic data from song tracks in the specified playlist
 */
export const GetPlaylistTracks = (playlistUri:any, token:any, offsetVal:any)=>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/playlists/${playlistUri}/tracks`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  params:{
    offset: offsetVal
  },
  })
  .then(response=>{
      return response.data;
  })
  .catch(err =>{
    console.log(err.response);
    return true;
  })
;

/**
 * Promise based call using Axios to get all tracks in an album
 * @param albumId Playlist uri identifier
 * @param token Authorization token given by this.state.AuthToken
 * @returns All basic data from song tracks in the specified album
 */
export const GetAlbum = (albumId:any, token:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/albums/${albumId}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  params:{
    offset:0,
    limit:50,
  }
  })
  .then(response=>{
    return response.data;
  })
  .catch(err =>{
    console.log(err.response);
    return true;
  })
;

export const GetTracksFromAlbums = (albumIds:string, artistName:string, trackNames:string[], token:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/albums`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  params:{
    ids:albumIds,
    limit:20,
  }
  })
  .then(response=>{
    let tracks: any[] = [];
    let newTrackNames: string[] = [];

    tracks = tracks.concat(response.data.albums
      .map((album:any)=>{
        return album.tracks.items
        .filter((track:any)=>{
          if(newTrackNames.includes(track.name)) {
            return false;
          }
          if(trackNames.includes(track.name)) {
            return false;
          }
          for(var l = 0; l < track.artists.length; l++){
            if(track.artists[l].name == artistName){
              newTrackNames.push(track.name);
              return true;
            }
          }
          return false;
        })
        .map((track:any)=>{
          return({
            album_name: album.name,
            duration_ms: track.duration_ms,
            artists: track.artists,
            artwork: album.images,
            name: track.name,
            id: track.id,
            popularity: album.popularity,
            external_urls:track.external_urls,
          })
        })
      }
    ))
    return {
      newTracks: tracks,
      newTrackNames: newTrackNames,
    };
  })
  .catch(err =>{
    console.log(err.response);
    return err;
  })
;

/**
 * Promise based call using Axios to get details of an artist
 * @param artistId artist uri identifier
 * @param token Authorization token given by this.state.AuthToken
 * @returns All artist details
 */
const GetArtistDetails = (artistId:any, token:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/artists/${artistId}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  })
  .then(response=>{
      return({
        images: response.data.images,
        genres: response.data.genres,
        name: response.data.name,
        external_urls: response.data.external_urls,
      });
  })
  .catch(err =>{
      return err.status;
  })
;

/**
 * Promise based call using Axios to get 50 albums of an artist
 * @param artistId artist uri identifier
 * @param token Authorization token given by this.state.AuthToken
 * @param offsetVal:any 
 * @returns A maximum of 50 albums of an artist
 */
const GetArtistAlbums = (artistId:any, token:any, offsetVal:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/artists/${artistId}/albums`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  params: {
    offset: offsetVal,
    limit: 50,
  },
  })
  .then(response=>{
      return ({
        ids: response.data.items.map((album:any)=>{
          return album.id;
        }),
        totalAlbums: response.data.total,
      });
  })
  .catch(err =>{
    console.log(err.response);
    return err.status;
  })
;

/**
 * Promise based call using Axios to all tracks of an artist
 * @param artistId artist uri identifier
 * @param token Authorization token given by this.state.AuthToken
 * @returns All basic data from song tracks an artist has
 */
export const GetAllArtistTracks = async(artistId:any, token:any) => {
  try{
    let artistDetails = await GetArtistDetails(artistId, token);
    let allAlbums = await GetArtistAlbums(artistId, token, 0);
    let allTracks: any[] = [];

    let totalAlbums = allAlbums.totalAlbums;
    let albumIds:any[] = allAlbums.ids;

    let allTrackNames: string[] = [];

    /* Getting the rest of the albums */
    let iterations = Math.floor(totalAlbums/50);
    for(var j = 0; j < iterations; j++){
      let moreAlbums = await GetArtistAlbums(artistId, token, 50*(1+j));
      albumIds = albumIds.concat(moreAlbums.ids.map((id:any)=>{
        return id;
      }));
    }

    /* Getting the tracks in batches of albums using multiple album ids */
    iterations = Math.floor(albumIds.length/20);
    var albumIdsString = albumIds.slice(0,20).toString();
    let albumBatch = await GetTracksFromAlbums(albumIdsString, artistDetails.name, allTrackNames, token);
    allTrackNames = allTrackNames.concat(albumBatch.newTrackNames.map((name:any)=>{return name}));
    for(var k = 0; k < albumBatch.newTracks.length; k++) {
      if(albumBatch.newTracks[k].length != 0) {
        allTracks = allTracks.concat(albumBatch.newTracks[k]
        .map((track:any)=>{return ({
          album_name: track.album_name,
          duration_ms: track.duration_ms,
          artists: track.artists,
          artwork: track.artwork,
          name: track.name,
          id: track.id,
          popularity: track.popularity,
          external_urls:track.external_urls,
        })}))
      }
    }

    for(var j = 0; j < iterations; j++) {
      albumIdsString = albumIds.slice(20*(j+1),(j==iterations-1 ? albumIds.length : 20*(j+2))).toString();
      albumBatch = await GetTracksFromAlbums(albumIdsString, artistDetails.name, allTrackNames, token);
      allTrackNames = allTrackNames.concat(albumBatch.newTrackNames.map((name:any)=> {return name}));
      for(var k = 0; k < albumBatch.newTracks.length; k++) {
        if(albumBatch.newTracks[k].length != 0) {
          allTracks = allTracks.concat(albumBatch.newTracks[k]
          .map((track:any)=>{return ({
            album_name: track.album_name,
            duration_ms: track.duration_ms,
            artists: track.artists,
            artwork: track.artwork,
            name: track.name,
            id: track.id,
            popularity: track.popularity,
            external_urls:track.external_urls,
          })}))
        }
      }
    }

    return({
      tracks: allTracks,
      total: allTracks.length,
      images: artistDetails.images,
      artist: artistDetails.name,
      genres: artistDetails.genres,
      external_urls: artistDetails.external_urls,
    })
  }
  catch(err){
    console.log(err);
    return true;
  }
}

/**
 * Promise based call using Axios to get audio features for a set of songs
 * @param token Authorization token given by this.state.AuthToken
 * @param tracks String appending all track ids given by this.state.trackIdStr
 * @returns All audio features corresponding to each song in the list of tracks
 */
export const GetAudioFeatures = (token:any, tracks:any) =>
axios({
  method: 'get',
  url:`https://api.spotify.com/v1/audio-features`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  params:{
    ids:`${tracks}`
  }
  })
  .then(response=>{
      return response.data;
  })
  .catch(err =>{
      console.log(err.response.data);
      throw err.response.data;
  })
;

export const GetTrackAnalysis = (id:any, token:any)=>
  axios({
  method: 'get',
  url:`https://api.spotify.com/v1/audio-analysis/${id}`,
  headers:{
      'Authorization':`Bearer ${token}`
  },
  })
  .then(response=>{
      console.log(response.data);
      return response.data;
  })
  .catch(err =>{
    console.log(err.response.data);
    throw err.response.data;
  })
;