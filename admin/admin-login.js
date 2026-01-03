function loginAdmin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("adminLoggedIn", "true");
    window.location.href = "index.html"; // ✅ admin dashboard
  } else {
    alert("Invalid admin credentials");
  }
}
