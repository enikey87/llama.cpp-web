import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders llama.cpp-web title in header', () => {
  render(<App />);
  const titleElement = screen.getByText('llama.cpp-web', { selector: 'h1' });
  expect(titleElement).toBeInTheDocument();
});

test('renders settings button', () => {
  render(<App />);
  const settingsButton = screen.getByTitle('Settings');
  expect(settingsButton).toBeInTheDocument();
});

test('renders welcome message when no chat is active', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to llama\.cpp-web/i);
  expect(welcomeElement).toBeInTheDocument();
});
