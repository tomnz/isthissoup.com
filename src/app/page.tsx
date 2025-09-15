'use client';

import { useState, useEffect, useRef } from 'react';
import { useCompletion } from '@ai-sdk/react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ask-soup',
  });

  const placeholders = [
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
  ];

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
          // Move to next placeholder
          setCurrentIndex((currentIndex + 1) % placeholders.length);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      await complete(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-4xl mx-auto text-center">
        {/* Main heading and input form */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-12 leading-tight">
            <span className="block mb-4">Is</span>
            <div
              className="relative inline-block cursor-text group"
              onClick={handleInputFocus}
            >
              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="text-4xl md:text-6xl lg:text-7xl font-bold bg-transparent border-none outline-none text-center text-orange-600 placeholder-orange-300 min-w-0 w-auto max-w-sm md:max-w-md lg:max-w-lg"
                style={{
                  width: `${Math.max(inputValue.length || currentPlaceholder.length, 8)}ch`,
                  caretColor: 'transparent'
                }}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />

              {/* Animated placeholder overlay */}
              {!inputValue && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-orange-400 font-bold">
                    {currentPlaceholder}
                    <span className={`inline-block w-1 bg-orange-400 ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ height: '0.9em' }} />
                  </span>
                </div>
              )}

              {/* Custom cursor for when there's input */}
              {inputValue && (
                <div className="absolute top-0 pointer-events-none flex items-center justify-center" style={{ left: `${inputValue.length * 0.6}em` }}>
                  <span className={`inline-block w-1 bg-orange-600 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ height: '0.9em' }} />
                </div>
              )}

              {/* Underline effect */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-300 group-hover:scale-110"
                   style={{ width: `${Math.max(inputValue.length || currentPlaceholder.length, 8)}ch` }} />
            </div>
            <span className="block mt-4">soup?</span>
          </h1>

          {/* Submit button */}
          <form onSubmit={handleSubmit} className="mt-12">
            <button
              type="submit"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!inputValue.trim() || isLoading}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pondering...
                  </>
                ) : (
                  'Ask the Question'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Subtle pulse animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-25 group-hover:opacity-40 animate-pulse" />
            </button>
          </form>
        </div>

        {/* Response section */}
        {completion && (
          <div className="mb-16 w-full max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">The Soup Oracle Says:</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {completion}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle footer */}
        <footer className="text-gray-500 text-sm">
          <p>The ultimate question for the modern culinary philosopher</p>
        </footer>
      </main>
    </div>
  );
}
