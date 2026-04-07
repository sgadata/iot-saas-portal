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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '2.5rem' }}>
                        {/* SGA DATA SVG LOGO OFFICIAL HIGR-RES */}
                        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.3))' }}>
                          <path d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z" fill="url(#login_grad)" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
                          <path d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z" fill="url(#login_grad)" stroke="var(--accent-primary)" strokeWidth="3"/>
                          <path d="M25 40L35 45M25 60L35 55M75 40L65 45M75 60L65 55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          <circle cx="50" cy="50" r="22" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
                          <text x="50" y="60" fontFamily="Arial" fontSize="22" fontWeight="900" fill="white" textAnchor="middle" style={{ letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>SGA</text>
                          <defs>
                            <linearGradient id="login_grad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#00E5FF"/>
                              <stop offset="1" stopColor="#007BFF"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '4rem', fontWeight: '900', color: 'white', letterSpacing: '-2px', lineHeight: '1', margin: 0 }}>SGA DATA</h1>
                            <span style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '5px' }}>Data & Energy Consulting</span>
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
