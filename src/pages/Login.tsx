
import React, { useState } from 'react';
import { ArrowRight, User, Mail, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import aiLogo from '../assets/16340244_v920-kul-53.jpg';

interface LoginProps {
    onLogin: (name: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isFormLoading, setIsFormLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const data = await res.json();
                onLogin(data.name, data.email);
            } catch (err) {
                console.error('Failed to fetch user info', err);
            }
        },
        onError: () => console.log('Login Failed'),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && name) {
            setIsFormLoading(true);
            // Simulate real authentication delay
            setTimeout(() => {
                onLogin(name, email);
                setIsFormLoading(false);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="w-full max-w-md p-8 z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 shadow-2xl shadow-indigo-500/40 mb-6 rotate-3 overflow-hidden rounded-2xl">
                        <img src={aiLogo} alt="AI Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">MASTERCHAT AI</h1>
                    <p className="text-slate-500 dark:text-slate-400">Experience the future of intelligent conversation</p>
                </div>
                <div className="space-y-4">
                    <button type="button" onClick={() => login()} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all py-3 px-4 rounded-xl font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.701-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184L12.048 13.56c-.529.355-1.206.564-1.206.564-.814.544-1.815.867-2.842.867-2.34 0-4.322-1.581-5.028-3.711H.153v2.335C1.636 16.602 5.093 18 9 18z" fill="#34A853" />
                            <path d="M3.972 11.28c-.18-.544-.282-1.125-.282-1.728s.102-1.184.282-1.728V5.489H.153C-.42 6.634-.736 7.92-.736 9.272s.316 2.638.889 3.783l3.82-2.935z" fill="#FBBC05" />
                            <path d="M9 3.579c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.093 0 1.636 1.398.153 3.154L3.972 5.49c.706-2.13 2.688-3.711 5.028-3.711z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                    <div className="relative flex items-center justify-center py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <span className="relative px-3 bg-white dark:bg-slate-950 text-xs text-slate-500 uppercase font-semibold">Or</span>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Name</label>
                            <div className="relative">
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-11 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none shadow-sm" />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Email address</label>
                            <div className="relative">
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@example.com" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-11 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none shadow-sm" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>
                        <button type="submit" disabled={isFormLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group mt-2">
                            {isFormLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <p className="text-center text-slate-500 text-sm mt-8">
                    By signing in, you agree to our <span className="text-slate-600 dark:text-slate-300 underline cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
