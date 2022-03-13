import axios, { AxiosRequestConfig } from 'axios';
import { storageHelper, storageKeys } from './storage-helper';

axios.defaults.baseURL = 'http://localhost:5000/api';

export const coreApi = {
  post
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
