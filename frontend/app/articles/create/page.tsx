'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { articlesApi } from '@/lib/api';
import { isAdmin, getUser } from '@/lib/auth';

export default function CreateArticle() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await articlesApi.create({ title, content, isPublished });
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to create article. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1>DCMS</h1>
          <button className="btn btn-secondary" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="form-container" style={{ maxWidth: '800px' }}>
          <h2>Create Article</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
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
              <label htmlFor="isPublished">Publish immediately</label>
            </div>
            {error && <div className="error">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Creating...' : 'Create Article'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
