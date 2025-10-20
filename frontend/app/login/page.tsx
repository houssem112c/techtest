'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setAuthData(response.accessToken, response.refreshToken, response.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t.pages.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <LanguageSwitcher />
      </div>
      <div className="form-container">
        <h2>{t.pages.login.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t.pages.login.email}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.pages.login.password}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? `${t.common.loading}` : t.pages.login.submit}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {t.pages.login.noAccount}{' '}
          <a
            href="/register"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            {t.pages.login.registerLink}
          </a>
        </p>
      </div>
    </div>
  );
}
