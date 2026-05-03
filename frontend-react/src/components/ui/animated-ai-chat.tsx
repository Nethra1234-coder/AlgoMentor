"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    LoaderIcon,
    SendIcon,
    Brain,
    Bug,
    MessageCircleQuestion
} from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { marked } from "marked";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "focus:outline-none",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
    const [problem, setProblem] = useState("");
    const [code, setCode] = useState("");
    const [thinking, setThinking] = useState("");
    const [activeTab, setActiveTab] = useState<"problem" | "code" | "thinking">("problem");
    const [userId, setUserId] = useState("user_123");
    
    const [isTyping, setIsTyping] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [inputFocused, setInputFocused] = useState(false);
    const [responses, setResponses] = useState<string[]>([]);
    
    const { textareaRef: problemRef, adjustHeight: adjustProblemHeight } = useAutoResizeTextarea({ minHeight: 120, maxHeight: 300 });
    const { textareaRef: codeRef, adjustHeight: adjustCodeHeight } = useAutoResizeTextarea({ minHeight: 120, maxHeight: 300 });
    const { textareaRef: thinkingRef, adjustHeight: adjustThinkingHeight } = useAutoResizeTextarea({ minHeight: 120, maxHeight: 300 });


    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!problem.trim() || !code.trim()) {
            alert("Please provide both the problem description and your code attempt.");
            return;
        }

        setIsTyping(true);
        setResponses(prev => [...prev, "Thinking..."]); // Placeholder

        try {
            const res = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, problem, code, thinking })
            });

            const data = await res.json();
            
            setResponses(prev => {
                const newRes = [...prev];
                newRes.pop(); // remove thinking
                if (res.ok) {
                    newRes.push(data.feedback);
                } else {
                    newRes.push(`Error: ${data.detail || 'Failed to process'}`);
                }
                return newRes;
            });
            
            // clear inputs
            setProblem("");
            setCode("");
            setThinking("");
            adjustProblemHeight(true);
            adjustCodeHeight(true);
            adjustThinkingHeight(true);

        } catch (error) {
            setResponses(prev => {
                const newRes = [...prev];
                newRes.pop();
                newRes.push("Connection Error: Make sure FastAPI backend is running.");
                return newRes;
            });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-[#09090b] text-white p-6 relative overflow-hidden lab-bg">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
            </div>
            
            <div className="w-full max-w-3xl mx-auto relative mt-10">
                <motion.div 
                    className="relative z-10 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex flex-col items-center"
                        >
                            <div className="bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs font-medium mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                DSA Mentor · 3 Agents Active
                            </div>
                            
                            <h1 className="text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                                AlgoMentor
                            </h1>
                            <motion.p 
                                className="text-sm text-white/50 mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Submit your code · Get trained to think better
                            </motion.p>
                            
                            <div className="flex flex-wrap gap-3 mt-6 justify-center">
                                <Badge icon={<Bug className="w-3 h-3"/>} num={1} label="Code Debugger" color="yellow" />
                                <Badge icon={<Brain className="w-3 h-3"/>} num={2} label="Thinking Analyzer" color="purple" />
                                <Badge icon={<MessageCircleQuestion className="w-3 h-3"/>} num={3} label="Socratic Mentor" color="pink" />
                            </div>
                            
                            <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-8 w-full max-w-md mx-auto"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                    </div>

                    <motion.div 
                        className="relative backdrop-blur-2xl bg-[#0f0f13]/80 rounded-2xl border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{ minHeight: "400px" }}
                    >
                        {/* Feed Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black/20">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0 border border-violet-500/30">
                                    AM
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-white/90 shadow-lg leading-relaxed">
                                    Hi GNG Paste your problem, code, and thinking below. I'll help you <em>think</em> through it — not solve it for you
                                    -No spoilers. Just guidance.
                                </div>
                            </div>
                            
                            {responses.map((res, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0 border border-violet-500/30">
                                        AM
                                    </div>
                                    <div 
                                        className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-white/90 shadow-lg leading-relaxed prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: marked(res) }}
                                    />
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0 border border-violet-500/30">
                                        AM
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center h-10 shadow-lg">
                                        <TypingDots />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/[0.05] bg-[#121216] p-4 relative">
                            <div className="flex gap-2 mb-3">
                                <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')}>📄 Problem</TabButton>
                                <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')}>&lt;&gt; Code</TabButton>
                                <TabButton active={activeTab === 'thinking'} onClick={() => setActiveTab('thinking')}>🧠 My thinking</TabButton>
                            </div>

                            <div className="relative">
                                {activeTab === 'problem' && (
                                    <Textarea
                                        ref={problemRef}
                                        value={problem}
                                        onChange={(e) => { setProblem(e.target.value); adjustProblemHeight(); }}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="Paste the DSA problem description here..."
                                        className="w-full bg-black/40 border-white/10 text-white/90 text-sm placeholder:text-white/30 resize-none"
                                        showRing={false}
                                    />
                                )}
                                {activeTab === 'code' && (
                                    <Textarea
                                        ref={codeRef}
                                        value={code}
                                        onChange={(e) => { setCode(e.target.value); adjustCodeHeight(); }}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="Paste your code attempt here..."
                                        className="w-full bg-black/40 border-white/10 text-white/90 text-sm placeholder:text-white/30 font-mono resize-none"
                                        showRing={false}
                                    />
                                )}
                                {activeTab === 'thinking' && (
                                    <Textarea
                                        ref={thinkingRef}
                                        value={thinking}
                                        onChange={(e) => { setThinking(e.target.value); adjustThinkingHeight(); }}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="(Optional) Explain your approach and where you are stuck..."
                                        className="w-full bg-black/40 border-white/10 text-white/90 text-sm placeholder:text-white/30 resize-none"
                                        showRing={false}
                                    />
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4">
                                <input 
                                    type="text" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="User ID" 
                                    className="bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:border-violet-500/50 w-32"
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isTyping || (!problem.trim() || !code.trim())}
                                    className={cn(
                                        "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                                        "flex items-center gap-2",
                                        (problem.trim() && code.trim())
                                            ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                            : "bg-white/[0.05] text-white/40 cursor-not-allowed"
                                    )}
                                >
                                    {isTyping ? (
                                        <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                                    ) : (
                                        <SendIcon className="w-4 h-4" />
                                    )}
                                    <span>Analyze Code</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {inputFocused && (
                <motion.div 
                    className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.03] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
                    animate={{
                        x: mousePosition.x - 320,
                        y: mousePosition.y - 320,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 150,
                        mass: 0.5,
                    }}
                />
            )}
        </div>
    );
}

function TabButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                active 
                    ? "bg-white/10 text-white border-white/20" 
                    : "bg-transparent text-white/40 border-transparent hover:text-white/70 hover:bg-white/5"
            )}
        >
            {children}
        </button>
    )
}

function Badge({ num, label, color, icon }: { num: number, label: string, color: string, icon: React.ReactNode }) {
    const colors = {
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        pink: "bg-pink-500/10 text-pink-400 border-pink-500/20"
    };
    
    return (
        <div className={cn("px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2", colors[color as keyof typeof colors])}>
            <span className="flex items-center gap-1.5">
                {icon}
                <span className="w-4 h-4 rounded-full bg-current text-black flex items-center justify-center font-bold" style={{ fontSize: '10px'}}>{num}</span>
            </span>
            {label}
        </div>
    )
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/60 rounded-full"
                    animate={{ 
                        opacity: [0.3, 1, 0.3],
                        y: [0, -3, 0]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
