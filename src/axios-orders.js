import axios from 'axios'; 


const instance = axios.create({
    baseURL: 'https://qwertysite-e07b3.firebaseio.com/'
});

export default instance;