import axios, { Axios } from "axios";
import { API_BASE_URL, StorageKey } from "../../HelperClass/Constant";
import { AppStoreData, getStorageData } from "./UserData";
import { POSTAPICALL } from "../../services/auth";
import { APIURL } from "../../HelperClass/APIURL";
import { showAlert } from "../../HelperClass/CommonAlert";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let access_token =  await getStorageData(StorageKey.access_token)
    if (access_token) {
        console.log("axios",access_token)
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    // console.log("config",config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  async function (error) {
      const originalRequest = error.config;
      // console.log('orrr', error.response?.data)
      console.debug('error.data', error)

      if (error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true; // Mark the request as retried

          let refresh_token = await getStorageData(StorageKey.access_token)
          if (refresh_token) {
              return axios
                  .post(API_BASE_URL + APIURL.refreshToken, {
                      refresh_token: refresh_token,

                  }, {
                      headers: {
                          "Authorization": `Bearer ${refresh_token}`
                      }
                  })
                  .then(async res => {
                      const { status, access_token } = res.data;
                      console.debug('res', res)
                      console.debug('Access', access_token)
                      if (status == "SUCCESS") {
                          await AppStoreData(StorageKey.access_token, access_token)
                          axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + await getStorageData(StorageKey.access_token)
                          return axiosInstance(originalRequest)
                      } else {
                          // localStorage.clear()
                          // return window.location.href = '/login'
                      }
                  }).catch((error) => {
                      console.debug('ddhddndbdd', error)
                      const { status } = error?.response?.data
                      if (error?.response?.status === 401 && status === "ERROR") {
                          console.debug('dkddndjdndndd')
                          // localStorage.clear()
                          // return window.location.href = '/login'
                          // window.location = "/"
                      }
                  })
          } else {
              // localStorage.clear()
              // return window.location.href = '/login'
          }

      }else{
        showAlert("error", error.response.data.message);
      }
      return Promise.reject(error.response);
  }
);

export default axiosInstance;
