# User API (Yondu)

This API demonstrates a basic user management system implementing authentication, CRUD functions for a users table.

<br>

## What you will need

---

- A running instance of MySQL
- Node.js installed
- Package manager such as NPM
- Postman

<br>

## Installation

---

1. Clone project into your device
   ```bash
   git clone https://github.com/kirbyclopez/user-api.git
   ```
2. Navigate to project folder, then install the needed packages
   ```bash
   cd user-api
   npm install
   ```
3. Modify the DATABASE_URL variable in the .env file to connect the app to a running MySQL server
   ```bash
   "mysql://[user]:[pass]@[host]:[port]/user_api_dev"
   ```
   Replace the values for user, pass, host, and port. Sample:
   ```bash
   "mysql://root:root@localhost:3306/user_api_dev"
   ```
4. Migrate the database for the development environment
   ```bash
   npm run db:migrate
   ```
5. Run the project
   ```bash
   npm run dev
   ```

<br>

## Testing with Jest

1. Modify the DATABASE_URL variable in the .env.test file to connect the app to a running MySQL server
   ```bash
   "mysql://[user]:[pass]@[host]:[port]/user_api_test"
   ```
   Replace the values for user, pass, host, and port. Sample:
   ```bash
   "mysql://root:root@localhost:3306/user_api_test"
   ```
2. Run the test
   ```bash
   npm run test
   ```

<br>

## Testing with Postman

---

For the documentation of this API, please use this [link](https://documenter.getpostman.com/view/8930057/2s8ZDczL2x).

You can import the postman collection file inside the root directory of this project into your Postman app.

Filename: **User API (Yondu).postman_collection.json**

<br>

### Postman Environment Variables

The following variables are needed in the environment of Postman:

- accessToken
- refreshToken
- userId (optional, you can manually input the userId in the URL)
- delUserId (optional, you can manually input the userId in the URL)
