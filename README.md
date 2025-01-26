# Daily Doings Tracker

## Project Description

Daily Doings Tracker is a web application designed to help users track their daily habits and visualize their progress over time. The app allows users to upload their habit data via CSV files and provides insightful visualizations of completion rates and current streaks for each habit.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- date-fns (for date manipulation)
- Recharts (for data visualization)

## Project Structure

The project follows a standard React application structure:

- `src/`: Contains the source code of the application
  - `components/`: Reusable React components
  - `pages/`: Main page components
  - `utils/`: Utility functions
  - `App.tsx`: Main application component
- `public/`: Static assets and HTML template

Key components:
- `Index.tsx`: Main dashboard page
- `CompletionRates.tsx`: Visualizes habit completion rates
- `StreaksView.tsx`: Displays current streaks for habits
- `QuoteDisplay.tsx`: Shows inspirational quotes

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd daily-doings-tracker
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the proxy server:
   ```
   npm run proxy
   ```

5. In a new terminal window, start the development server:
   ```
   npm run dev
   ```

6. Open your browser and visit `http://localhost:5173` (or the port specified in the console output).

Note: The proxy server is necessary to avoid CORS issues when fetching data from external sources. Make sure to keep both the proxy server and the development server running while using the application.

## Running Tests

To run the unit tests for this project:

1. Ensure you have installed the necessary testing dependencies:
   ```
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest
   ```

2. Run the tests using the following command:
   ```
   npm test
   ```

This will execute all test files in the project that match the naming convention `*.test.ts` or `*.test.tsx`.

## Features

- CSV Data Upload: Users can upload their habit tracking data using CSV files.
- Completion Rates Visualization: The app displays the percentage of days each habit was completed within a selected date range.
- Current Streaks: Shows the number of consecutive days each habit has been maintained up to the current date.
- Date Range Selection: Users can select different date ranges to view their habit data.
- Inspirational Quotes: Displays random inspirational quotes to motivate users using the QuoteDisplay component. Users can refresh quotes with a single click.
- Responsive Design: The application is fully responsive and works well on various screen sizes.

## How to Use

1. Prepare your CSV file with two columns: 'date' (YYYY-MM-DD format) and 'habit'.
2. Upload your CSV file using the "Upload CSV" button on the dashboard.
3. Use the date range selector to adjust the time period for viewing completion rates.
4. View your habit completion rates and current streaks in the visualizations provided.
5. Get inspired by the randomly displayed quotes and refresh them using the "New Quote" button.

## Contributing

Contributions to improve Daily Doings Tracker are welcome. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Ensure your code follows the project's coding standards and practices.
5. Test your changes thoroughly.
6. Push your changes to your fork.
7. Submit a pull request with a clear description of your changes.

### Development Guidelines

- Follow the existing code style and structure.
- Write clear, self-documenting code and add comments where necessary.
- Create unit tests for new features or bug fixes.
- Update the README.md file if you add new features or change existing functionality.

## License

[Include license information here, if applicable]

## Acknowledgements

- Thanks to all contributors who have helped shape this project.
- Inspirational quotes provided by [source of quotes, if applicable].
