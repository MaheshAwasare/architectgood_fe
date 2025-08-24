import React from 'react';
import { Article, blogService } from '../utils/blogService';

interface BlogPageProps {
  onViewArticle: (articleId: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onViewArticle }) => {
  const articles = blogService.getAllArticles();

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary">
          Our Blog
        </h1>
        <div className="space-y-10">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 transform hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => onViewArticle(article.id)}
            >
              <h2 className="text-3xl font-semibold mb-2 text-primary-light">{article.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{article.date} | By {article.author}</p>
              <p className="text-gray-300 leading-relaxed">{article.excerpt}</p>
              <button className="mt-4 text-primary hover:underline">
                Read More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
