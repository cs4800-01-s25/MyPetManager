import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('adds an appointment when Schedule button is clicked', () => {
  render(<App />);
  
  const scheduleButton = screen.getByTestId('schedule-btn');
  fireEvent.click(scheduleButton);
  
  const appointmentItem = screen.getByTestId('appointment-0');
  expect(appointmentItem).toHaveTextContent('Vet Visit');
});

test('adds a reminder when Reminder button is clicked', () => {
  render(<App />);
  
  const reminderButton = screen.getByTestId('reminder-btn');
  fireEvent.click(reminderButton);
  
  const reminderItem = screen.getByTestId('reminder-0');
  expect(reminderItem).toHaveTextContent('Vaccination Due');
});

test('renders empty appointment list initially', () => {
  render(<App />);
  const appointmentList = screen.getByTestId('appointment-list');
  expect(appointmentList.children.length).toBe(0);
});

test('renders empty reminder list initially', () => {
  render(<App />);
  const reminderList = screen.getByTestId('reminder-list');
  expect(reminderList.children.length).toBe(0);
});

