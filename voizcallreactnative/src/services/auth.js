import axiosInstance from "../components/utils/axios";
import { APIURL } from "../HelperClass/APIURL";
import { showAlert } from "../HelperClass/CommonAlert";

export const Login = async () => {
  try {
    const res = await axiosInstance.get(routes.posOffers, { params });
    if (res.data.statusCode === 201) {
      return { success: true, data: res.data, message: res.data.message };
    }
    return { success: false, message: res.data.message };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const getSwitchConfig = async () => {
  try {
    const res = await axiosInstance.get(APIURL.GetSwichConfig);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const getCountyCode = async () => {
  try {
    const res = await axiosInstance.get(APIURL.GetAllCountyCode);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};


export const SendOTPAPI = async (data) => {
  try {
    const res = await axiosInstance.post(APIURL.SendOTP, data);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};


export const Qr_login = async (data) => {
  console.log("data", data)
  try {
    const res = await axiosInstance.post(APIURL.Qrlogin, data);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error.data);
    return { success: false, message: error.message };
  }
};

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get(APIURL.Getprofile);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};


export const GETAPICALL = async (APIURL) => {
  try {
    const res = await axiosInstance.get(APIURL);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const POSTAPICALL = async (APIURL, data) => {
  console.log('APIURL', APIURL)
  try {
    const res = await axiosInstance.post(APIURL, data);
    if (res.data.status == 'SUCCESS') {
      return {success: true, data: res.data.data };
    }
    return {success: false, data: res.data.data};
  } catch (error) {
    console.log(error);
    return {success: false, message: error.message};
  }
};


export const RESETPOSTAPICALL = async (APIURL, data) => {
  console.log('APIURL', APIURL)
  try {
    const res = await axiosInstance.post(APIURL, data);
    if (res.data.status == 'SUCCESS') {
      return {success: true, data: res.data };
    }
    return {success: false, data: res.data};
  } catch (error) {
    console.log(error);
    return {success: false, message: error.message};
  }
};


export const CDRLAPICALL = async (APIURL, data) => {
  console.log('APIURL', APIURL)
  try {
    const res = await axiosInstance.post(APIURL, data);
    console.log('res', res.data.data)
    console.log('res', res.data.status)

    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data};
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message};
  }
};

export const DLETEAPICAll = async (APIURL, data) => {
  console.log('APIURL', APIURL)
  try {
    console.log('resdelete', data)
    const res = await axiosInstance.delete(APIURL, {data});
    console.log('resdelete', res)
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: res.data.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};



export const POSTAPICALLAllData = async (APIURL, data) => {
  console.log('APIURL', APIURL)
  try {
    const res = await axiosInstance.post(APIURL, data);
    if (res.data.status == 'SUCCESS') {
      return { success: true, data: res.data };
    }
    return { success: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

