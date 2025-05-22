// import { getData, setData } from '@/utils';
// const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION}`;
// const getAuth = () => {
//   try {
//     const auth = getData(AUTH_LOCAL_STORAGE_KEY);
//     if (auth) {
//       return auth;
//     } else {
//       return undefined;
//     }
//   } catch (error) {
//     console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
//   }
// };
// const setAuth = auth => {
//   setData(AUTH_LOCAL_STORAGE_KEY, auth);
// };
// const removeAuth = () => {
//   if (!localStorage) {
//     return;
//   }
//   try {
//     localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
//   } catch (error) {
//     console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
//   }
// };
// export function setupAxios(axios) {
//   axios.defaults.headers.Accept = 'application/json';
//   axios.interceptors.request.use(config => {
//     const auth = getAuth();
//     if (auth?.access_token) {
//       config.headers.Authorization = `Bearer ${auth.access_token}`;
//     }
//     return config;
//   }, async err => await Promise.reject(err));
// }
// export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };


import { getData, setData } from '@/utils';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION}`;

const getAuth = () => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY);
    return auth || null; // Return null if auth is falsy (e.g., null or undefined)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    return null; // Return null if parsing fails
  }
};

const setAuth = (auth) => {
  if (auth === undefined || auth === null) {
    removeAuth(); // Remove the key if auth is undefined or null
  } else {
    setData(AUTH_LOCAL_STORAGE_KEY, auth);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config) => {
      const auth = getAuth();
      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }
      return config;
    },
    async (err) => await Promise.reject(err)
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };