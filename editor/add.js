const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");

if (!examId) {
  alert("Exam ID missing");
}

/* ================= SAVE ================= */

function save() {
  const payload = {
    type: "ADD_QUESTION",
    examId: examId,
    question: document.getElementById("question").value.trim(),
    options: [
      document.getElementById("optA").value.trim(),
      document.getElementById("optB").value.trim(),
      document.getElementById("optC").value.trim(),
      document.getElementById("optD").value.trim()
    ],
    correct: document.getElementById("correct").value,
    image: document.getElementById("image").value.trim()
  };

  // Basic validation
  if (!payload.question || payload.options.some(o => !o)) {
    alert("Fill all fields");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "QUESTION_ADDED") {
        alert("Question added");
        goBack();
      } else {
        alert("Failed to add question");
      }
    });
}

/* ================= BACK ================= */

function goBack() {
  window.location.href =
    `index.html?examId=${encodeURIComponent(examId)}`;
}
