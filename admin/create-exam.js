function createExam() {
  const examName = document.getElementById("examName").value.trim();
  const duration = document.getElementById("duration").value.trim();
  const maxTabSwitch = document.getElementById("maxTabSwitch").value.trim();
  const resultBox = document.getElementById("result");

  if (!examName || !duration || !maxTabSwitch) {
    alert("Please fill all fields");
    return;
  }

  const payload = {
    type: "CREATE_EXAM",
    examName,
    duration: Number(duration),
    maxTabSwitch: Number(maxTabSwitch)
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "EXAM_CREATED") {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
          <b>✅ Exam Created Successfully</b>
          <div><b>Exam ID:</b> ${data.examId}</div>

          <button class="btn-success"
            onclick="goToEditor('${data.examId}')">
            ➕ Add / Edit Questions
          </button>
        `;
      } else {
        alert("Failed to create exam");
      }
    })
    .catch(() => alert("Server error"));
}

function goToEditor(examId) {
  window.location.href =
    `../editor/index.html?examId=${encodeURIComponent(examId)}`;
}
function goBack() {
  window.location.href = "../admin/index.html";
}
