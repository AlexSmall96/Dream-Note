# Dream Note

![CI](https://github.com/AlexSmall96/Dream-Note/actions/workflows/ci.yml/badge.svg)

Dream Note is an AI-assisted dream journal app. Users can:
- Record dreams, with automatic AI title and theme generation. 
- View dreams chronologically or by theme.
- Generate customizable, AI dream analysis. 

This project is actively in development. 

Current focus: Frontend styling and testing
## 🌐 Live Site
[https://dream-note-uh6p.onrender.com/](https://dream-note-uh6p.onrender.com/)

**Note:** Mock versions of AI-assisted features are currently being used to minimize costs while the project is in development.

## 📖 Repository
[https://github.com/AlexSmall96/Dream-Note](https://github.com/AlexSmall96/Dream-Note)

## 👤 Author
Alex Small | [GitHub](https://github.com/AlexSmall96) | [LinkedIn](https://www.linkedin.com/in/alex-small-a8977116b/)

## 🔍 Key Features

## 💻 Tech Stack
| Backend | Frontend | Database | Testing | Other Tools |
| :------:|:------: | :------: | :------: | :------: |
| Node.js |   React      | MongodDB          | Vitest           |  GitHub       |  
| Express |   Next.js      | Mongoose          | React Testing Library          | Postman        |  
| TypeScript  |  TailwindCSS       |          |  Mock Service Worker         |   lucidchart      |  
|  |         |          |    Supertest       |  dbdiagram       |  

## 🔧 Architecture
### 🗃️ Database Schema
The below diagram was used to model the database schema.
Descriptions of the database tables and fields are as follows:

- **Users:** Contains User's login data.
- **Dreams:** Dreams the user will record. Contains description, date, and optional title, notes, and AI analysis. Related to the User model via a many to one relationship.
- **Themes:** Themes related to dream, either chosen by the user or AI generated. Related to the Dream model via a many to one relationship.

![Database Schema](documentation/database/db-diagram.png)
## 🧪 Testing
Manual testing is detailed fully in [TESTING.MD](TESTING.MD)

## 🔒 Security Considerations

## 	🤖 Use of AI During Development

## 📈 Future Improvements

## 💻 Setup

## 🤝 Credits
### Courses
### APIs
- The [Open AI API](https://openai.com/api) was used to generate dream analysis in production. A mock version was used during development to minimize costs. 
### Code

Code was taken from/inspired by the below articles. Whenever the code is used, it is referenced as a comment.

- Next.js and Express mono-repo setup: https://codezup.com/expressing-your-node-js-app-with-express-typescript-and-next-js/

- Authentication middleware: https://www.xjavascript.com/blog/express-auth-middleware-typescript/

- Dream Interface: https://www.slingacademy.com/article/mongoose-define-schema-typescript/

- Validate and send to an email address https://medium.com/@elijahechekwu/sending-emails-in-node-express-js-with-nodemailer-gmail-part-1-67b7da4ae04b
