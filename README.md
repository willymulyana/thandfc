# Thought&Function Full-stack assessment

## Instructions

This repo contains two separate projects. This isn't a mono-repo so it's best to open each folder in a separate IDE. We recommend VSCode with prettier and eslint plugins installed.

Both projects contain README files with instructions on how to setup and run locally.

<br />

## Tasks

In this assessment you will build an appointment booking app by fixing the backend code and implementing the frontend code. Authentication has been removed and you can ignore it for this assessment.

<br />

### Task 1 - Fix the backend

The backend contains unit and e2e tests that are failing because the resolver and services haven't been completed. Your task is to implement the resolver and service logic so that the tests pass.

<br />

- 1a. As a user, I can fetch available slots for all doctors

  - Generate slots based on a doctors availability. The date-fns library will help you!
  - Slots should be 15 minutes long
  - You'll need to decide out how best to add doctors to the database for dev and testing purposes

- 1b. As a user, I can book an appointment
  - Slot's can only be booked once

<br />

Read core-api/README.md for instruction on how to setup, run, and add migrations.

<br />

### Task 2 - Implement the frontend

Implement the following user stories by continuing the code started in `src/views/appointments`:

- 2a. As a user, I can view available slots and select one

  - The SlotSelector is there to help you render a calendar and slots and shouldn't need modifying but you can if you want or if there's a problem with it.

- 2b. As a user, I can book an appointment and include details with my booking
  - Use react-hook-form to implement the booking form

<br />

For extra marks, make the UI look pretty.

Read webapp/README.md for instructions on how to run the solution and how to use GraphQL Codegen.

<br />

# Review process

## Uploading your assessment

- push this to your GitHub and add sinn1 as a reviewer
- create a PR for each task where the base is the previous task
- update this README.MD with your total time taken
- 

## Marking

For candidate:
- total time taken: around 36 hours, in 3 days ... this is short answer :D kindly check some remarks below, thanks!

For reviewer 
  - number of backend unit tests passing
  - frontend integrated with api
  - followed existing patterns
  - introduced or improved patterns
  - introduced or improved utils or helpers
  - UI is clean and follows best practices
  - UI implemented following a clear pattern
  - UX decisions follow best practices
  
Remarks from test taker: Willy ( willymulyana@[gmail, yahoo].com / +6281214059889 )
- I receive the test on Tuesday 31 January 2023 8 PM West Indonesian Time, as still working for current company I didn't have time until Thursday PM, can focus and start making changes since Friday as taking day off :D
- Assestment/test wise, almost all is new for me :D especially the stack (Nest, Postgres, Next) ... but essentially I managed to understand the tasks with idea to solve it
- During the process I learn many things: the stack, unit/e2e test from backend side .. and more! All is from new things so I learn 'what', 'how' .. chatGPT really aid well, understand why Google fear it :D
- I think I managed to solve assigned tasks, all test have success result ... frontend implemented with also polish the UI, still room for improvements

