import React from 'react';
import { render } from 'react-testing-library';
import App from './App';

describe('App', () => {
  it('renders a title correctly', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#comments-list')).not.toBe(null);
    // expect(container.querySelector('#comments-list').childNodes.length).toBe(2);
  });
});
