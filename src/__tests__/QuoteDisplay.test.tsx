import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HealthStats } from '../components/HealthStats';

describe('HealthStats', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders health stats correctly', async () => {
    const healthData = {
      "Active Calories": ["2024-09-12,Active Calories,1162.866205242003"],
      "Body Fat Percentage": ["2024-02-12,Body Fat Percentage,0"],
    };
    const startDate = new Date('2024-01-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.getByText('Active Calories')).toBeInTheDocument();
      expect(screen.getByText('Body Fat Percentage')).toBeInTheDocument();
    });
  });

  it('handles empty data', async () => {
    const healthData = {};
    const startDate = new Date('2024-01-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.queryByText(/Active Calories/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Body Fat Percentage/)).not.toBeInTheDocument();
    });
  });

  it('calculates min, max, and avg values correctly', async () => {
    const healthData = {
      "Active Calories": [
        "2024-09-12,Active Calories,1162.866205242003",
        "2024-06-08,Active Calories,743.162",
        "2024-04-09,Active Calories,597.1159999999998",
      ],
    };
    const startDate = new Date('2024-01-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.getByText('Min: 597.116')).toBeInTheDocument();
      expect(screen.getByText('Max: 1162.866')).toBeInTheDocument();
      expect(screen.getByText('Avg: 847.999')).toBeInTheDocument();
    });
  });

  it('displays reference lines correctly', async () => {
    const healthData = {
      "Active Calories": ["2024-09-12,Active Calories,1162.866205242003"],
    };
    const startDate = new Date('2024-01-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.getByText('Ref: 800kcal')).toBeInTheDocument();
    });
  });

  it('filters data based on date range', async () => {
    const healthData = {
      "Active Calories": [
        "2024-09-12,Active Calories,1162.866205242003",
        "2024-06-08,Active Calories,743.162",
        "2024-04-09,Active Calories,597.1159999999998",
      ],
    };
    const startDate = new Date('2024-07-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.getByText('Min: 1162.866')).toBeInTheDocument();
      expect(screen.getByText('Max: 1162.866')).toBeInTheDocument();
      expect(screen.getByText('Avg: 1162.866')).toBeInTheDocument();
    });
  });

  it('handles multiple health logs', async () => {
    const healthData = {
      "Active Calories": ["2024-09-12,Active Calories,1162.866205242003"],
      "Body Fat Percentage": ["2024-02-12,Body Fat Percentage,0"],
      "Protein": ["2024-05-09,Protein,0"],
    };
    const startDate = new Date('2024-01-01');

    render(<HealthStats healthData={healthData} startDate={startDate} />);

    await waitFor(() => {
      expect(screen.getByText('Active Calories')).toBeInTheDocument();
      expect(screen.getByText('Body Fat Percentage')).toBeInTheDocument();
      expect(screen.getByText('Protein')).toBeInTheDocument();
    });
  });
});
