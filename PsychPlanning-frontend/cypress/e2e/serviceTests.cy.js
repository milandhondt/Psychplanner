describe('Service', () => {
  beforeEach(() => {
    cy.login('karine.samyn@hogent.be', '12345678');
    
    cy.visit('http://localhost:5173/mijn-profiel/mijn-services');
  });

  it('Toont alle services', () => {
    cy.visit('http://localhost:5173/mijn-profiel/mijn-services');
    cy.get('[data-cy=service_lijst]').should('exist');
    cy.get('[data-cy=service_service]').should('exist');
    
    cy.get('[data-cy=service_service]').each((service) => {
      cy.wrap(service).find('[data-cy=service_naam]').should('not.be.empty');
      cy.wrap(service).find('[data-cy=service_duur]').should('not.be.empty');
      cy.wrap(service).find('[data-cy=service_prijs]').should('not.be.empty');
    });
  });
      
  it('Laadt services correct', () => {
    cy.get('[data-cy=service_lijst]').should('exist');
    cy.get('[data-cy=service_service]').should('have.length.greaterThan', 0);
  });
        
  it('Verwijdert een service', () => {
    cy.get('[data-cy=btn_delete]').first().click({ force: true });
    cy.contains('Service verwijderd').should('exist');
  });
  
  it('Navigeert naar de service-lijst na toevoegen', () => {
    cy.get('#naam_input_service').type('Nieuwe service', { force: true });
    cy.get('#duur_input').type('30', { force: true });
    cy.get('#prijs_input').type('20', { force: true });
    cy.get('#beschrijving_input').type('Beschrijving van de service.', { force: true });
    cy.get('#btn_submit_service').click({ force: true });
    
    cy.url().should('include', '/mijn-profiel/mijn-services');
  });
  
  it('Reset formulier bij annuleren', () => {
    cy.get('#naam_input_service').type('Testservice', { force: true });
    cy.get('#btn_cancel').click({ force: true });
    cy.get('[data-cy=naam_input_service]').should('have.value', '');
  });

  it('Toont correcte gegevens voor elke service', () => {
    cy.get('[data-cy=service_service]').each((service) => {
      cy.wrap(service).find('[data-cy=service_naam]').should('not.be.empty');
      cy.wrap(service).find('[data-cy=service_duur]').should('not.be.empty');
      cy.wrap(service).find('[data-cy=service_prijs]').should('not.be.empty');
      cy.wrap(service).find('[data-cy=service_beschrijving]').should('not.be.empty');
    });
  });
  
  it('Reset formulier na succesvol toevoegen', () => {
    cy.get('#naam_input_service').type('Service reset test', {force: true});
    cy.get('#duur_input').type('15', {force: true});
    cy.get('#prijs_input').type('10', {force: true});
    cy.get('#beschrijving_input').type('Een korte test.', {force: true});
    cy.get('#btn_cancel').click({force: true});
    
    cy.get('#naam_input_service').should('have.value', '');
    cy.get('#duur_input').should('have.value', '');
    cy.get('#prijs_input').should('have.value', '');
    cy.get('#beschrijving_input').should('have.value', '');
  });
});
