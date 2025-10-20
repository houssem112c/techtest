'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t.pages.register.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authApi.sendOtp(email, password);
      setSuccess(t.pages.register.otpSent);
      setStep('otp');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t.pages.register.otpError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyOtp(email, otp);
      setAuthData(response.accessToken, response.refreshToken, response.user);
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t.pages.register.verifyError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.sendOtp(email, password);
      setSuccess(t.pages.register.otpSent);
      setOtp('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || t.pages.register.otpError
      );
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
        <h2>{t.pages.register.title}</h2>
        
        {step === 'credentials' ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label htmlFor="email">{t.pages.register.email}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t.pages.register.password}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">{t.pages.register.confirmPassword}</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            {error && <div className="error">{error}</div>}
            {success && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? `${t.common.loading}` : t.pages.register.sendOtp}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                <strong>{t.pages.register.enterOtp}</strong>
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>
                {email}
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="otp">{t.pages.register.otpCode}</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                required
                maxLength={6}
                disabled={loading}
                placeholder="123456"
                style={{
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  fontFamily: 'monospace'
                }}
              />
            </div>
            
            {error && <div className="error">{error}</div>}
            {success && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? `${t.common.loading}` : t.pages.register.verifyOtp}
            </button>
            
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: '#8b5cf6',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {t.pages.register.resendOtp}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('credentials');
                setOtp('');
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              ← Back to email/password
            </button>
          </form>
        )}
        
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {t.pages.register.hasAccount}{' '}
          <a
            href="/login"
            style={{ color: '#2563eb', textDecoration: 'underline' }}
          >
            {t.pages.register.loginLink}
          </a>
        </p>
      </div>
    </div>
  );
}
