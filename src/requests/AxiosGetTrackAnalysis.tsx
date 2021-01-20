import axios from 'axios';

export default{ 
    GetTrackAnalysis: (id: any, token: any) =>
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
        console.log(err, err.response);
        console.log(token);
    })
}