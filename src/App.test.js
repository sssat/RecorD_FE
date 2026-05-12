import { render, screen } from '@testing-library/react';

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
      useNavigate: () => jest.fn(),
    };
  },
  { virtual: true }
);

import App from './App';

test('renders main shell heading', () => {
  render(<App />);
  expect(screen.getByText('메인페이지')).toBeInTheDocument();
});
