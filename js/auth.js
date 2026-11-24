(function () {
  "use strict";

  var USERS_KEY = "scrs_users";
  var SESSION_KEY = "scrs_session";
  var DEMO_ADMIN = { fullName: "Demo Administrator", email: "admin@university.edu", password: "Admin@123", role: "administrator" };
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MIN_PASSWORD_LENGTH = 8;
  var ROLE_LABELS = { student: "Student", administrator: "Administrator" };

  /* ---------- Mock storage (NOT secure: demo only) ---------- */

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function getUsers() {
    var users = readJSON(USERS_KEY, []);
    var hasAdmin = users.some(function (user) { return user.email === DEMO_ADMIN.email; });
    return hasAdmin ? users : [DEMO_ADMIN].concat(users);
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    return readJSON(SESSION_KEY, null);
  }

  /* ---------- UI helpers ---------- */

  function normalizeEmail(value) {
    return value.trim().toLowerCase();
  }

  function setFieldError(input, message) {
    var errorElement = document.getElementById(input.id + "-error");
    errorElement.textContent = message;
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
    return !message;
  }

  function showMessage(form, type, text) {
    var box = form.querySelector(".form-message");
    box.textContent = text;
    box.className = "form-message is-" + type;
    box.hidden = false;
  }

  function clearMessages(form) {
    form.querySelector(".form-message").hidden = true;
    form.querySelectorAll("input[id]").forEach(function (input) { setFieldError(input, ""); });
  }

  function validateEmail(input) {
    var value = input.value.trim();
    if (!value) { return setFieldError(input, "Email address is required."); }
    if (!EMAIL_PATTERN.test(value)) { return setFieldError(input, "Enter a valid email address."); }
    return setFieldError(input, "");
  }

  function initPasswordToggles() {
    document.querySelectorAll(".toggle-password").forEach(function (button) {
      button.addEventListener("click", function () {
        var input = document.getElementById(button.dataset.target);
        var isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";
        button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      });
    });
  }

  /* ---------- FR-1: Student registration ---------- */

  function initSignup(form) {
    var fullName = form.elements.fullName;
    var email = form.elements.email;
    var password = form.elements.password;
    var confirmPassword = form.elements.confirmPassword;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearMessages(form);

      var nameValue = fullName.value.trim();
      var isValid = true;

      if (!nameValue) { isValid = setFieldError(fullName, "Full name is required.") && isValid; }
      else if (nameValue.length < 2) { isValid = setFieldError(fullName, "Enter your full name.") && isValid; }

      isValid = validateEmail(email) && isValid;

      if (!password.value) { isValid = setFieldError(password, "Password is required.") && isValid; }
      else if (password.value.length < MIN_PASSWORD_LENGTH) {
        isValid = setFieldError(password, "Password must be at least " + MIN_PASSWORD_LENGTH + " characters.") && isValid;
      }

      if (!confirmPassword.value) { isValid = setFieldError(confirmPassword, "Please confirm your password.") && isValid; }
      else if (confirmPassword.value !== password.value) {
        isValid = setFieldError(confirmPassword, "Passwords do not match.") && isValid;
      }

      if (!isValid) { return; }

      var emailValue = normalizeEmail(email.value);
      var users = getUsers();
      if (users.some(function (user) { return user.email === emailValue; })) {
        setFieldError(email, "An account with this email already exists.");
        showMessage(form, "error", "Registration failed. Please use a different email address.");
        return;
      }

      users.push({ fullName: nameValue, email: emailValue, password: password.value, role: "student" });
      saveUsers(users);
      form.reset();
      showMessage(form, "success", "Account created successfully! Redirecting you to Sign In…");
      setTimeout(function () { window.location.href = "login.html"; }, 1800);
    });
  }

  /* ---------- FR-2: Login ---------- */

  function initLogin(form) {
    var email = form.elements.email;
    var password = form.elements.password;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearMessages(form);

      var isValid = validateEmail(email);
      if (!password.value) { isValid = setFieldError(password, "Password is required.") && isValid; }
      if (!isValid) { return; }

      var role = form.elements.role.value;
      var emailValue = normalizeEmail(email.value);
      var user = getUsers().find(function (candidate) {
        return candidate.email === emailValue && candidate.password === password.value && candidate.role === role;
      });

      if (!user) {
        showMessage(form, "error", "Incorrect email or password for the selected role.");
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ fullName: user.fullName, email: user.email, role: user.role }));
      showMessage(form, "success", "Login successful. Redirecting…");
      form.querySelector("button[type='submit']").disabled = true;
      setTimeout(function () { window.location.href = "dashboard.html"; }, 700);
    });
  }

  /* ---------- FR-3: Logout and post-login placeholder ---------- */

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }

  function initDashboard() {
    var session = getSession();
    if (!session) {
      window.location.replace("login.html");
      return;
    }
    document.getElementById("user-name").textContent = session.fullName;
    document.getElementById("user-role").textContent = ROLE_LABELS[session.role] || session.role;
    document.querySelectorAll("[data-action='logout']").forEach(function (button) {
      button.addEventListener("click", logout);
    });
  }

  /* ---------- Page bootstrap ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggles();
    var signupForm = document.querySelector("[data-form='signup']");
    var loginForm = document.querySelector("[data-form='login']");
    if (signupForm) { initSignup(signupForm); }
    if (loginForm) { initLogin(loginForm); }
    if (document.getElementById("user-role")) { initDashboard(); }
  });
})();
