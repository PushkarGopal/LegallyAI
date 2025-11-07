
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, Bot, Loader2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { legalAssistant } from '@/ai/flows/legal-assistant-flow';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && window.webkitSpeechRecognition);

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const result = await legalAssistant({ query: text });
      const assistantMessage: Message = {
        role: 'assistant',
        text: result.textResponse,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error with legal assistant:', error);
      const errorMessage: Message = {
        role: 'assistant',
        text: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition. Please use Chrome or Safari.");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setInput('Listening...');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(transcript);
      if (event.results[0].isFinal) {
        handleSendMessage(transcript);
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      if (input === 'Listening...') {
        setInput('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setInput("");
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12 flex flex-col h-[calc(100vh-theme(spacing.14)-theme(spacing.12))]">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground text-lg mt-2">Ask me anything. You can type or use your voice.</p>
      </div>

      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardContent className="flex-grow p-0 flex flex-col">
            <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                        'flex items-start gap-4',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {message.role === 'assistant' && (
                        <Avatar className="h-10 w-10 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn(
                        'max-w-md rounded-lg p-3',
                        message.role === 'user' 
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                    )}>
                        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                    </div>
                    {message.role === 'user' && (
                        <Avatar className="h-10 w-10 border">
                        <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-md rounded-lg p-3 text-sm bg-muted flex items-center space-x-2">
                           <Loader2 className="h-5 w-5 animate-spin" />
                           <span>Thinking...</span>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background/80">
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                }}
                className="flex items-center gap-2"
                >
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isLoading || isRecording}
                    className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon" onClick={toggleRecording} disabled={isLoading}>
                    {isRecording ? <Square className="h-5 w-5 text-red-500 fill-red-500"/> : <Mic className="h-5 w-5" />}
                    <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                </Button>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
