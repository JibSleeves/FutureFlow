
"use client";

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Send, ScrollIcon, Bot } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import type { MysticMentorChatInput, ChatMessage } from '@/ai/flows/mystic-mentor-flow';
import { handleMysticMentorChatAction } from './actions';
import { cn } from '@/lib/utils';

const MAX_HISTORY_LENGTH = 12;

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
      toast({ variant: "destructive", title: "Silent Seeker of Arcana", description: "Voice your query to the Arcane Guide, for knowledge awaits." });
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
        toast({ variant: "destructive", title: "Mentor Distracted by Other Realms", description: result.error });
      } else {
        const aiMessage: ChatMessage = { role: 'assistant', content: result.aiResponse };
        setChatHistory(prev => [...prev, aiMessage]);
      }
      inputRef.current?.focus();
    });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-16 h-[calc(100vh-6rem)] flex flex-col"> {/* Increased max-width */}
      <header className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-4 mb-3">
          <ScrollIcon className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" /> Arcane Guide <ScrollIcon className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" />
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-serif italic text-flicker">
          Unlock ancient arts, practical magick, and psychic pathways with your AI companion.
        </p>
      </header>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl flex-grow flex flex-col overflow-hidden">
        <CardHeader className="bg-secondary/50 p-5 border-b-2 border-primary/40">
          <CardTitle className="font-lora text-primary text-2xl tracking-wider">Consult the Arcane Guide</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            Inquire about rituals, psychic senses, occult symbols, or theorize on mystic paths and hidden lore.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 bg-background/50 custom-scrollbar">
          <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
            <div className="space-y-5">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-3 py-1 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-10 w-10 border-2 border-accent/60 shadow-md bg-secondary/50">
                      <AvatarFallback className="bg-transparent"><ScrollIcon className="h-6 w-6 text-accent animate-pulse-glow" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3.5 rounded-2xl shadow-lg text-md font-serif leading-relaxed",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-lg border-2 border-primary/70"
                        : "bg-secondary/70 text-secondary-foreground rounded-bl-lg border-2 border-secondary/70"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                     <Avatar className="h-10 w-10 border-2 border-primary/60 shadow-md bg-card/50">
                      <AvatarFallback className="bg-transparent"><User className="h-6 w-6 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && chatHistory[chatHistory.length -1]?.role === 'user' && (
                 <div className="flex items-end gap-3 py-1">
                    <Avatar className="h-10 w-10 border-2 border-accent/60 shadow-md bg-secondary/50">
                       <AvatarFallback className="bg-transparent"><ScrollIcon className="h-6 w-6 text-accent animate-pulse-glow" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] p-3.5 rounded-2xl shadow-lg bg-secondary/70 text-secondary-foreground rounded-bl-lg border-2 border-secondary/70">
                        <LoadingSpinner size="md" className="text-accent/80"/>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t-2 border-primary/30 p-4 bg-secondary/40">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex w-full items-center space-x-3"
          >
            <Input
              ref={inputRef}
              id="user-input"
              placeholder="Ask of tarot, alchemy, spellcraft, ancient rites..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 bg-input/80 focus:bg-input text-md p-3.5 rounded-lg border-2 border-primary/30 focus:border-accent shadow-inner-deep h-12 font-serif"
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.03] transition-all duration-200 h-12 px-6 font-lora tracking-wide" disabled={isPending}>
              {isPending ? <LoadingSpinner size="sm" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send Inquiry</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-ornate mt-4">
          <ScrollIcon className="h-5 w-5 text-destructive-foreground/80" />
          <AlertTitle className="font-lora text-lg">Guide's Meditation Broken</AlertTitle>
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
