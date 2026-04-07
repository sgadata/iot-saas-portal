import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, Globe } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('admin@sga.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for premium feel
        setTimeout(() => {
            const result = login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="login-container">
            {/* Left Side - Brand & Graphics */}
            <div className="login-brand-section">
                <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', left: '-10%' }}></div>
                
                <div style={{ zIndex: 1, animation: 'fadeIn 1s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '2.5rem' }}>
                        {/* SGA DATA SVG LOGO LARGE */}
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z" fill="url(#paint_login)" stroke="var(--accent-primary)" strokeWidth="3"/>
                          <path d="M20 50H80M50 20V80M35 35L65 65M35 65L65 35" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
                          <circle cx="50" cy="50" r="20" fill="white" fillOpacity="0.05" stroke="var(--accent-primary)" strokeWidth="1"/>
                          <path d="M40 50L60 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                          <path d="M50 40L50 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                          <defs>
                            <linearGradient id="paint_login" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#3b82f6"/>
                              <stop offset="1" stopColor="#1e3a8a"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', letterSpacing: '-1.5px', lineHeight: '1' }}>SGA DATA</h1>
                            <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data & Energy Consulting</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.6' }}>
                        {t('app.subtitle')}
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form-section">
                {/* i18n Selector flotante */}
                <div style={{ padding: '2rem 2rem 0', display: 'flex', justifyContent: 'flex-end' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--bg-primary)', padding: '5px', borderRadius: 'var(--radius-md)' }}>
                     <button onClick={() => i18n.changeLanguage('es')} style={{ background: i18n.language === 'es' ? 'rgba(255,255,255,0.05)' : 'transparent', border: '1px solid', borderColor: i18n.language === 'es' ? 'var(--border-color)' : 'transparent', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', filter: i18n.language === 'es' ? 'none' : 'grayscale(100%)', transition: 'all 0.2s' }}>🇪🇸</button>
                     <button onClick={() => i18n.changeLanguage('en')} style={{ background: i18n.language === 'en' ? 'rgba(255,255,255,0.05)' : 'transparent', border: '1px solid', borderColor: i18n.language === 'en' ? 'var(--border-color)' : 'transparent', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', filter: i18n.language === 'en' ? 'none' : 'grayscale(100%)', transition: 'all 0.2s' }}>🇬🇧</button>
                   </div>
                </div>

                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('login.signIn')}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('login.instruction')}</p>

                    {error && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-red)', color: 'var(--status-red)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            {t('login.error')}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('login.emailLabel')}</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    placeholder="admin@sga.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('login.passLabel')}</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ 
                                width: '100%', 
                                padding: '0.875rem', 
                                backgroundColor: 'var(--accent-primary)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: 'var(--radius-md)', 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                cursor: isLoading ? 'wait' : 'pointer',
                                marginTop: '1rem',
                                transition: 'background-color 0.2s',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--accent-hover)')}
                            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--accent-primary)')}
                        >
                            {isLoading ? t('login.loading') : t('login.button')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
