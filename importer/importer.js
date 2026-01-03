function importQuestions() {
  const examId = document.getElementById("examId").value.trim();
  const formId = document.getElementById("formId").value.trim();
  const status = document.getElementById("status");

  if (!examId || !formId) {
    status.style.color = "red";
    status.innerText = "Exam ID and Form ID are required";
    return;
  }

  status.style.color = "#1d4ed8";
  status.innerText = "Importing questions...";

  fetch(API_URL, {
  method: "POST",
  body: JSON.stringify({
    type: "IMPORT_FROM_FORM",
    examId: examId,
    formId: formId
  })
})

    .then(res => res.json())
    .then(data => {
  console.log("IMPORT RESPONSE:", data);

  if (data.status === "IMPORTED") {
    status.style.color = "green";
    status.innerText =
      `✅ Imported ${data.questionsImported} questions successfully`;
  } else {
    status.style.color = "red";
    status.innerText =
      "❌ Import failed: " + (data.error || JSON.stringify(data));
  }
})

    .catch(() => {
      status.style.color = "red";
      status.innerText = "❌ Server error";
    });
}

function goBack() {
  window.location.href = "../admin/index.html";
}
