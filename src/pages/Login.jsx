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
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
            {/* Left Side - Brand & Graphics */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                padding: '4rem',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(8,15,37,1) 0%, rgba(15,23,42,1) 100%)'
            }}>
                <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', left: '-10%' }}></div>
                
                <div style={{ zIndex: 1, animation: 'fadeIn 1s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity color="white" size={28} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>{t('app.title')}</h1>
                    </div>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.6' }}>
                        {t('app.subtitle')}
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{ 
                flex: '0 0 500px', 
                backgroundColor: 'var(--bg-secondary)', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                borderLeft: '1px solid var(--border-color)',
                zIndex: 2
            }}>
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
