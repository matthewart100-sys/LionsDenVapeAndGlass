document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    if (!terms) {
        alert("You must agree to the Terms of User");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    // Demo storage (frontend only)
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
        alert("Username already exists");
        return;
    }

    users[username] = { name, email, password };
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "User Login.html";
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page refresh

    // OPTIONAL: validation logic here
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    // TODO: send signup data to backend later

    // ✅ Redirect back to login page
    window.location.href = "index.html";
});