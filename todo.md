**_ Future Considerations _**

- Consider using a message queuing system for the email service.
- Implement service trace db persistence.

**_ Bug Fixes _**

- Prisma or Supabase time is one hour behind
- Refactor prisma client queries using a more declarative approach

**_ Itenary _**

- Write tests for auth flow

  - authSignUpService: Write unit tests for successful signup and handling potential errors (e.g., duplicate email).
  - authSignInService: Write test to ensure successful login with valid credentials, handling invalid credentials/user not found, and edge cases (e.g., locked accounts).
  - authPasswordResetRequest service: Test successful reset request generation, handling invalid user email, and potential errors (e.g., sending emails).

- Refactor access token delivery to cookies or encrypt data transfer from api to client

- Staff Creation
- Student Admission
- Course Upload and Delivery
