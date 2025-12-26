
import React from 'react';
import { Message } from '../../types';
import { User, Copy, Check } from 'lucide-react';
import aiLogo from '../assets/16340244_v920-kul-53.jpg';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex w-full py-8 ${isAssistant ? 'bg-slate-50 dark:bg-slate-800/30' : ''}`}>
            <div className="max-w-4xl mx-auto flex gap-4 px-4 md:px-6 w-full">
                <div className={`shrink-0 w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${isAssistant ? 'shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                    {isAssistant ? <img src={aiLogo} alt="AI" className="w-full h-full object-cover" /> : <User size={18} className="text-slate-600 dark:text-white" />}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                            {isAssistant ? 'MASTERCHAT AI' : 'You'}
                        </span>
                        {isAssistant && (
                            <button onClick={handleCopy} className="text-slate-500 hover:text-slate-300 transition-colors" title="Copy response">
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                        )}
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-base prose dark:prose-invert prose-sm max-w-none">
                        {message.content.split('\n').map((line, i) => (
                            <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-2 last:mb-0'}>
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
