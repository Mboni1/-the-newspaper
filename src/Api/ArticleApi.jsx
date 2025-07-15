
import axios from 'axios';

const API_URL = 'http://localhost:3000/articles';

export const getArticles = () =>  axios.get(API_URL);
export const getArticle = (id) => axios.get(`${API_URL}/${id}`);
export const createArticle = (articleData) => axios.post(API_URL, articleData);
export const updateArticle = (id, articleData) => axios.put(`${API_URL}/${id}`, articleData);
export const deleteArticle = (id) => axios.delete(`${API_URL}/${id}`);