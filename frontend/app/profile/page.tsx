'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, usersApi } from '@/lib/api';
import { getUser, clearAuthData } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(t.pages.profile.error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError(t.pages.profile.passwordMismatch);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await usersApi.changePassword(currentPassword, newPassword);
      setSuccess(t.pages.profile.success);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || t.pages.profile.error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  if (loading) {
    return (
      <>
        <nav className="navbar">
          <div className="container navbar-content">
            <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
              {t.common.appName}
            </h1>
            <LanguageSwitcher />
          </div>
        </nav>
        <main className="container">
          <p>{t.pages.profile.loading}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            {t.common.appName}
          </h1>
          <div className="navbar-actions">
            <LanguageSwitcher />
            <button className="btn btn-primary" onClick={() => router.push('/')}>
              {t.pages.home.title}
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              {t.nav.logout}
            </button>
          </div>
        </div>
      </nav>

      <main className="container">
        <div className="page-header">
          <h1>{t.pages.profile.title}</h1>
        </div>

        {profile && (
          <div className="profile-container">
            <div className="profile-section">
              <h2>{t.pages.profile.title}</h2>
              <div className="profile-info">
                <div className="profile-field">
                  <label>{t.pages.profile.email}:</label>
                  <span>{profile.email}</span>
                </div>
                <div className="profile-field">
                  <label>{t.pages.profile.role}:</label>
                  <span>{profile.role}</span>
                </div>
                <div className="profile-field">
                  <label>{t.pages.profile.memberSince}:</label>
                  <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>{t.pages.profile.changePassword}</h2>
              <form onSubmit={handleChangePassword} className="password-form">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                  <label htmlFor="currentPassword">
                    {t.pages.profile.currentPassword}
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    {t.pages.profile.newPassword}
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmNewPassword">
                    {t.pages.profile.confirmNewPassword}
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? t.common.loading : t.pages.profile.submit}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-section {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          margin-bottom: 2.5rem;
          border: 2px solid rgba(102, 126, 234, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .profile-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .profile-section:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 70px rgba(102, 126, 234, 0.2);
        }

        .profile-section h2 {
          margin-top: 0;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .profile-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: white;
          border-radius: 14px;
          border: 2px solid #f3f4f6;
          transition: all 0.3s ease;
        }

        .profile-field:hover {
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .profile-field label {
          font-weight: 700;
          color: #4b5563;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-field label::before {
          content: '•';
          color: #667eea;
          font-size: 1.5rem;
        }

        .profile-field span {
          color: #1f2937;
          font-weight: 600;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.75rem;
          font-weight: 700;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-group input {
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }

        .form-group input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .alert {
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .alert-error {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #dc2626;
          border: 2px solid #fca5a5;
        }

        .alert-error::before {
          content: '⚠️';
          font-size: 1.25rem;
        }

        .alert-success {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #047857;
          border: 2px solid #6ee7b7;
        }

        .alert-success::before {
          content: '✓';
          font-size: 1.25rem;
        }

        .btn {
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
