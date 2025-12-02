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
The project followed an agile methodology, with n distinct sprints . Throughout, a kanban board was used to plan and track progress.
![Initial Kanban Board](documentation/methodology/kanban1.png)

### Sprint 1: Planning and Initial Documentation
This phase consisted of initial brainstorming, where the basics of the idea were beginning to be fleshed out. During this phase, the tech stack that would be most suitable for the project purpose and my goals was decided on. Documentation was useful, with some process flows being created to map out some of the more complex processes involved in the site, as well as a database diagram, which helped confirm details of the database schema.
### Sprint 2: Backend API
The API for this site was written in [Node.js](https://nodejs.org/en) using Typescript. The [Express](https://expressjs.com/) framework was used to create all the HTTP endpoints (users, dreams, themes). [MongoDB](https://www.mongodb.com/) was used for the database, along with the [mongoose.js](https://mongoosejs.com/) object modeling framework. While the API was being developed, [Postman](https://www.postman.com/) was used to test HTTP endpoints.

HTTP testing in postman

User endpoints               | Dream and Theme endpoints
:-------------------------:| :-------------------------: 
![](documentation/methodology/postman-users.png)              |![](documentation/methodology/postman-all.png)   | 

### Sprint 3: Backend Testing
### Sprint 4: Frontend Functionality
### Sprint 5: Frontend Styling
### Sprint 6: Frontend tesintg
### Sprint 7: Remaining Documentation

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
    - Postman
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

- Authentication middleware: https://www.xjavascript.com/blog/express-auth-middleware-typescript/

- Dream Interface: https://www.slingacademy.com/article/mongoose-define-schema-typescript/

- Validate and send to an email address https://medium.com/@elijahechekwu/sending-emails-in-node-express-js-with-nodemailer-gmail-part-1-67b7da4ae04b
