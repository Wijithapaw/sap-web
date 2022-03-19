import axios, { AxiosRequestConfig } from 'axios';
import { storageHelper, storageKeys } from './storage-helper';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export const coreApi = {
  post,
  get
}

function getConfig(): AxiosRequestConfig<any> {
  return { 
    headers: { 
      'Authorization': `bearer ${storageHelper.getValue(storageKeys.authToken) || ''}` 
    } 
  }
}

function post<T>(path: string, data: any) {
  return axios.post<T>(path, data, getConfig())
    .then(r => r.data);
}


function get<T>(path: string) {
  return axios.get<T>(path, getConfig())
    .then(r => r.data);
}
