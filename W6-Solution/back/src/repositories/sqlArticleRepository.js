//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import { pool } from "../utils/database.js";

// Get all articles
export async function getArticles() {
    const [rows] = await pool.query(`SELECT id, title, content, journalist, category FROM ARTICLES`);
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    const [rows] = await pool.query(`SELECT id, title, content, journalist, category FROM ARTICLES WHERE id = ?`, [id]);
    return rows[0];
}

// Create a new article
export async function createArticle(article) {
    const [result] = await pool.query(
        `INSERT INTO ARTICLES (id, title, content, journalist, category) VALUES (?, ?, ?, ?, ?)`,
        [article.id, article.title, article.content, article.journalist, article.category]
    );
    return { id: article.id, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    await pool.query(
        `UPDATE ARTICLES SET title = ?, content = ?, journalist = ?, category = ? WHERE id = ?`,
        [updatedData.title, updatedData.content, updatedData.journalist, updatedData.category, id]
    );
    return { id, ...updatedData };
}

// Delete an article by ID
export async function deleteArticle(id) {
    const [result] = await pool.query(`DELETE FROM ARTICLES WHERE id = ?`, [id]);
    return result.affectedRows > 0;
}
