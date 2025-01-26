import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuoteDisplay } from '../components/QuoteDisplay';

describe('QuoteDisplay', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a quote and author', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('date,quote,author\n2023-01-01,"Test quote","Test author"'),
      })
    ) as jest.Mock;

    render(<QuoteDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('Test quote')).toBeInTheDocument();
      expect(screen.getByText('— Test author')).toBeInTheDocument();
    });
  });

  it('handles empty data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('date,quote,author\n'),
      })
    ) as jest.Mock;

    render(<QuoteDisplay />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Test quote/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Test author/)).not.toBeInTheDocument();
    });
  });

  it('updates quote when refresh button is clicked', async () => {
    const mockQuotes = [
      'date,quote,author\n2023-01-01,"First quote","First author"',
      'date,quote,author\n2023-01-02,"Second quote","Second author"'
    ];
    let callCount = 0;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockQuotes[callCount++]),
      })
    ) as jest.Mock;

    render(<QuoteDisplay />);
    
    await waitFor(() => {
      expect(screen.getByText('First quote')).toBeInTheDocument();
      expect(screen.getByText('— First author')).toBeInTheDocument();
    });

    // Reset mock to simulate a new fetch on button click
    callCount = 1;
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Second quote')).toBeInTheDocument();
      expect(screen.getByText('— Second author')).toBeInTheDocument();
    });
  });

  it('renders without crashing when no quotes are available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('date,quote,author\n'),
      })
    ) as jest.Mock;

    render(<QuoteDisplay />);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
