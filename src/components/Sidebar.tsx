import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, Github, User as UserIcon, LogOut } from 'lucide-react';
import { Conversation, User } from '../../types';

interface SidebarProps {
    conversations: Conversation[];
    activeId: string;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    isOpen: boolean;
    user: User | null;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    conversations,
    activeId,
    onSelect,
    onNew,
    onDelete,
    isOpen,
    user,
    onLogout
}) => {
    const [showSettings, setShowSettings] = React.useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const settingsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <aside className={`${isOpen ? 'w-72' : 'w-0'} transition-all duration-300 ease-in-out bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden shrink-0`}>
            <div className="p-4">
                <button onClick={onNew}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 px-4 transition-colors font-medium shadow-lg shadow-indigo-500/20">
                    <Plus size={18} />
                    New Chat
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
                {conversations.length === 0 ? (
                    <div className="text-slate-500 text-sm text-center mt-10 px-4">
                        No conversations yet. Start a new one!
                    </div>
                ) : (
                    conversations.sort((a, b) => b.updatedAt - a.updatedAt).map((conv) => (
                        <div key={conv.id} onClick={() => onSelect(conv.id)} className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${activeId === conv.id
                            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}>
                            <MessageSquare size={16} />
                            <span className="flex-1 truncate text-sm font-medium">
                                {conv.title || 'New Chat'}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }} className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 bg-transparent transition-all ${activeId === conv.id ? 'opacity-100' : ''}`}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4 relative" ref={settingsRef}>
                {showSettings && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden z-50">
                        <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">My Account</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                                    {user?.name.charAt(0) || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors bg-transparent border-none outline-none">
                            <UserIcon size={16} />
                            <span>Profile Settings</span>
                        </button>
                        <button onClick={() => {
                            setShowLogoutConfirm(true);
                            setShowSettings(false);
                        }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors bg-transparent border-none outline-none">
                            <LogOut size={16} />
                            <span>Log Out</span>
                        </button>
                    </div>
                )}
                <div onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors text-sm">
                    <Settings size={18} />
                    <span>Settings</span>
                </div>
                <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                        Powered by M4STERPIECE
                    </div>
                    <a href="https://github.com/M4STERPIECE77K" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                        <Github size={18} />
                    </a>
                </div>
            </div>
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                                <LogOut size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign Out</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Are you sure you want to log out?</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-transparent">
                                Cancel
                            </button>
                            <button onClick={onLogout} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-600/20 transition-all active:scale-95">
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
