# Daily Diet API

## Overview

The Daily Diet API was developed with the purpose of helping users maintain control over the meals they consume. It allows for the registration, viewing, modification, and deletion of meals, as well as user registration, login, and the visualization of metrics related to their meals. The API was developed using the TypeScript language with the Fastify microframework, the Knex query builder, the Zod library for validation, and the Vitest framework for end-to-end testing.

## Features

- **User Registration:** Create a new user.

- **User Identification:** Users are identified across requests.

- **Meal Recording (POST /meals):** Record meals with the following information:
  - Name
  - Description
  - Date and Time
  - Diet Status (within or outside the diet)

- **Meal Editing (PUT /meals/:id):** Modify meal details, including all the attributes mentioned above.

- **Meal Deletion (DELETE /meals/:id):** Delete meal entries.

- **List User Meals (GET /users/meals):** Retrieve a list of all meals associated with a user.

- **View Single Meal (GET /meals/:id):** Get details of a single meal entry.

- **User Metrics (GET /users/metrics):** Retrieve user-specific metrics, including:
  - Total number of registered meals
  - Total number of meals within the diet
  - Total number of meals outside the diet
  - Best sequence of meals within the diet

Users can only perform actions (view, edit, delete) on the meals they have created.

## Getting Started

1. Clone this repository.
2. Install the required dependencies with `npm install`.
3. Run `npm run knex -- migrate:latest` to update the database.
4. Start the API with `npm run dev`.

## API Endpoints

### User Registration (POST /users/register)

- Request:
  ```json
  POST /users/register
  {
    "name": "your_name",
    "email": "your_email"
  }
  ```

- Response (201 Created):

### User Sign In (POST /users/login)

- Request:
  ```json
  POST /users/login
  {
    "email": "your_email"
  }
  ```

- Response (200 OK):

### Meal Recording (POST /meals)

- Request:
  ```json
  POST /meals
  {
    "name": "Meal Name",
    "description": "Meal Description",
    "date": "12/09/2023",
  	"hour": "12:00",
  	"inDiet": true
  }
  ```

- Response (201 Created):

### Meal Editing (PUT /meals/:id)

- Request:
  ```json
  PUT /meals/<Meal UUID>
  {
    "name": "Updated Name",
    "description": "Updated Description",
    "date": "12/09/2023",
  	"hour": "12:00",
  	"inDiet": false
  }
  ```

- Response (200 OK):

### Meal Deletion (DELETE /meals/:id)

- Request:
  ```
  DELETE /meals/<Meal UUID>
  ```

- Response (204 No Content)

### List User Meals (GET /users/meals)

- Request:
  ```json
  GET /users/meals
  ```

- Response (200 OK):
  ```json
  [
    {
      "id": <Meal 1 UUID>,
      "user": <User UUID>,
      "name": "Meal 1",
      "description": "Description 1",
      "datetime": "2023-09-12 12:00",
      "in_diet": 1
    },
    {
      "id": <Meal 2 UUID>,
      "user": <User UUID>,
      "name": "Meal 2",
      "description": "Description 2",
      "datetime": "2023-09-12 18:00",
      "in_diet": 0
    }
  ]
  ```

### View Single Meal (GET /meals/:id)

- Request:
  ```
  GET /meals/<Meal UUID>
  ```

- Response (200 OK):
  ```json
  {
    "id": <Meal 1 UUID>,
    "user": <User UUID>,
    "name": "Meal 1",
    "description": "Description 1",
    "datetime": "2023-09-12 12:00",
    "in_diet": 1
  }
  ```

### User Metrics (GET /users/metrics)

- Request:
  ```
  GET /users/metrics
  ```

- Response (200 OK):
  ```json
  {
  	"mealsCount": 4,
  	"inDietMealsCount": 3,
  	"notInDietMealsCount": 1,
  	"longestInDietMealsStreak": 2
  }
  ```

---

Made with 💜 by Gustavo Fadel.
