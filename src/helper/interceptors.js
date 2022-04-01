import axios from 'axios';
import store from '../store'

export default function setup() {
    axios.interceptors.request.use(function(config) {
        const user = store.getters.authUser;
        if(user) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    }, function(err) {
        return Promise.reject(err);
    });
}
