import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LoginInput from '../components/LoginInput';

describe('LoginInput', () => {
  it('renders LoginInput with Email', () => {
    render(<LoginInput margin='dense' fullWidth required label='Email' type='email' value='email' />);
    expect(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        hidden: true,
      }),
    ).toBeInTheDocument();
  });
  it('renders LoginInput with Name', () => {
    render(<LoginInput margin='dense' fullWidth required label='Name' type='text' value='name' />);
    expect(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        hidden: true,
      }),
    ).toBeInTheDocument();
  });
  it('renders LoginInput with Password', () => {
    render(<LoginInput variant='outlined' margin='dense' fullWidth required label='Password' type='password' value='password' />);
    expect(
      screen.getByRole('button', {
        name: /toggle password visibility/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/password \*/i)).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it('renders TextField when type is not password', () => {
    const { getByLabelText } = render(<LoginInput label="Username" type="text" />);
    const inputElement = getByLabelText('Username');
    expect(inputElement).toBeInTheDocument();
  });

  it('toggles password visibility when clicking on the visibility icon', () => {
    render(<LoginInput label="Password" type="password" />);

    // Find the IconButton element using label text
    const visibilityIcon = screen.getByLabelText('toggle password visibility');
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.type).toBe('password');

    // Simulate a click on the IconButton
    fireEvent.click(visibilityIcon);

    // Ensure password input element is present
    expect(passwordInput).toBeInTheDocument();

    // Assert that the password visibility state has changed
    expect(passwordInput.type).toBe('text');
  });
});
