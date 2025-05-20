
"use client";

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Library, User, Send } from "lucide-react"; // Using Library for Mentor
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import type { MysticMentorChatInput, ChatMessage } from '@/ai/flows/mystic-mentor-flow';
import { handleMysticMentorChatAction } from './actions';
import { cn } from '@/lib/utils';

const MAX_HISTORY_LENGTH = 10; // Max number of messages (user + assistant) to send for context

export default function MysticMentorPageClient() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatHistory]);
  
  const handleSubmit = () => {
    if (!userInput.trim()) {
      toast({ variant: "destructive", title: "Empty Message", description: "Please type your question or topic for the Mystic Mentor." });
      return;
    }
    setError(null);
    const newUserMessage: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    startTransition(async () => {
      const recentHistory = chatHistory.slice(-MAX_HISTORY_LENGTH + 1); 
      
      const input: MysticMentorChatInput = {
        userMessage: newUserMessage.content,
        chatHistory: recentHistory,
      };
      
      const result = await handleMysticMentorChatAction(input);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Chat Error", description: result.error });
      } else {
        const aiMessage: ChatMessage = { role: 'assistant', content: result.aiResponse };
        setChatHistory(prev => [...prev, aiMessage]);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16 h-[calc(100vh-10rem)] flex flex-col">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <Library className="h-10 w-10 text-accent" /> Mystic Mentor
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Unlock ancient wisdom and practical magick with your AI guide.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Consult the Mystic Mentor</CardTitle>
          <CardDescription>
            Ask about rituals, psychic development, occult symbolism, or theorize on mystic arts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border border-accent/50">
                      <AvatarFallback><Library className="h-5 w-5 text-accent" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] p-3 rounded-xl shadow",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                     <Avatar className="h-8 w-8 border border-primary/50">
                      <AvatarFallback><User className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && chatHistory[chatHistory.length -1]?.role === 'user' && (
                 <div className="flex items-start gap-3 p-3 rounded-lg justify-start">
                    <Avatar className="h-8 w-8 border border-accent/50">
                      <AvatarFallback><Library className="h-5 w-5 text-accent" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] p-3 rounded-xl shadow bg-secondary text-secondary-foreground rounded-bl-none">
                        <LoadingSpinner size="sm" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="user-input"
              placeholder="Ask about tarot, spellcraft, psychic senses..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 bg-input/80 focus:bg-input"
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
              {isPending ? <LoadingSpinner size="sm" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md mt-4">
          <Library className="h-4 w-4" />
          <AlertTitle>Mentor Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
