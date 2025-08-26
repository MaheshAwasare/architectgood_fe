import React from 'react';
import { useParams } from 'react-router-dom';
import { Article, blogService } from '../utils/blogService';

interface ArticlePageProps {
  onBack: () => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ onBack }) => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = blogService.getArticleById(articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Article Not Found</h1>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-primary hover:text-primary-light transition-colors duration-300 text-lg"
        >
          ← Back to Blog
        </button>
        <h1 className="text-5xl font-bold mb-4 text-primary-light">{article.title}</h1>
        <p className="text-gray-400 text-sm mb-8">{article.date} | By {article.author}</p>
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default ArticlePage;
