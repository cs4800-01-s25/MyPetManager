import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'; // Import jest unit testing

/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/


test('renders feature cards with correct IDs for scheduler and forum', () => {
  render(<App />);

  // Check for correct health portal card id
  const healthPortalCard = screen.getByTestId('healthportal');
  expect(healthPortalCard).toHaveAttribute('id', 'healthportal');

  // Check for correct scheduler card id
  const schedulerCard = screen.getByTestId('scheduler');
  expect(schedulerCard).toHaveAttribute('id', 'scheduler');

  // Check for correct forum card id
  const forumCard = screen.getByTestId('forum');
  expect(forumCard).toHaveAttribute('id', 'forum');
});