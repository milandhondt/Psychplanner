import axiosRoot from 'axios';
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';

const baseURL = import.meta.env.VITE_API_URL;

const axios = axiosRoot.create({baseURL});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export async function getAll(url) {
  const { data } = await axios.get(url);

  return data.items;
}

export const updateById = async (url, {arg: body}) => {
  const { id, ...values} = body;
  await axios.put(`${url}/${id}`, values);
};

export const getById = async (url)  => {
  const {data} = await axios.get(url);
  return data;
};

export const deleteById = async (url, { arg: id }) => {
  await axios.delete(`${url}/${id}`);
};

export async function save(url, { arg: { id, ...data } }) {
  await axios({
    method: id? 'PUT' : 'POST',
    url: `${url}/${id ?? ''}`,
    data,
  });
  
}

export const post = async (url, {arg}) => {
  const {data} = await axios.post(url, arg);
  return data;
};

export const getBeschikbaarhedenByPsycholoogId = async (url) => {
  const { data } = await axios.get(url);
  return data.items;
};

export const getServicesByPsycholoogId = async (url) => {
  const { data } = await axios.get(url);
  return data.items;
};

export const getAfsprakenByKlantId = async (id) => {
  const { data } = await axios.get(`users/${id}/afspraken`);  
  return data.items;
};

export const getAfsprakenByPsycholoogId = async (id) => {
  const { data } = await axios.get(`afspraken/psychologen/${id}`);  
  return data.items;
};
