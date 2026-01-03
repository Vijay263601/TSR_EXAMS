const params = new URLSearchParams(window.location.search);
const examId = params.get("examId");
const qid = params.get("qid");

let originalData = null;

if (!examId || !qid) {
  alert("Missing parameters");
}

/* ================= LOAD QUESTION ================= */

fetch(API_URL + "?type=GET_EXAM&examId=" + examId)
  .then(res => res.json())
  .then(data => {
    if (data.status !== "EXAM_LOADED") {
      alert("Failed to load exam");
      return;
    }

    const q = data.questions.find(q => q.qid === qid);
    if (!q) {
      alert("Question not found");
      return;
    }

    originalData = q;

    document.getElementById("question").value = q.question;
    document.getElementById("optA").value = q.options[0];
    document.getElementById("optB").value = q.options[1];
    document.getElementById("optC").value = q.options[2];
    document.getElementById("optD").value = q.options[3];
    document.getElementById("correct").value = q.correct;
    document.getElementById("image").value = q.image || "";
  });

/* ================= SAVE ================= */

function save() {
  const payload = {
    type: "UPDATE_QUESTION",
    examId: examId,
    qid: qid,
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

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "UPDATED") {
        alert("Question updated successfully");
        goBack();
      } else {
        alert("Update failed");
      }
    });
}

/* ================= BACK ================= */

function goBack() {
  window.location.href = `index.html?examId=${examId}`;
}
