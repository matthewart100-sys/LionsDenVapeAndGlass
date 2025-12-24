let isSignupMode = false;

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("rememberMe") === "true") {
        document.getElementById("Username").value = localStorage.getItem("username") || "";
        document.getElementById("Password").value = localStorage.getItem("password") || "";
        document.getElementById("rememberMe").checked = true;
    }
});

/* MAIN HANDLER */
function handleAuth() {
    isSignupMode ? signupUser() : loginUser();
}

/* SIGNUP MODE */
function openSignup() {
    isSignupMode = true;

    document.querySelector(".login-title").innerText = "SIGN UP";
    document.getElementById("authButton").innerText = "CREATE ACCOUNT";
    document.getElementById("ConfirmPassword").style.display = "block";
}

/* LOGIN MODE */
function loginUser() {
    const username = document.getElementById("Username").value;
    const password = document.getElementById("Password").value;
    const remember = document.getElementById("rememberMe").checked;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (!users[username] || users[username] !== password) {
        alert("Invalid username or password");
        return;
    }

    if (remember) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", true);
    }

    alert("Login successful!");
    closePopup();
}

/* CREATE ACCOUNT */
function signupUser() {
    const username = document.getElementById("Username").value;
    const password = document.getElementById("Password").value;
    const confirm = document.getElementById("ConfirmPassword").value;

    if (!username || !password) {
        alert("All fields are required");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
        alert("Username already exists");
        return;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! You can now log in.");

    resetToLogin();
}

/* RESET BACK TO LOGIN */
function resetToLogin() {
    isSignupMode = false;

    document.querySelector(".login-title").innerText = "LOGIN";
    document.getElementById("authButton").innerText = "LOGIN";
    document.getElementById("ConfirmPassword").style.display = "none";
}

/* MODAL CONTROLS */
function openPopup() {
    document.getElementById("popupModal").style.display = "grid";
}

function closePopup() {
    document.getElementById("popupModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const rememberMeCheckbox = document.getElementById("rememberMe");

    if (document.cookie.includes("rememberMe=true")) {
        document.getElementById("Username").value = getCookie("username");
        document.getElementById("Password").value = getCookie("password");
        rememberMeCheckbox.checked = true;
    }
});

/* LOGIN BUTTON HANDLER */
function submitToPython() {
    const username = document.getElementById("Username").value;
    const password = document.getElementById("Password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!username || !password) {
        alert("Please enter a username and password");
        return;
    }

    if (rememberMe) {
        setCookie("username", username, 7);
        setCookie("password", password, 7);
        setCookie("rememberMe", "true", 7);
    } else {
        setCookie("username", "", -1);
        setCookie("password", "", -1);
        setCookie("rememberMe", "", -1);
    }

    console.log("Username:", username);
    console.log("Password:", password);

    closePopup();
}

/* SIGNUP REDIRECT */
function openSignup() {
    window.location.href = "signup.html";
}

/* COOKIE HELPERS */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = decodeURIComponent(document.cookie).split(";");
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

/* MODAL CONTROLS */
function openPopup() {
    document.getElementById("popupModal").style.display = "grid";
}

function closePopup() {
    document.getElementById("popupModal").style.display = "none";
}

function openSignup() {
    console.log("Signup clicked");
    window.location.href = "signup.html";
}

function submitLogin() {
    const username = document.getElementById("Username").value.trim();
    const password = document.getElementById("Password").value.trim();

    // Basic validation (required fields)
    if (username === "" || password === "") {
        alert("Please enter both username and password");
        return;
    }

    // OPTIONAL: remember-me logic (already exists)
    const rememberMe = document.getElementById("rememberMe").checked;
    if (rememberMe) {
        setCookie("username", username, 7);
        setCookie("password", password, 7);
        setCookie("rememberMe", true, 7);
    }

    // ✅ LOGIN SUCCESS → hide modal immediately
    closePopup();

    // ✅ Grant site access (example)
    document.body.classList.add("authenticated");
}