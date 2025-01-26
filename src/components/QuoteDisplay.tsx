import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Quote {
  text: string;
  author: string;
}

export const QuoteDisplay: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch('/quotes.csv')
      .then(response => response.text())
      .then(data => {
        const parsedQuotes = data.split('\n').slice(1).map(line => {
          const [text, author] = line.split(',');
          return { text: text.replace(/^"|"$/g, ''), author };
        });
        setQuotes(parsedQuotes);
        setRandomQuote(parsedQuotes);
      })
      .catch(error => console.error('Error loading quotes:', error));
  }, []);

  const setRandomQuote = (quotesArray: Quote[]) => {
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    setCurrentQuote(quotesArray[randomIndex]);
  };

  const handleNewQuote = () => {
    setRandomQuote(quotes);
  };

  if (!currentQuote) return null;

  return (
    <div className="bg-primary/10 rounded-lg p-6 mb-8">
      <blockquote className="text-xl font-serif italic mb-4">
        {currentQuote.text}
      </blockquote>
      <cite className="block text-right text-sm text-gray-600">
        — {currentQuote.author}
      </cite>
      <Button onClick={handleNewQuote} className="mt-4">
        New Quote
      </Button>
    </div>
  );
};
