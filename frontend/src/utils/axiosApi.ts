import axios from 'axios';
import Cookies from 'js-cookie';
import { envVariable } from '../config/envVariable';

/**
 * Interceptors are a feature that allows an application to intercept requests or responses before they are handled by the .then() or the .catch().
 * There are 2 type of interceptor 1) interceptors.request   &&   2) interceptors.response
 * Both types of Axios interceptors accept two functions.
 * The first function of the request interceptor modifies the request if it's a valid, successful request,
 * the second function handles when the request is invalid and throws an error.
 **/

const axiosApi = (specificBaseUrl?: string) => {
  const instance = axios.create();

  if (specificBaseUrl) {
    instance.defaults.baseURL = specificBaseUrl;
  } else {
    instance.defaults.baseURL = envVariable.API_BASE_URL;
  }

  // interceptors Request------------------------------------
  instance.interceptors.request.use(
    async config => {
      // let userToken = Cookies.get('authJwtToken');
      // let token = userToken ? JSON.parse(userToken) : '';
      const token = localStorage.getItem(envVariable.JWT_STORAGE_KEY) || '';
      const tenant_schema = localStorage.getItem('x-tenant-schema') || '';

      if (token) {
        config.headers.Authorization = 'bearer ' + token;
        config.headers['x-tenant-schema'] = tenant_schema;
      }
      return config;
    },
    async error => {
      return Promise.reject(error);
    }
  );

  //validating the token expiration scenario --------------------------
  // interceptors Response------------------------------------
  instance.interceptors.response.use(
    async Response => {
      return Response;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        // Check if Authorization header exists (token was sent)
        const hasAuthHeader = error.config?.headers?.Authorization;

        if (hasAuthHeader) {
          // Token was sent but got 401 - token expired/invalid
          //dispatch action using store to show token expire popup-----
          Cookies.remove('authJwtToken');
          localStorage.removeItem(envVariable.JWT_STORAGE_KEY);
          window.location.pathname = '/';
        }
        // If no Authorization header, it's a login attempt failure - don't redirect
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosApi;
