import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/Register';

describe('Register component', () => {
  it('renders Register component with 2 passwords', () => {
    render(
          <MemoryRouter>
            <Register />
          </MemoryRouter>
    );

    expect(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    const passwordFormControls = screen.getAllByTestId('password-form-control');
    expect(passwordFormControls.length).toBe(2);
  });
  it('renders Register component with 2 textfiel', () => {
    render(
          <MemoryRouter>
            <Register />
          </MemoryRouter>
    );

    expect(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
    ).toBeInTheDocument();
    const textField = screen.getAllByTestId('text-field');
    expect(textField.length).toBe(2);
  });

  it('renders Register component should have name and email', () => {
    render(
          <MemoryRouter>
            <Register />
          </MemoryRouter>
    );
    expect(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
    ).toBeInTheDocument();
  });
});
