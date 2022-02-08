# quiz-manager-nodeJS

## Basics
It is a REST API for a quiz app where users can create and attempt quizzes. The users should also be able to see some basic stats about their quiz attempts.

## Tech stack
  - This project is completed using below tech stack
    - [Node.js](https://nodejs.org).
    - [MongoDB](https://www.mongodb.com/).
    - [Mongoose ODM](https://mongoosejs.com).

## Acceptance criteria
  - Users can create an account
  - Users can create their own quiz with multiple questions & answers.
  - Users can manipulate own quizzes which are not published.
  - Users can publish quizzes. 
  - Users cannot manipulate other users' quiz templates.
  - Users can attempt other users' published quizzes as many times as they choose.
  - Users can view basic stats on quiz attempts/completion/scores/etc..
  - Quiz name is unique.
  - Quizzes must contain at least 1 question and should support varying numbers of questions.
  - Questions must have a non-empty question and a non-empty answer.
  - Each submitted quiz should have it's questions marked correct or incorrect based on the predefined answers.
  
## Important
  - Authentication token will expire in 1 hour after login, kindly submit the quiz before that.(For Now, in upcoming changes we will change this also)

## What new?
- We are added negative marking option in this.
- We are added date filters for report and quiz.


## What next?
- We will add dynamic scoring questions.?


## How to start on local machine.
- Clone this repository.
- Run "yarn install".
- Add a valid monogoDB connection string to nodemon.json.
- Run "yarn start:dev".
- In ".\doc\postman" there is postman collection and environment kindly import that to postman.
