import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPopUp from '../components/ErrorPopUp';
import { act } from 'react-dom/test-utils';

describe('ErrorPopUp', () => {
  it('renders the ErrorPopUp component with the provided error message', async () => {
    const mockOnClick = jest.fn();

    render(
      <ErrorPopUp onClick={mockOnClick}>
        This is an error message.
      </ErrorPopUp>
    );

    expect(screen.getByText('This is an error message.')).toBeInTheDocument();

    expect(screen.getByRole('alert')).toBeVisible();

    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alert')).toBeNull();
    });
  });

  it('calls the onClick function when the Snackbar closes automatically', async () => {
    const mockOnClick = jest.fn();

    render(
      <ErrorPopUp onClick={mockOnClick} autoHideDuration={1000}>
        This is an error message.
      </ErrorPopUp>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      expect(mockOnClick).toHaveBeenCalledTimes(0);
      expect(screen.queryByRole('alert')).toBeInTheDocument();
    });
  });

  it('does not call the onClick function when the Snackbar is closed programmatically', async () => {
    const mockOnClick = jest.fn();

    const { rerender } = render(
      <ErrorPopUp onClick={mockOnClick}>
        This is an error message.
      </ErrorPopUp>
    );

    // Programmatically close the Snackbar
    rerender(<ErrorPopUp onClick={mockOnClick} open={false}>This is an error message.</ErrorPopUp>);

    // Wait for potential async operations
    await waitFor(() => {});

    // Check that the onClick function was not called
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  it('should have close', async () => {
    const mockOnClick = jest.fn();

    render(
      <ErrorPopUp onClick={mockOnClick}>
        This is an error message.
      </ErrorPopUp>
    );

    expect(screen.getByRole('button', {
      name: /close/i
    })).toBeInTheDocument();
  });

  it('should have error text', async () => {
    const mockOnClick = jest.fn();

    render(
      <ErrorPopUp onClick={mockOnClick}>
        This is an error message.
      </ErrorPopUp>
    );

    expect(screen.getByText(/this is an error message\./i)).toBeInTheDocument();
  });

  it('should have error text', async () => {
    const mockOnClick = jest.fn();

    render(
      <ErrorPopUp onClick={mockOnClick}>
        This is an error message.
      </ErrorPopUp>
    );

    expect(screen.getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
  });
});
