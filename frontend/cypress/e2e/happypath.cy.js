/* eslint-disable no-undef */
describe('user happy path user 1', () => {
  it('should navigate to the home screen successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  });
  it('should navigate to the register screen successfully', () => {
    cy.get('button[name="Register"]').click();
    cy.url().should('include', 'localhost:3000/register');
  });
  it('should register a new user successfully', () => {
    cy.get('input[name="Name"]').type('Admin1');
    cy.get('input[name="Email"]').type('admin@admin.com');
    cy.get('input[name="Password"]').type('123456');
    cy.get('input[name="Confirm Password"]').type('123456');
    cy.get('button[name="Register Account"]').click();
  });
  it('should navigate to the landing screen successfully', () => {
    cy.url().should('include', 'localhost:3000/');
    cy.get('button[name="Switch to hosting"]').click();
  });
  it('should navigate to the hostings screen successfully', () => {
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should create new listing successfully', () => {
    cy.get('button[name="Add Listing"]').click();
    cy.get('input[name="Address"]').type('1 Kensington Street, Kensington, NSW, 2032, Australia');
    cy.get('input[name="Title"]').type('UNSW');
    cy.get('button[name="Next"]').click();
    cy.get('input[name="Amount"]').type('100');
    cy.get('input[name="Property Type"]').type('University');
    cy.get('label[name="Thumbnail"]').click().selectFile('./unsw.jpeg');
    cy.wait(1000);
    cy.get('button[name="Next"]').click();
    cy.get('input[name="Bathrooms"]').type('2');
    cy.get('input[name="Bedrooms"]').type('2');
    cy.get('input[name="Beds"]').type('2');
    cy.get('input[name="Amenities"]').type('2');
    cy.get('button[name="Next"]').click();
    cy.get('input[name="Amenities 1"]').type('Car Park');
    cy.get('input[name="Amenities 2"]').type('BBQ');
    cy.get('button[name="Save changes"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should edit listing successfully', () => {
    cy.get('button[name="Listing Card 1 edit"]').click();
    cy.get('input[name="Address"]').type('1 Kensington Street, Kensington, NSW, 2032, Australia');
    cy.get('input[name="Title"]').type('UNSW Edit');
    cy.get('input[name="Amount"]').type('100');
    cy.get('input[name="Property Type"]').type('University');
    cy.get('label[name="Thumbnail"]').click().selectFile('./unsw2.png');
    cy.wait(1000);
    cy.get('button[name="Next"]').click();
    cy.get('input[name="Bathrooms"]').type('2');
    cy.get('input[name="Bedrooms"]').type('2');
    cy.get('input[name="Beds"]').type('2');
    cy.get('input[name="Amenities"]').type('2');
    cy.get('input[name="Images"]').type('1');
    cy.get('button[name="Next"]').click();
    cy.get('input[name="Amenities 1"]').type('Car Park');
    cy.get('input[name="Amenities 2"]').type('BBQ');
    cy.get('label[name="Images 1"]').selectFile('./unsw.jpeg');
    cy.wait(1000);
    cy.get('button[name="Save changes"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should publish listing successfully', () => {
    cy.get('button[name="Listing Card 1 publish"]').click();
    cy.get('[class*="start-date"]').click().type('01/01/2024');
    cy.get('[class*="end-date"]').click().type('30/01/2024');
    cy.get('button[name="Publish"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should unpublish listing successfully', () => {
    cy.get('button[name="Listing Card 1 unpublish"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should publish listing successfully again', () => {
    cy.get('button[name="Listing Card 1 publish"]').click();
    cy.get('[class*="start-date"]').click().type('01/01/2024');
    cy.get('[class*="end-date"]').click().type('30/01/2024');
    cy.get('button[name="Publish"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/dashboard');
  });
  it('should logout successfully', () => {
    cy.get('button[name="Logout"]').click();
    cy.url().should('include', 'localhost:3000/');
  });
  it('should login successfully', () => {
    cy.get('button[name="Login"]').click();
    cy.get('input[name="Email"]').type('admin@admin.com');
    cy.get('input[name="Password"]').type('123456');
    cy.get('button[name="Login Account"]').click();
  });
  it('should logout successfully again', () => {
    cy.get('button[name="Logout"]').click();
  });
});

describe('user happy path user 2', () => {
  it('should navigate to the home screen successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  });

  it('should navigate to the register screen successfully', () => {
    cy.get('button[name="Register"]').click();
    cy.url().should('include', 'localhost:3000/register');
  });

  it('should register a new user successfully', () => {
    cy.get('input[name="Name"]').type('Admin2');
    cy.get('input[name="Email"]').type('admin2@admin.com');
    cy.get('input[name="Password"]').type('123456');
    cy.get('input[name="Confirm Password"]').type('123456');
    cy.get('button[name="Register Account"]').click();
  });

  it('should navigate to the landing screen successfully', () => {
    cy.url().should('include', 'localhost:3000/');
  });

  it('should book listing successfully', () => {
    cy.get('div[name="Listing Card 1"]').click();
    cy.wait(1000);
    cy.get('button[name="Book Btn"]').click();
    cy.get('[class*="start-date"]').click().type('10/01/2024');
    cy.get('[class*="end-date"]').click().type('20/01/2024');
    cy.get('button[name="Book"]').click();
    cy.get('button[name="Confirm Booking"]').click();
  });

  it('should logout successfully', () => {
    cy.get('button[name="Logout"]').click();
    cy.url().should('include', 'localhost:3000/');
  });

  it('should login successfully', () => {
    cy.get('button[name="Login"]').click();
    cy.get('input[name="Email"]').type('admin@admin.com');
    cy.get('input[name="Password"]').type('123456');
    cy.get('button[name="Login Account"]').click();
  });

  it('should navigate to the dashboard screen successfully', () => {
    cy.url().should('include', 'localhost:3000/');
    cy.get('button[name="Switch to hosting"]').click();
  });

  it('should accept booking successfully', () => {
    cy.url().should('include', 'localhost:3000/dashboard');
    cy.get('button[name="Listing Card 1 viewing"]').click();
    cy.wait(1000);
    cy.get('button[name="Accept"]').click();
  });

  it('should logout successfully', () => {
    cy.get('button[name="Logout"]').click();
    cy.url().should('include', 'localhost:3000/');
  });
});

describe('user happy path review', () => {
  it('should navigate to the home screen successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  });

  it('should login successfully', () => {
    cy.get('button[name="Login"]').click();
    cy.get('input[name="Email"]').type('admin2@admin.com');
    cy.get('input[name="Password"]').type('123456');
    cy.get('button[name="Login Account"]').click();
  });
  it('should navigate to the landing screen successfully', () => {
    cy.url().should('include', 'localhost:3000/');
  });
  it('should review listing successfully', () => {
    cy.get('div[name="Listing Card 1"]').click();
    cy.wait(1000);
    cy.get('button[name="Review"]').click();
    cy.get('input[name="Comment"]').type('Bad');
    cy.get('button[name="Review Btn"]').click();
  });
  it('should logout successfully again', () => {
    cy.get('button[name="Logout"]').click();
    cy.url().should('include', 'localhost:3000');
  });
});
