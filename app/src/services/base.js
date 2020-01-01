import axios from 'axios'
import {Token} from '@/store'

// axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
    config => {
        if (Token.checkToken()) {
            config.headers.Authorization = 'Bearer ' + Token.token()
        }
        return config
    }
)

axios.interceptors.response.use(
    response => {
        // return response;
        return Promise.resolve(response);
    },
    error => {
        if (error.response.status === 401) {
            return
        }
        return Promise.reject(error);
    }
);

export default axios