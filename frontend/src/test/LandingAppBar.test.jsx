import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageList from '../components/PageList';
import HostedListingView from '../components/HostedListingView';
import EditListing from '../components/EditListing';

describe('LandingAppBar', () => {
  it('renders the "Airbrb" text in PageList', async () => {
    render(
      <MemoryRouter>
        <PageList />
      </MemoryRouter>
    );

    // Use a specific class to target the header element
    const headerText = screen.getAllByTestId('airbrb-landing-app-bar')
    expect(headerText[0]).toBeInTheDocument();
  });

  it('renders the "Airbrb" text in UserListing', async () => {
    render(
      <MemoryRouter>
        <HostedListingView />
      </MemoryRouter>
    );

    // Use a specific class to target the header element
    const headerText = screen.getAllByTestId('airbrb-landing-app-bar')
    expect(headerText[0]).toBeInTheDocument();
  });

  it('renders the "Airbrb" text in EditListing', async () => {
    render(
      <MemoryRouter>
        <EditListing />
      </MemoryRouter>
    );

    // Use a specific class to target the header element
    const headerText = screen.getAllByTestId('airbrb-landing-app-bar')
    expect(headerText[0]).toBeInTheDocument();
  });
});
