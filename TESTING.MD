# Testing
This document covers all aspects of testing that were carried out to ensure the code was functional and executed as expected. The main method of testing was automated testing using vitest. Additional testing frameworks used were:
- Backend:
    - Supertest
    - Mailslurp

- Frontend:
    - React Testing Library
    - Mock Service Worker

Manual testing was used to test features not covered by automated testing. This document details my decision process with regards to which method to use.

## Backend
The below table summarizes the API endpoints and their automated test coverage, along with any aspects that need to be tested manually.

- ✔️ Fully covered
- ➖ Partially covered

Model | Request Type       |URL | Automated Test Coverage   |  Remaining Testing (if any)
:----:|:-------: | :-------------------:|:--------------------------:| :------------------------: 
Users |<span style='color:orange; font-weight: bold'>POST</span>    |/signup              |  ✔️                        |
Users |<span style='color:orange; font-weight: bold'>POST</span>        |/login               |  ✔️                        |
Users |<span style='color:orange; font-weight: bold'>POST</span>       |/logout              |  ✔️                        |
Users |<span style='color:orange; font-weight: bold'>POST</span>       |/sendOTP            |  ➖                        | Verification of email delivery.              
Users |<span style='color:purple; font-weight: bold'>PATCH</span>      |/update              |  ✔️                        |
Users |<span style='color:red; font-weight: bold'>DELETE</span>          |/delete              |  ✔️                        |
Dreams|<span style='color:orange; font-weight: bold'>POST</span>          |/log                 |  ➖                        | Manual testing of real AI theme & title generation.
Dreams|<span style='color:orange; font-weight: bold'>POST</span>          | /analysis            |  ➖                        | Manual testing of real AI dream analysis.
Dreams|<span style='color:green; font-weight: bold'>GET</span>          |/     |  ✔️                        |
Dreams|<span style='color:green; font-weight: bold'>GET</span>          |/view/:id     |  ✔️              |
Dreams|<span style='color:purple; font-weight: bold'>PATCH</span>           |/update/:id        |  ➖                        | Manual testing of real AI theme & title generation.
Dreams|<span style='color:red; font-weight: bold'>DELETE</span>          |/delete/:id       |  ✔️                        |
Themes|<span style='color:green; font-weight: bold'>GET</span>           |/            |✔️
Themes|<span style='color:red; font-weight: bold'>DELETE</span>          |/delete/:id            |✔️
