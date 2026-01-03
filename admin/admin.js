function goToResults() {
  window.location.href = "../admin/results.html";
}

function goToImporter() {
  window.location.href = "../importer/importer.html"; // ✅ CORRECT PATH
}

function goToEditor() {
  window.location.href = "../editor/index.html";
}

function goToCreateExam() {
  window.location.href = "create-exam.html";
}

function logoutAdmin() {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.replace("login.html");
}
