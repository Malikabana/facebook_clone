const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

// Redirect if not logged in
if (window.location.pathname.includes('index.html') && !token) {
  window.location.href = 'login.html';
}

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      document.getElementById('message').textContent = data.message || data.error;
      if (response.status === 201) {
        setTimeout(() => (window.location.href = 'login.html'), 1000);
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Error registering';
    }
  });
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      document.getElementById('message').textContent = data.error || 'Login successful';
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setTimeout(() => (window.location.href = 'index.html'), 1000);
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Error logging in';
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
}

// Create Post
const postForm = document.getElementById('postForm');
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (response.status === 201) {
        document.getElementById('content').value = '';
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  });
}

// Fetch and Display Posts
async function fetchPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const posts = await response.json();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.textContent = `${post.content} - ${new Date(post.created_at).toLocaleString()}`;
      postsDiv.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

if (window.location.pathname.includes('index.html')) {
  fetchPosts();
}