
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import Login from './pages/Login';
import aiLogo from './assets/16340244_v920-kul-53.jpg';
import { Message, Conversation, User, Attachment } from '../types';
import { geminiService } from './services/geminiService';
import { Send, PanelLeftClose, PanelLeftOpen, Terminal, Sun, Moon, Plus, X, File, Image as ImageIcon } from 'lucide-react';

const ALL_SUGGESTIONS = [
    "Help me debug a React hook loop",
    "Write a professional email for a job app",
    "Explain quantum physics like I'm 5",
    "Ideas for a sustainable startup",
    "Create a Python script to scrape a website",
    "Explain the difference between SQL and NoSQL",
    "Write a short sci-fi story about Mars",
    "Summary of the French Revolution",
    "How does CRISPR work?",
    "Plan a 3-day trip to Tokyo",
    "Business plan for a specialty coffee shop",
    "Marketing strategies for a new SaaS",
    "Tell me a joke about robots",
    "Tips for improving public speaking",
    "Recipe for a perfect chocolate cake",
    "Analyze the themes of 1984 by George Orwell",
    "How to set up a CI/CD pipeline",
    "Compare React vs Vue in 2025",
    "Explain the theory of relativity simply",
    "Best practices for accessible web design"
];

const App: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const saved = localStorage.getItem('lumina_conversations');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeId, setActiveId] = useState<string>(() => {
        const saved = localStorage.getItem('lumina_active_id');
        return saved || '';
    });

    const [hints, setHints] = useState<string[]>([]);

    useEffect(() => {
        const shuffled = [...ALL_SUGGESTIONS].sort(() => 0.5 - Math.random());
        setHints(shuffled.slice(0, 4));
    }, [activeId]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('masterchatai_theme');
        return (saved as 'light' | 'dark') || 'dark';
    });
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('masterchatai_user');
        return saved ? JSON.parse(saved) : null;
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    const handleLogin = (name: string, email: string) => {
        const newUser = { name, email };
        setUser(newUser);
        localStorage.setItem('masterchatai_user', JSON.stringify(newUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('masterchatai_user');
    };

    const activeConversation = conversations.find(c => c.id === activeId);
    useEffect(() => {
        localStorage.setItem('lumina_conversations', JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        localStorage.setItem('lumina_active_id', activeId);
    }, [activeId]);

    useEffect(() => {
        localStorage.setItem('masterchatai_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages, scrollToBottom]);

    const createNewChat = () => {
        const newConv: Conversation = {
            id: uuidv4(),
            title: 'New Conversation',
            messages: [],
            updatedAt: Date.now(),
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(newConv.id);
    };

    const deleteChat = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeId === id) setActiveId('');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newAttachments: Attachment[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            const promise = new Promise<Attachment>((resolve) => {
                reader.onload = () => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        url: reader.result as string
                    });
                };
            });
            reader.readAsDataURL(file);
            newAttachments.push(await promise);
        }
        setAttachments(prev => [...prev, ...newAttachments]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!input.trim() && attachments.length === 0) || isLoading) return;

        let currentId = activeId;
        if (!currentId) {
            const newId = uuidv4();
            const newConv: Conversation = {
                id: newId,
                title: input.slice(0, 30) || (attachments.length > 0 ? attachments[0].name : 'New Chat'),
                messages: [],
                updatedAt: Date.now(),
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveId(newId);
            currentId = newId;
        }

        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
            attachments: attachments.length > 0 ? [...attachments] : undefined
        };

        const assistantId = uuidv4();
        const assistantMessage: Message = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
        };

        setConversations(prev => prev.map(c =>
            c.id === currentId
                ? {
                    ...c,
                    messages: [...c.messages, userMessage, assistantMessage],
                    title: c.messages.length === 0 ? (input.slice(0, 30) || attachments[0].name) : c.title,
                    updatedAt: Date.now()
                }
                : c
        ));

        setInput('');
        setAttachments([]);
        setIsLoading(true);

        try {
            const messagesSoFar = activeConversation
                ? [...activeConversation.messages, userMessage]
                : [userMessage];

            let fullContent = '';
            for await (const chunk of geminiService.streamChat(messagesSoFar)) {
                fullContent += chunk;
                setConversations(prev => prev.map(c =>
                    c.id === currentId
                        ? {
                            ...c,
                            messages: c.messages.map(m =>
                                m.id === assistantId ? { ...m, content: fullContent } : m
                            )
                        }
                        : c
                ));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar
                conversations={conversations}
                activeId={activeId}
                onSelect={setActiveId}
                onNew={createNewChat}
                onDelete={deleteChat}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
            />
            <main className="flex-1 flex flex-col relative h-full overflow-hidden">
                <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <Terminal size={18} className="text-indigo-500 shrink-0" />
                            <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[200px] md:max-w-xs lg:max-w-md">
                                {activeConversation?.title || 'MASTERCHAT AI'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                GenZ Flash
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
                    {!activeId || (activeConversation && activeConversation.messages.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-20 h-20 mb-6 shadow-2xl shadow-indigo-500/30 rotate-3 overflow-hidden rounded-2xl">
                                <img src={aiLogo} alt="AI Logo" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 dark:text-white">How can I help you today?</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 px-4 text-sm md:text-base">
                                Ask me anything about coding, writing, design, or just chat with me. I'm MASTERCHAT AI, your specialized AI agent.
                            </p>
                            <div className="suggestion-idea grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                                {hints.map((hint, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(hint);
                                        }}
                                        className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
                                        {hint}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="pb-32">
                            {activeConversation?.messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                            {isLoading && activeConversation && activeConversation.messages.length > 0 && !activeConversation.messages[activeConversation.messages.length - 1].content && (
                                <div className="flex w-full py-8 bg-slate-800/30">
                                    <div className="max-w-4xl mx-auto flex gap-4 px-4 md:px-6 w-full">
                                        <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden shadow-lg shadow-indigo-500/20">
                                            <img src={aiLogo} alt="AI" className="w-full h-full object-cover animate-pulse" />
                                        </div>
                                        <div className="flex gap-1 items-center py-2">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white dark:from-slate-950 dark:via-slate-950 to-transparent pt-10 pb-6 px-4">
                    <div className="max-w-4xl mx-auto relative group">
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800">
                                {attachments.map((file, index) => (
                                    <div key={index} className="relative group/file w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                        {file.type.startsWith('image/') ? (
                                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-1">
                                                <File size={24} className="text-slate-400" />
                                                <span className="text-[10px] text-slate-500 truncate w-full text-center mt-1">{file.name}</span>
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => removeAttachment(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/file:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 pl-4 pr-3 shadow-xl dark:shadow-2xl group-focus-within:border-indigo-500/50 transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Message MASTERCHAT AI"
                                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none py-4 text-base text-left min-h-[56px] max-h-[200px]"
                                rows={1}
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }} />
                            <div className="flex items-center gap-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*,.txt,.md,.csv,.log,.js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.h,.css,.html,.xml,.json,.yaml,.yml,.pdf,text/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 rounded-xl transition-all bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400"
                                    title="Upload files"
                                >
                                    <Plus size={20} />
                                </button>
                                <button type="submit" disabled={!input.trim() || isLoading} className={`p-3 rounded-xl transition-all ${input.trim() && !isLoading
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/40 translate-y-[-2px]'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                    }`}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                        <p className="text-[10px] text-center text-slate-600 mt-2 font-medium tracking-wide">
                            MASTERCHAT AI may produce inaccurate information about people, places, or facts.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default App;
