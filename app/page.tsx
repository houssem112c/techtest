'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, articlesApi, authApi } from '@/lib/api';
import { getUser, clearAuthData, isAdmin } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    
    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    setIsUserAdmin(isAdmin());
    loadArticles();
  }, [router]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
      router.push('/login');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await articlesApi.delete(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      const updated = await articlesApi.update(article.id, {
        isPublished: !article.isPublished,
      });
      setArticles(articles.map((a) => (a.id === article.id ? updated : a)));
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article');
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    if (filter === 'published') return article.isPublished;
    if (filter === 'draft') return !article.isPublished;
    return true;
  });

  // Prevent hydration mismatch by not rendering user-specific content until mounted
  if (!mounted) {
    return (
      <>
        <nav className="navbar">
          <div className="container navbar-content">
            <h1>DCMS</h1>
            <div className="navbar-actions">
              <button className="btn btn-primary">Login</button>
              <button className="btn btn-secondary">Register</button>
            </div>
          </div>
        </nav>
        <main className="container">
          <div className="page-header">
            <h1>Articles</h1>
          </div>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1>DCMS</h1>
          <div className="navbar-actions">
            {user ? (
              <>
                <span className="navbar-user">Welcome, {user.email}</span>
                {isUserAdmin && (
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push('/articles/create')}
                  >
                    Create Article
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/login')}
                >
                  Login
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push('/register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <div className="page-header">
          <h1>Articles</h1>
          {isUserAdmin && (
            <div className="filter-container">
              <label htmlFor="filter">Filter: </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="filter-select"
              >
                <option value="all">All Articles</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <p>Loading articles...</p>
        ) : filteredArticles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <div>
                    <h2 className="article-title">{article.title}</h2>
                    <span
                      className={`badge ${
                        article.isPublished ? 'badge-published' : 'badge-draft'
                      }`}
                    >
                      {article.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="article-meta">
                  By {article.authorEmail} •{' '}
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="article-content">
                  {article.content.substring(0, 200)}
                  {article.content.length > 200 ? '...' : ''}
                </div>
                {isUserAdmin && (
                  <div className="article-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        router.push(`/articles/edit/${article.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className={`btn ${
                        article.isPublished ? 'btn-secondary' : 'btn-success'
                      }`}
                      onClick={() => handleTogglePublish(article)}
                    >
                      {article.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(article.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
