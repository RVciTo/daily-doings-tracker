import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuoteDisplay } from '../components/QuoteDisplay';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('date,quote,author\n2023-01-01,"Test quote","Test author"'),
  })
) as jest.Mock;

describe('QuoteDisplay', () => {
  it('renders a quote and author', async () => {
    render(<QuoteDisplay />);
    
    // Wait for the quote to be rendered
    const quoteElement = await screen.findByText('Test quote');
    const authorElement = await screen.findByText('— Test author');
    
    expect(quoteElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });
});
