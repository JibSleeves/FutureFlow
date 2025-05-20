
"use client";

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Library, User, Send, ScrollIcon } from "lucide-react"; // Using Library for Mentor
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import type { MysticMentorChatInput, ChatMessage } from '@/ai/flows/mystic-mentor-flow';
import { handleMysticMentorChatAction } from './actions';
import { cn } from '@/lib/utils';

const MAX_HISTORY_LENGTH = 10;

export default function MysticMentorPageClient() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatHistory]);
  
  const handleSubmit = () => {
    if (!userInput.trim()) {
      toast({ variant: "destructive", title: "Silent Seeker", description: "Voice your query to the Arcane Guide." });
      return;
    }
    setError(null);
    const newUserMessage: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');

    startTransition(async () => {
      const recentHistory = [...chatHistory, newUserMessage].slice(-MAX_HISTORY_LENGTH);
      
      const input: MysticMentorChatInput = {
        userMessage: currentInput,
        chatHistory: recentHistory.filter(msg => msg.role !== 'user' || msg.content !== currentInput),
      };
      
      const result = await handleMysticMentorChatAction(input);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Mentor Distracted", description: result.error });
      } else {
        const aiMessage: ChatMessage = { role: 'assistant', content: result.aiResponse };
        setChatHistory(prev => [...prev, aiMessage]);
      }
      inputRef.current?.focus();
    });
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16 h-[calc(100vh-8rem)] flex flex-col">
      <header className="text-center py-6">
        <h1 className="text-5xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-3 mb-2">
          <ScrollIcon className="h-12 w-12 text-accent fortune-teller-glow" /> Arcane Guide {/* Changed Library to ScrollIcon */}
        </h1>
        <p className="mt-2 text-xl text-muted-foreground font-serif italic">
          Unlock ancient arts and practical magick with your AI companion.
        </p>
      </header>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl flex-grow flex flex-col overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="font-serif text-primary text-2xl">Consult the Arcane Guide</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            Inquire about rituals, psychic senses, occult symbols, or theorize on mystic paths.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 bg-background/30">
          <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-3 py-2",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border-2 border-accent/50 shadow-md">
                      <AvatarFallback className="bg-secondary"><ScrollIcon className="h-5 w-5 text-accent" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] p-3 rounded-2xl shadow-lg text-md font-serif",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none border-2 border-primary/70"
                        : "bg-secondary text-secondary-foreground rounded-bl-none border-2 border-secondary/70"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                     <Avatar className="h-9 w-9 border-2 border-primary/50 shadow-md">
                      <AvatarFallback className="bg-card"><User className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && chatHistory[chatHistory.length -1]?.role === 'user' && (
                 <div className="flex items-end gap-3 py-2 justify-start">
                    <Avatar className="h-9 w-9 border-2 border-accent/50 shadow-md">
                       <AvatarFallback className="bg-secondary"><ScrollIcon className="h-5 w-5 text-accent" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] p-3 rounded-2xl shadow-lg bg-secondary text-secondary-foreground rounded-bl-none border-2 border-secondary/70">
                        <LoadingSpinner size="sm" className="text-accent"/>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t-2 border-primary/20 p-4 bg-secondary/20">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex w-full items-center space-x-3"
          >
            <Input
              ref={inputRef}
              id="user-input"
              placeholder="Ask of tarot, spellcraft, alchemy..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 bg-input/80 focus:bg-input text-md p-3 rounded-lg border-2 border-primary/20 focus:border-accent shadow-inner h-12 font-serif"
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 h-12 px-5 font-serif" disabled={isPending}>
              {isPending ? <LoadingSpinner size="sm" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md mt-4">
          <ScrollIcon className="h-5 w-5" />
          <AlertTitle className="font-serif">Guide's Meditation Broken</AlertTitle>
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
