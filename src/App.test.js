import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');

    return {
      BrowserRouter: ({ children }) => <>{children}</>,
      Routes: ({ children }) => <>{children}</>,
      Route: ({ element }) => element,
      Navigate: () => null,
      Link: ({ children, to }) => <a href={to}>{children}</a>,
      useLocation: () => ({ pathname: '/' }),
      useNavigate: () => mockNavigate,
    };
  },
  { virtual: true }
);

jest.mock('./utils/auth', () => ({
  clearAuthStorage: jest.fn(),
  fetchCurrentUserProfile: jest.fn(),
  getAccessToken: jest.fn(() => ''),
  getApiBaseUrl: jest.fn(() => 'https://api.example.test'),
  isAuthenticated: jest.fn(() => false),
  requestKakaoLogin: jest.fn(),
  storeAuthResponse: jest.fn(),
}));

import App from './App';

test('renders the login page for signed-out users', () => {
  render(<App />);
  expect(screen.getByText('반갑습니다!')).toBeInTheDocument();
  expect(screen.getByText('간편 로그인')).toBeInTheDocument();
});
