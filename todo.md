## Itenary

**_(Features)_**

- Staff Creation - In Progress
- Student Admission
- Course Upload and Delivery

**_(Documentation and Tests)_**

- Update documentation wuth relevant updates
- Write unit tests for all auth services

## Bug Fixes

- Server time is one hour behind
- Refactor reset password to use token instead of link

## Deployment

- Write CI/CD scripts to automate testing

## Server Management

- Persist postgres data volumes inside docker container

## Future Considerations

- Consider using a message queuing system for the email service.
- Implement service trace db persistence.

- Put permissions handler in the handler for controllers

## Staff Onboarding Data

### Background / Residential Information
- stateId  
- lgaId    
- countryId
- zipCode  
- address

### Employment Information
- Job Title
- Department
- Employment Type (Full-Time, Part-Time, Contract, Intern, NYSC)
- Start Date

### Legal Documents
- National ID/Passport Number (nin)
- Tax Identification Number (TIN)

### Education and Work Experience
- Highest Level of Education
- CV
