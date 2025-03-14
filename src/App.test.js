import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const headingElement = screen.getByText(/Hello, MyPetManager!/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders pet management text', () => {
  render(<App />);
  const textElement = screen.getByText(/Welcome to the pet management system./i);
  expect(textElement).toBeInTheDocument();
});
