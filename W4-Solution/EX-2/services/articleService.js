import {
    createArticle as createArticleModel,
    deleteArticle as deleteArticleModel,
    getArticleById as getArticleByIdModel,
    getArticles as getArticlesModel,
    updateArticle as updateArticleModel
} from '../models/articleModel.js';

export const getAllArticles = () => getArticlesModel();
export const getArticleById = (id) => getArticleByIdModel(id);
export const createArticle = (payload) => createArticleModel(payload);
export const updateArticle = (id, updates) => updateArticleModel(id, updates);
export const deleteArticle = (id) => deleteArticleModel(id);
