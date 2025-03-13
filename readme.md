Here’s the `README.md` file content for you to copy and paste:

```markdown
# Simple Social Media App

## What is this project?
This is a basic social media app where users can sign up, log in, and create posts. It has a backend (server) built with Node.js and a frontend (web pages) built with HTML, CSS, and JavaScript. Think of it as a mini version of something like Facebook!

- **Backend**: Handles user accounts and posts using a database.
- **Frontend**: Lets users interact with the app through a browser.

---

## How to Set It Up
Follow these steps to get the project running on your computer.

### What You Need First
1. **Node.js**: This runs the backend. Download it from [nodejs.org](https://nodejs.org/).
2. **MySQL**: This stores the data (users and posts). Install it from [mysql.com](https://www.mysql.com/) or use a tool like XAMPP.
3. **A Code Editor**: Like Visual Studio Code (optional but helpful).

### Project Structure
```
project/
├── backend/
│   └── server.js       // The server code
├── frontend/
│   ├── index.html     // Home page (posts)
│   ├── login.html     // Login page
│   ├── register.html  // Register page
│   ├── styles.css     // Styles for the pages
│   └── script.js      // Actions for the pages
└── README.md          // This file
```

### Step 1: Set Up the Backend
1. **Open a Terminal**:
   - On Windows: Use Command Prompt or PowerShell.
   - On Mac/Linux: Use Terminal.
2. **Go to the Backend Folder**:
   ```
   cd backend
   ```
3. **Install Dependencies**:
   - These are the libraries the server needs.
   ```
   npm install express mysql2 bcrypt jsonwebtoken cors
   ```
4. **Set Up MySQL**:
   - Start MySQL (e.g., with `mysql -u root -p` and enter your password, `01122001` in this case).
   - Create the database and tables by running this SQL:
     ```sql
     CREATE DATABASE facebook_backend;
     USE facebook_backend;
     CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     CREATE TABLE posts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)
     );
     ```
5. **Start the Server**:
   ```
   node server.js
   ```
   - You should see: `Server listening at http://localhost:3000` and `Connected to MySQL successfully`.
   - If there’s an error, check your MySQL password or database name.

### Step 2: Set Up the Frontend
1. **Install live-server (Optional)**:
   - This makes it easy to view the frontend.
   ```
   npm install -g live-server
   ```
2. **Go to the Frontend Folder**:
   ```
   cd frontend
   ```
3. **Start the Frontend**:
   - With `live-server`:
     ```
     live-server
     ```
   - Or just open `register.html` in your browser (but some features might not work without a server).

---

## How to Use It
1. **Open the App**:
   - Go to `http://localhost:8080/register.html` (or the port `live-server` uses).
2. **Register**:
   - Fill in a username, email, and password, then click "Register".
   - If it works, you’ll see "User registered successfully" and go to the login page.
3. **Log In**:
   - Use your email and password to log in.
   - If successful, you’ll go to the home page (`index.html`).
4. **Create Posts**:
   - Type something in the box and click "Post".
   - Your posts will show up below.
5. **Log Out**:
   - Click "Logout" to return to the login page.

---

## Troubleshooting
- **"Error registering" or "Error logging in"**:
  - Check if the backend is running (`node server.js`).
  - Make sure MySQL is running and the database/tables exist.
  - Open the browser’s developer tools (F12), go to "Network", and look at the response for clues.
- **Posts not showing**:
  - Ensure you’re logged in (token is saved).
  - Check the backend terminal for errors.

---

## What’s Next?
- Add more features like deleting posts or editing profiles.
- Make the design prettier with more CSS.
- Use a stronger secret key for `JWT_SECRET` in `server.js`.

---

Made by Malikabna on March 13, 2025.
```
