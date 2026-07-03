import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById } from "../services/api";

export default function ArticlePage() {
  const { id } = useParams();

  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [id]);
  useEffect(() => {
    console.log("article", article);
  }, [article]);
  const fetchArticle = async () => {
    try {
      setLoading(true);

      const found = await getArticleById(id);
      if (found) {
        setArticle(found);
        console.log("found", found);
        setError("");
      } else {
        setArticle(null);
        setError("Article not found.");
      }
    } catch (error) {
      setError("Failed to fetch article.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>No article found.</div>;

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <div>
        <strong>Journalist:</strong>{article.name}
      </div>
      <div>
        <strong>Category:</strong> {article.category}
      </div>
    </div>
  );
}
