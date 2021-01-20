import axios from 'axios';

export default{ 
  GetPlaylist: (token: any, uri: any) =>
  axios({
  method: 'get',
  url:`https://api.spotify.com/v1/playlists/${uri}`,
  headers: {
    Authorization: `Bearer ${token}`
  },
  })
  .then(response=>{
      console.log(response.data);
      
      return response.data;
  })
  .catch(err =>{
      console.log(err, err.response);
      return err.response;
  })
}