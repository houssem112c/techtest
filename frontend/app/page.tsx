'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, articlesApi, authApi } from '@/lib/api';
import { getUser, clearAuthData, isAdmin } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loadingArticle, setLoadingArticle] = useState(false);

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

  useEffect(() => {
    // Reload articles when filter changes
    if (mounted && user) {
      loadArticles();
    }
  }, [filter]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getAll(filter);
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
    if (!confirm(t.pages.home.deleteConfirm)) return;

    try {
      await articlesApi.delete(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(t.pages.home.deleteFailed);
    }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      const updated = await articlesApi.update(article.id, {
        isPublished: !article.isPublished,
      });
      setArticles(articles.map((a) => (a.id === article.id ? updated : a)));
      if (selectedArticle && selectedArticle.id === article.id) {
        setSelectedArticle(updated);
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert(t.pages.home.updateFailed);
    }
  };

  const handleArticleClick = async (articleId: string) => {
    try {
      setLoadingArticle(true);
      const article = await articlesApi.getOne(articleId);
      setSelectedArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article details');
    } finally {
      setLoadingArticle(false);
    }
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  // Prevent hydration mismatch by not rendering user-specific content until mounted
  if (!mounted) {
    return (
      <>
        <nav className="navbar">
          <div className="container navbar-content">
            <h1>{t.common.appName}</h1>
            <div className="navbar-actions">
              <LanguageSwitcher />
              <button className="btn btn-primary">{t.nav.login}</button>
              <button className="btn btn-secondary">{t.nav.register}</button>
            </div>
          </div>
        </nav>
        <main className="container">
          <div className="page-header">
            <h1>{t.pages.home.title}</h1>
          </div>
          <p>{t.common.loading}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1>{t.common.appName}</h1>
          <div className="navbar-actions">
            <LanguageSwitcher />
            {user ? (
              <>
                <span className="navbar-user">{t.common.welcome}, {user.email}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push('/profile')}
                >
                  {t.nav.profile}
                </button>
                {isUserAdmin && (
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push('/articles/create')}
                  >
                    {t.nav.createArticle}
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleLogout}>
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/login')}
                >
                  {t.nav.login}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push('/register')}
                >
                  {t.nav.register}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <div className="page-header">
          <h1>{t.pages.home.title}</h1>
          {isUserAdmin && (
            <div className="filter-container">
              <label htmlFor="filter">{t.common.filter}: </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="filter-select"
              >
                <option value="all">{t.articles.filter.all}</option>
                <option value="published">{t.articles.filter.published}</option>
                <option value="draft">{t.articles.filter.drafts}</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <p>{t.pages.home.loadingArticles}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <p>{t.pages.home.noArticles}</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <div 
                key={article.id} 
                className="article-card"
                onClick={() => handleArticleClick(article.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="article-header">
                  <div>
                    <h2 className="article-title">{article.title}</h2>
                    <span
                      className={`badge ${
                        article.isPublished ? 'badge-published' : 'badge-draft'
                      }`}
                    >
                      {article.isPublished ? t.articles.status.published : t.articles.status.draft}
                    </span>
                  </div>
                </div>
                <div className="article-meta">
                  {t.common.by} {article.authorEmail} •{' '}
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="article-content">
                  {article.content.substring(0, 200)}
                  {article.content.length > 200 ? '...' : ''}
                </div>
                {isUserAdmin && (
                  <div className="article-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        router.push(`/articles/edit/${article.id}`)
                      }
                    >
                      {t.articles.actions.edit}
                    </button>
                    <button
                      className={`btn ${
                        article.isPublished ? 'btn-secondary' : 'btn-success'
                      }`}
                      onClick={() => handleTogglePublish(article)}
                    >
                      {article.isPublished ? t.articles.actions.unpublish : t.articles.actions.publish}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(article.id)}
                    >
                      {t.articles.actions.delete}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Article Detail Modal */}
        {selectedArticle && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
              
              <div className="modal-header">
                <h1 className="modal-title">{selectedArticle.title}</h1>
                <span
                  className={`badge ${
                    selectedArticle.isPublished ? 'badge-published' : 'badge-draft'
                  }`}
                >
                  {selectedArticle.isPublished ? t.articles.status.published : t.articles.status.draft}
                </span>
              </div>

              <div className="modal-meta">
                <span>📝 {t.common.by} {selectedArticle.authorEmail}</span>
                <span>📅 {new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                <span>🔄 {t.common.updated}: {new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="modal-body">
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {selectedArticle.content}
                </p>
              </div>

              {isUserAdmin && (
                <div className="modal-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      closeModal();
                      router.push(`/articles/edit/${selectedArticle.id}`);
                    }}
                  >
                    {t.articles.actions.edit}
                  </button>
                  <button
                    className={`btn ${
                      selectedArticle.isPublished ? 'btn-secondary' : 'btn-success'
                    }`}
                    onClick={() => handleTogglePublish(selectedArticle)}
                  >
                    {selectedArticle.isPublished ? t.articles.actions.unpublish : t.articles.actions.publish}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDelete(selectedArticle.id);
                      closeModal();
                    }}
                  >
                    {t.articles.actions.delete}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Modal */}
        {loadingArticle && (
          <div className="modal-overlay">
            <div className="loading-container" style={{ margin: 0 }}>
              <p>{t.common.loading}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
