import {
    createArticle as createArticleService,
    deleteArticle as deleteArticleService,
    getArticleById as getArticleByIdService,
    getAllArticles as getAllArticlesService,
    updateArticle as updateArticleService
} from '../services/articleService.js';

const parseId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

export const getAllArticles = (req, res) => {
    res.json(getAllArticlesService());
};

export const getArticleById = (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = getArticleByIdService(id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
};

export const createArticle = (req, res) => {
    const { title, content, journalistId, categoryId } = req.body;
    if (!title || !content || !journalistId || !categoryId) {
        return res.status(400).json({ error: 'Title, content, journalistId, and categoryId are required' });
    }

    const newArticle = createArticleService({
        title,
        content,
        journalistId: Number(journalistId),
        categoryId: Number(categoryId)
    });

    res.status(201).json(newArticle);
};

export const updateArticle = (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'Invalid article ID' });
    }

    const { title, content, journalistId, categoryId } = req.body;
    const article = updateArticleService(id, {
        title,
        content,
        journalistId: journalistId !== undefined ? Number(journalistId) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined
    });

    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
};

export const deleteArticle = (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'Invalid article ID' });
    }

    const deleted = deleteArticleService(id);
    if (!deleted) {
        return res.status(404).json({ error: 'Article not found' });
    }
    res.sendStatus(204);
};
