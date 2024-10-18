/* eslint-disable no-unused-vars */
import axios from 'axios';
import { cleanLocalStorage, errorToast, getJWTToken, VITE_API_BASE_PYTHON_URL } from '../helpers/helper';

const BASE_PYTHON_URL = VITE_API_BASE_PYTHON_URL || 'http://191.101.232.33:8010';

const urlEncode = 2;
const headerRequire = true;

const HandleError = (err) => {
  if (err?.meta?.message) {
    errorToast(err?.meta?.message);
  }
}

const ErrorHandler = async (e) => {
  if (e.response?.data?.message) {
    if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else {
      errorToast(e.response?.data?.message);
    }
  } else if (e.response?.data) {
    if (e.response?.data?.meta?.code === 498) {
      // RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else if (e.response?.data?.detail && e.response?.data?.detail.length > 0) {
      errorToast(e.response?.data?.detail[0]?.msg);
    } else {
      errorToast(e.response?.data?.meta?.details);
    }
  } else {
    errorToast('Something went wrong');
  }
};

const GetApi = async (tag = '', isHeader = false) => {
  return axios
    .get(BASE_PYTHON_URL + '/api' + tag, {
      headers: isHeader
        ? { Authorization: getJWTToken() }
        : {}
    })
    .then((data) => {
      if (data.data.data.status) {
        return data;
      } else if (!data.data.meta.code) {
        HandleError(data.data);
        return null;
      }
      return data
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};


const PostApi = async (tag = '', reqBody, isHeader = false, flag = false,) => {
  let flagCheck = flag === urlEncode ? "application/x-www-form-urlencoded" : flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  return axios
    .post(BASE_PYTHON_URL + '/api' + tag, reqBody, {
      headers: isHeader
        ? {
          'Content-Type': flagCheck,
          accept: 'application/json',
          Authorization: getJWTToken()
        }
        : {}
    })
    .then((data) => {
      if (data.data.data.status) {
        return data;
      } else if (!data.data.meta.code) {
        HandleError(data.data);
        return null;
      }
      return data
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const DeleteApi = (tag = '', isHeader = false) => {
  return axios
    .delete(BASE_PYTHON_URL + '/api' + tag, {
      headers: isHeader
        ? {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: getJWTToken()
        }
        : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PutApi = (tag = '', reqBody, isHeader, isJSON = false) => {
  const contentType = {
    'Content-Type': 'application/json'
  };
  const headers = {
    accept: 'application/json',
    Authorization: getJWTToken(),
    ...(isJSON ? contentType : {})
  };
  return axios
    .put(BASE_PYTHON_URL + '/api' + tag, reqBody !== null && reqBody, {
      headers: isHeader ? headers : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PostApiBlob = (tag = '', reqBody) => {
  return axios
    .post(BASE_PYTHON_URL + '/api/user' + tag, reqBody, {
      headers: {
        Authorization: getJWTToken()
      },
      responseType: 'blob'
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = reqBody.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

export const pythonApi = {
  checkRole: (reqBody) => PostApi("/check_role/", reqBody, headerRequire),
  getRole: (reqBody) => PostApi("/get_roles/", reqBody, headerRequire),
  preDefineOptions: (reqBody) => PostApi(`/get_predefined_options/`, reqBody, headerRequire),
  get7Question: (reqBody) => PostApi("/get_range/", reqBody, headerRequire),
  generateResponse: (reqBody) => PostApi("/generate_description/", reqBody, headerRequire),
  uploadResume: (reqBody) => PostApi("/upload_resumes/", reqBody, headerRequire, true),
  getFinalResponse: () => GetApi("/get_jobs/", headerRequire)
}