'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { articlesApi } from '@/lib/api';
import { isAdmin, getUser } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/');
      return;
    }
    loadArticle();
  }, [id, router]);

  const loadArticle = async () => {
    try {
      const article = await articlesApi.getOne(id);
      setTitle(article.title);
      setContent(article.content);
      setIsPublished(article.isPublished);
    } catch (err) {
      setError(t.pages.editArticle.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await articlesApi.update(id, { title, content, isPublished });
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t.pages.editArticle.error
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>{t.pages.editArticle.loading}</p>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1>{t.common.appName}</h1>
          <div className="navbar-actions">
            <LanguageSwitcher />
            <button className="btn btn-secondary" onClick={() => router.push('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="form-container" style={{ maxWidth: '800px' }}>
          <h2>{t.pages.editArticle.title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">{t.pages.editArticle.articleTitle}</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">{t.pages.editArticle.content}</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <label htmlFor="isPublished">{t.pages.editArticle.publish}</label>
            </div>
            {error && <div className="error">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {submitting ? `${t.common.loading}` : t.pages.editArticle.submit}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
