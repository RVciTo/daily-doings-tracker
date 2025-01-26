import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Quote {
  text: string;
  author: string;
}

const parseCSV = (text: string): Quote[] => {
  const lines = text.split('\n');
  const quotes: Quote[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && line !== "Quote,Author") {
      const match = line.match(/^"((?:[^"]|"")*)"(?:,|$)"?(.*?)"?$/);
      if (match) {
        const [, quoteText, author] = match;
        const cleanQuote = quoteText.replace(/""/g, '"').trim();
        const cleanAuthor = author.trim() || "Unknown";
        quotes.push({ text: cleanQuote, author: cleanAuthor });
      }
    }
  }

  return quotes;
};

export const QuoteDisplay: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/quotes.csv');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      const parsedQuotes = parseCSV(data);
      return parsedQuotes;
    } catch (error) {
      setError(`Error loading quotes: ${error.message}`);
      return [];
    }
  }, []);

  const setRandomQuote = useCallback((quotesArray: Quote[]) => {
    if (quotesArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesArray.length);
      setCurrentQuote(quotesArray[randomIndex]);
    } else {
      setCurrentQuote(null);
    }
  }, []);

  useEffect(() => {
    const initializeQuotes = async () => {
      const fetchedQuotes = await fetchQuotes();
      setQuotes(fetchedQuotes);
      setRandomQuote(fetchedQuotes);
    };
    initializeQuotes();
  }, [fetchQuotes, setRandomQuote]);

  const handleNewQuote = async () => {
    const fetchedQuotes = await fetchQuotes();
    setQuotes(fetchedQuotes);
    setRandomQuote(fetchedQuotes);
  };

  return (
    <div className="bg-primary/10 rounded-lg p-6 mb-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {currentQuote ? (
        <>
          <blockquote className="text-xl font-serif italic mb-4">
            {currentQuote.text}
          </blockquote>
          <cite className="block text-right text-sm text-gray-600">
            — {currentQuote.author}
          </cite>
        </>
      ) : (
        <p className="text-center text-gray-500">No quotes available</p>
      )}
      <Button onClick={handleNewQuote} className="mt-4" variant="outline" size="icon">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
