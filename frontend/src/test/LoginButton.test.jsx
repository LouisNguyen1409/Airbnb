import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginButton from '../components/LoginButton';

describe('LoginButton', () => {
  it('renders button with Login title', () => {
    const login = jest.fn();
    render(<LoginButton onClick={login}>Login</LoginButton>);
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
  it('renders button with Register title', () => {
    const register = jest.fn();
    render(<LoginButton onClick={register}>Register</LoginButton>);
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });
  it('triggers onClick when clicked', () => {
    const onClick = jest.fn();
    render(<LoginButton onClick={onClick}>onClick</LoginButton>);
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
