/* ================= URL & STATE ================= */

// Declare ONCE
const urlParams = new URLSearchParams(window.location.search);
let currentExamId = urlParams.get("examId") || "";

/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", () => {
  const examInput = document.getElementById("examId");

  if (currentExamId && examInput) {
    examInput.value = currentExamId;
    loadQuestions();
  }
});

/* ================= LOAD QUESTIONS ================= */

function loadQuestions() {
  const examIdInput = document.getElementById("examId");
  const examId = examIdInput.value.trim();

  if (!examId) {
    alert("Enter exam ID");
    return;
  }

  currentExamId = examId;

  fetch(API_URL + "?type=GET_EXAM&examId=" + encodeURIComponent(examId))
    .then(res => res.json())
    .then(data => {
      if (data.status !== "EXAM_LOADED") {
        alert("Failed to load questions");
        return;
      }
      renderQuestions(data.questions);
    })
    .catch(err => {
      console.error(err);
      alert("Error loading questions");
    });
}

/* ================= RENDER ================= */

function renderQuestions(questions) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  if (!questions || questions.length === 0) {
    list.innerHTML = "<p>No questions found</p>";
    return;
  }

  questions.forEach(q => {
    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `
      <b>${q.question}</b>

      <ol type="A">
        ${q.options.map(opt => `<li>${opt}</li>`).join("")}
      </ol>

      <div class="actions">
        <button onclick="editQuestion('${q.qid}')">✏️ Edit</button>
        <button class="delete" onclick="deleteQuestion('${q.qid}')">🗑 Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* ================= ACTIONS ================= */

function editQuestion(qid) {
  window.location.href =
    `edit.html?examId=${encodeURIComponent(currentExamId)}&qid=${qid}`;
}

function deleteQuestion(qid) {
  if (!confirm("Delete this question permanently?")) return;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "DELETE_QUESTION",
      examId: currentExamId,
      qid: qid
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "DELETED") {
        loadQuestions();
      } else {
        alert("Delete failed");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error deleting question");
    });
}
function goToAdd() {
  window.location.href =
    `add.html?examId=${encodeURIComponent(currentExamId)}`;
}
function goBack() {
  window.location.href = "../admin/index.html";
}
