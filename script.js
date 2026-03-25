// Mobile navigation toggle
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  // Close nav when a link is clicked on mobile
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
    });
  });
}

// Auth page form switching and API integration
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const toggleText = document.getElementById('toggleText');
const authTitle = document.getElementById('authTitle');
const authFeedback = document.getElementById('authFeedback');

const setFeedback = (message, type = 'error') => {
  if (!authFeedback) return;
  authFeedback.textContent = message;
  authFeedback.classList.remove('error', 'success');
  if (message) authFeedback.classList.add(type);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

if (signupForm && loginForm && toggleText && authTitle) {
  let loginMode = false;

  const renderToggle = () => {
    toggleText.innerHTML = loginMode
      ? 'Need a new account? <button type="button" class="text-link" id="toggleAuth">Sign Up</button>'
      : 'Already have an account? <button type="button" class="text-link" id="toggleAuth">Login</button>';

    const toggleAuthBtn = document.getElementById('toggleAuth');
    if (!toggleAuthBtn) return;

    toggleAuthBtn.addEventListener('click', () => {
      loginMode = !loginMode;
      signupForm.classList.toggle('hidden', loginMode);
      loginForm.classList.toggle('hidden', !loginMode);
      authTitle.textContent = loginMode ? 'Welcome back' : 'Create your account';
      setFeedback('');
      renderToggle();
    });
  };

  renderToggle();
}

const submitAuth = async (url, payload, successMessage) => {
  setFeedback('');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Request failed. Please try again.');
    }

    setFeedback(successMessage, 'success');
    window.location.href = 'comingsoon.html';
  } catch (error) {
    setFeedback(error.message || 'Something went wrong. Please try again.');
  }
};

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName')?.value.trim() || '';
    const email = document.getElementById('signupEmail')?.value.trim() || '';
    const password = document.getElementById('signupPassword')?.value || '';

    if (!name || !email || !password) {
      setFeedback('Please fill in all signup fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setFeedback('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFeedback('Password must be at least 6 characters long.');
      return;
    }

    await submitAuth('/signup', { name, email, password }, 'Signup successful! Redirecting...');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim() || '';
    const password = document.getElementById('loginPassword')?.value || '';

    if (!email || !password) {
      setFeedback('Please fill in both login fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setFeedback('Please enter a valid email address.');
      return;
    }

    await submitAuth('/login', { email, password }, 'Login successful! Redirecting...');
  });
}
