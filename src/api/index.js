import axios from "axios";
import {
  cleanLocalStorage,
  errorToast,
  getJWTToken,
  VITE_API_BASE_URL,
} from "../helpers/helper";
import { redirect } from "react-router-dom";

const BASE_URL = VITE_API_BASE_URL || "http://localhost:8020/";

const GetApi = (tag = "", isHeader = false) => {
  return axios
    .get(BASE_URL + "/api/user" + tag, {
      headers: isHeader
        ? {
            Authorization: getJWTToken(),
          }
        : {},
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PostApi = (tag = "", reqBody, isHeader = false, flag = false) => {
  let flagCheck = flag
    ? "multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA"
    : "application/json";

  return axios
    .post(BASE_URL + "/api/user" + tag, reqBody, {
      headers: isHeader
        ? {
            "Content-Type": flagCheck,
            accept: "application/json",
            Authorization: getJWTToken(),
          }
        : {},
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

//confirmlogin
const ConfirmLoginApi = (tag = "") => {
  return axios
    .post(
      BASE_URL + "/api/user" + tag,
      {},
      {
        headers: { Authorization: getJWTToken() },
      }
    )
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const DeleteApi = (tag = "", isHeader = false) => {
  return axios
    .delete(BASE_URL + "/api/user" + tag, {
      headers: isHeader
        ? {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: getJWTToken(),
          }
        : {},
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PutApi = (tag = "", reqBody, isHeader, isJSON = false) => {
  const contentType = {
    "Content-Type": "application/json",
  };
  const headers = {
    accept: "application/json",
    Authorization: getJWTToken(),
    ...(isJSON ? contentType : {}),
  };
  return axios
    .put(BASE_URL + "/api/user" + tag, reqBody !== null && reqBody, {
      headers: isHeader ? headers : {},
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const ErrorHandler = async (e) => {
  if (e.response?.data?.message) {
    if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = "/login";
    } else {
      errorToast(e.response?.data?.message);
    }
  } else if (e.response?.data) {
    if (e.response?.data?.meta?.code === 498) {
      RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = "/login";
    } else {
      errorToast(e.response?.data?.meta?.message);
    }
  } else {
    errorToast("Something went wrong");
  }
};

const PostApiBlob = (tag = "", reqBody) => {
  return axios
    .post(BASE_URL + "/api/user" + tag, reqBody, {
      headers: {
        Authorization: getJWTToken(),
      },
      responseType: "blob",
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = reqBody.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

export const Api = {
  login: (reqBody) => PostApi("/login", reqBody),
  signUp: (reqBody) => PostApi("/signup", reqBody),
  getUserProfile: () => GetApi("/get-profile", true),
  getCompayData: (company) => GetApi(`/get-company?company=${company}`, true),
  updatePersonalProfile: (reqBody) =>
    PostApi("/update-personal-profile", reqBody, true),
  updateAddressProfile: (reqBody) =>
    PostApi("/update-address-profile", reqBody, true),
  downloadResponse: (reqBody) => PostApiBlob("/download-report", reqBody, true),
  getOnboard: () => GetApi("/get-onboard", true),
  putOnboard: (reqBody) => PutApi("/put-onboard", reqBody, true),
  sendUserInvites: (reqBody) => PostApi("/send-invites", reqBody, true),
  checkoutPlan: (reqBody) => PostApi("/get-payment-intend", reqBody, true),
  getPlans: () => GetApi("/get-subscription-plans", true),
  getTerm: (cms) => GetApi(`/get-cms?fileName=${cms}`, false),

  //confirm login
  confirmLogin: () => ConfirmLoginApi(`/confirm/login`),
};
