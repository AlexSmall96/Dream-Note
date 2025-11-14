# Dream Note

## Live Site
[https://dream-note-uh6p.onrender.com//](https://dream-note-uh6p.onrender.com/)
## Repository
[https://github.com/AlexSmall96/Dream-Note](https://github.com/AlexSmall96/Dream-Note)
## Author
Alex Small | [GitHub](https://github.com/AlexSmall96) | [LinkedIn](https://www.linkedin.com/in/alex-small-a8977116b/)
## Table of Contents

## Testing 

## Project Goals and Planning

### Process Flow Diagrams
To plan the end to end processes involved in the site, the following diagrams were created.
#### Home Page
![Home Page](documentation/process-flows/HomePage.png)
#### Log New Dream
![Log New Dream](documentation/process-flows/LogNewDream.png)
#### View Dreams Page
![View Dreams Page](documentation/process-flows/ViewDreamsPage.png)
### Database Schema
The below diagram was used to model the database schema.
Descriptions of the database tables and fields are as follows:

- **Users:** Contains User's login data.
- **Dreams:** Dreams the user will record. Contains description, date, and optional title, notes, and AI analysis. Related to the User model via a many to one relationship.

- **Themes:** Themes related to dream, either chosen by the user or AI generated. Related to the Dream model via a many to one relationship.

![Database Schema](documentation/database/db-diagram.png)
### Methodology



## UX

### User Stories

### Target Audience

### Wireframes

### Fonts

### Images

## Programming Languages, Frameworks, and Libraries used

- TypeScript    
- Backend 
    - Node.js 
    - Express
- Frontend
    - React
    - Next.js
    - TailwindCSS

## Other technologies used

- Deployment
    - Render
- Development
    - VS code
    - HttpYac
    - GitHub
- Documentation
    - lucidchart
    - dbdiagram
    
## Credits
### Courses
### APIs
### Code

Code was taken from/inspired by the below articles. Whenever the code is used, it is referenced as a comment.

- Next.js and Express mono-repo setup: https://codezup.com/expressing-your-node-js-app-with-express-typescript-and-next-js/

