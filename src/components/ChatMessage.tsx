
import React from 'react';
import { Message } from '../../types';
import { User, Copy, Check, File, Download } from 'lucide-react';
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
                <div className="flex-1 space-y-4 min-w-0">
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

                    {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {message.attachments.map((file, index) => (
                                <div key={index} className="max-w-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                                    {file.type.startsWith('image/') ? (
                                        <img src={file.url} alt={file.name} className="w-full h-auto max-h-[300px] object-contain cursor-pointer" onClick={() => window.open(file.url, '_blank')} />
                                    ) : (
                                        <div className="p-3 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <File size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{file.type.split('/')[1]}</p>
                                            </div>
                                            <a href={file.url} download={file.name} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Download size={18} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-base prose dark:prose-invert prose-sm max-w-none break-words overflow-hidden">
                        {message.content ? message.content.split('\n').map((line, i) => (
                            <p key={i} className={line.trim() === '' ? 'h-4' : 'mb-2 last:mb-0 break-words'}>
                                {line}
                            </p>
                        )) : !message.attachments && <p className="italic text-slate-400">No content</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
