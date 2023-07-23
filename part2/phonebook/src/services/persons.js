import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (newObject) => {
  return axios.put(baseUrl, newObject);
};

const remove = (id) => {
  return axios.delete(baseUrl, `${baseUrl}/${id}`);
  //.then((response) => response.data);
};
export default {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove,
};
