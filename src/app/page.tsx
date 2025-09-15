'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [inputWidth, setInputWidth] = useState(160); // Default width in pixels
  const [inputHeight, setInputHeight] = useState(0); // Track height for positioning
  const [headerHeight, setHeaderHeight] = useState(80); // Track header height for response positioning

  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  const streamResponse = async (prompt: string) => {
    setIsLoading(true);
    setCompletion('');

    try {
      if (!hasAskedQuestion) {
        setHasAskedQuestion(true);
      }
      const response = await fetch('/api/ask-soup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCompletion(fullResponse);
      }
    } catch (error) {
      console.error('Error:', error);
      setCompletion('Sorry, there was an error getting a response.');
    } finally {
      setIsLoading(false);
    }
  };

  const placeholders = useMemo(() => [
    'ramen',
    'shakshuka',
    'beef stew',
    'ketchup',
    'cereal',
    'gazpacho',
    'chili',
    'pho',
    'minestrone',
    'tomato juice'
  ], []);

  // Animated placeholder effect
  useEffect(() => {
    const interval = setInterval(() => {
      const currentText = placeholders[currentIndex];

      if (isTyping) {
        if (charIndex < currentText.length) {
          setCurrentPlaceholder(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at full text
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        if (charIndex > 0) {
          setCurrentPlaceholder(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next placeholder, ensuring we don't repeat
          const nextIndex = (currentIndex + 1) % placeholders.length;
          setCurrentIndex(nextIndex);
          setIsTyping(true);
        }
      }
    }, isTyping ? 100 : 50);

    return () => clearInterval(interval);
  }, [currentIndex, isTyping, charIndex, placeholders]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(!showCursor);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  // Handle initial textarea sizing and header height
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
      setInputHeight(inputRef.current.scrollHeight);
    }
    if (headerRef.current && hasAskedQuestion) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [inputValue, hasAskedQuestion]);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      await streamResponse(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Cap at 100 characters
    if (value.length <= 100) {
      setInputValue(value);
      // Auto-resize textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        setInputWidth(inputRef.current.offsetWidth);
        setInputHeight(inputRef.current.scrollHeight);
      }
    }
  };

  const handleInputFocus = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-8">
      <main className="w-full max-w-4xl mx-auto text-center">
        {/* Main heading and input form */}
        <div ref={headerRef} className={`transition-all duration-1000 ease-in-out ${hasAskedQuestion ? 'fixed top-0 left-0 right-0 bg-gradient-to-br from-orange-50/95 via-white/95 to-red-50/95 backdrop-blur-sm shadow-lg z-50 py-4' : 'flex items-center justify-center min-h-screen mb-16'}`}>
          <div className={`flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 transition-all duration-1000 ${hasAskedQuestion ? 'mb-0' : 'mb-12'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight flex flex-col md:flex-row items-end gap-4 md:gap-6">
              <span>Is</span>
              <div
                className="relative inline-block cursor-text group flex items-end"
                onClick={handleInputFocus}
              >
                {/* Input field */}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none text-center text-orange-600 placeholder-orange-300 min-w-0 w-auto max-w-sm md:max-w-md lg:max-w-lg resize-none leading-tight"
                  style={{
                    width: inputValue ? `${Math.max(10, inputValue.length + 1)}ch` : '10ch',
                    caretColor: 'rgb(251 146 60)',
                    height: 'auto',
                    minHeight: '1.2em',
                    overflow: 'hidden',
                    verticalAlign: 'baseline',
                    lineHeight: '1.1'
                  }}
                  autoComplete="off"
                  spellCheck="false"
                  rows={1}
                  maxLength={50}
                />

                {/* Animated placeholder overlay */}
                {!inputValue && !isFocused && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <span className="text-orange-200 font-bold text-3xl md:text-4xl lg:text-5xl">
                      {currentPlaceholder}
                      <span className={`inline-block w-1 bg-orange-400 ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ height: '0.8em' }} />
                    </span>
                  </div>
                )}


                {/* Underline effect */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-300 group-hover:scale-110"
                     style={{
                       width: `${inputWidth}px`
                     }} />
              </div>
              <span>soup?</span>
            </h1>

            {/* Submit button */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ml-4"
                disabled={!inputValue.trim() || isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-25 group-hover:opacity-40 animate-pulse" />
              </button>
            </form>
          </div>
        </div>

        {/* Response section */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${
          completion ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 mt-0'
        }`} style={{
          paddingTop: completion && hasAskedQuestion ? `${headerHeight + 16}px` : '0'
        }}>
          <div className="w-full max-w-2xl mx-auto transform transition-transform duration-500 ease-out ${
            completion ? 'translate-y-0' : 'translate-y-8'
          }">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Verdict:</h3>
                  <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1">
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>
                      }}
                    >
                      {completion}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
