import { articles } from '../resources/data.js';

const getNextArticleId = () => {
    const maxId = articles.reduce((highest, article) => Math.max(highest, article.id), 0);
    return maxId + 1;
};

export const getArticles = () => articles;

export const getArticleById = (id) => articles.find((article) => article.id === id);

export const createArticle = ({ title, content, journalistId, categoryId }) => {
    const newArticle = {
        id: getNextArticleId(),
        title,
        content,
        journalistId,
        categoryId
    };

    articles.push(newArticle);
    return newArticle;
};

export const updateArticle = (id, updates) => {
    const article = getArticleById(id);
    if (!article) return null;
    if (updates.title !== undefined) article.title = updates.title;
    if (updates.content !== undefined) article.content = updates.content;
    if (updates.journalistId !== undefined) article.journalistId = updates.journalistId;
    if (updates.categoryId !== undefined) article.categoryId = updates.categoryId;
    return article;
};

export const deleteArticle = (id) => {
    const index = articles.findIndex((article) => article.id === id);
    if (index === -1) return false;
    articles.splice(index, 1);
    return true;
};
