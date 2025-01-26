import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Quote {
  text: string;
  author: string;
}

const parseCSV = (text: string): Quote[] => {
  console.log('Raw CSV content:', text); // Log raw CSV content
  const lines = text.split('\n');
  console.log('CSV lines:', lines); // Log split lines
  const quotes: Quote[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      console.log('Processing line:', line); // Log each line being processed
      const match = line.match(/^"([^"]*)","?([^"]*)"?$/);
      if (match) {
        const [, quoteText, author] = match;
        const cleanQuote = quoteText.replace(/""/g, '"').trim();
        const cleanAuthor = author.trim() || "Unknown";
        quotes.push({ text: cleanQuote, author: cleanAuthor });
        console.log('Parsed quote:', { text: cleanQuote, author: cleanAuthor }); // Log each parsed quote
      } else {
        console.log('Line did not match expected format:', line); // Log lines that don't match
      }
    }
  }

  console.log('Total quotes parsed:', quotes.length); // Log total number of quotes parsed
  return quotes;
};

export const QuoteDisplay: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      console.log('Fetching quotes...'); // Log fetch start
      const response = await fetch('/quotes.csv');
      console.log('Fetch response status:', response.status); // Log response status
      const data = await response.text();
      console.log('Fetch completed, data length:', data.length); // Log fetched data length
      const parsedQuotes = parseCSV(data);
      console.log('Parsed quotes:', parsedQuotes); // For debugging
      return parsedQuotes;
    } catch (error) {
      console.error('Error loading quotes:', error);
      return [];
    }
  }, []);

  const setRandomQuote = useCallback((quotesArray: Quote[]) => {
    console.log('Setting random quote from array of length:', quotesArray.length); // Log array length
    if (quotesArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesArray.length);
      setCurrentQuote(quotesArray[randomIndex]);
      console.log('Set current quote:', quotesArray[randomIndex]); // Log selected quote
    } else {
      setCurrentQuote(null);
      console.log('No quotes available to set'); // Log when no quotes are available
    }
  }, []);

  useEffect(() => {
    const initializeQuotes = async () => {
      console.log('Initializing quotes...'); // Log initialization start
      const fetchedQuotes = await fetchQuotes();
      setQuotes(fetchedQuotes);
      setRandomQuote(fetchedQuotes);
      console.log('Quotes initialized, total quotes:', fetchedQuotes.length); // Log initialization complete
    };
    initializeQuotes();
  }, [fetchQuotes, setRandomQuote]);

  const handleNewQuote = async () => {
    console.log('Handling new quote request...'); // Log new quote request
    const fetchedQuotes = await fetchQuotes();
    setQuotes(fetchedQuotes);
    setRandomQuote(fetchedQuotes);
  };

  return (
    <div className="bg-primary/10 rounded-lg p-6 mb-8">
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
