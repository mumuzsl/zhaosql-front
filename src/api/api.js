// import axios from "axios";
const axios = require('axios')
// let base = "http://localhost:8080"
let base = "http://47.98.147.56:9999"

export const selectData = (tableName, data) => {
  return axios.get(`${base}/data/select/${tableName}?page=` + data.page, data);
};

export const insertData = (tableName, data) => {
  return axios.post(`${base}/data/insert/${tableName}`, data);
};

export const updateData = (tableName, data) => {
  return axios.put(`${base}/data/update/${tableName}`, data);
};

export const deleteData = (tableName, data) => {
  return axios.post(`${base}/data/delete/${tableName}`, data);
};

export const searchData = (tableName, data) => {
  return axios.post(`${base}/data/search/${tableName}`, data);
};

export const getDetail = (data) => {
  return axios.post(`${base}/data/order/detail`, data);
}

export const selectOrder = (data) => {
  return axios.post(`${base}/data/order/select`, data);
}

export const insertOrder = (data) => {
  return axios.post(`${base}/data/order/insert`, data);
}

export const getStat = () => {
  return axios.get(`${base}/data/order/stat`);
}