/*************************************************
 * TSR EXAMS – ADMIN RESULTS SCRIPT (FINAL CLEAN)
 *************************************************/

/* ===== GLOBAL STORAGE ===== */
let currentResults = [];

/* ================= LOAD RESULTS ================= */

function loadResults() {
  const examId = document.getElementById("examId").value.trim();
  if (!examId) return alert("Enter Exam ID");

  fetch(API_URL + "?type=GET_RESULTS&examId=" + encodeURIComponent(examId))
    .then(res => res.json())
    .then(data => {
      if (data.status !== "RESULTS_LOADED") {
        alert("No results found");
        return;
      }

      currentResults = data.results;
      renderTable(currentResults);
    })
    .catch(() => alert("Error loading results"));
}

/* ================= RENDER TABLE ================= */

function renderTable(results) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  if (!results.length) {
    table.innerHTML = `<tr><td class="no-data">No results available</td></tr>`;
    return;
  }

  const headers = Object.keys(results[0]);

  table.innerHTML +=
    "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

  results.forEach(row => {
    let tr = "<tr>";
    headers.forEach(h => {
      if (h === "Cheated") {
        tr += `<td class="${row[h] === "YES" ? "cheated" : "clean"}">${row[h]}</td>`;
      } else {
        tr += `<td>${row[h]}</td>`;
      }
    });
    tr += "</tr>";
    table.innerHTML += tr;
  });
}

/* ================= DOWNLOAD CSV ================= */

function downloadCSV() {
  if (!currentResults.length) return alert("No results to download");

  const headers = Object.keys(currentResults[0]);
  const csv =
    headers.join(",") + "\n" +
    currentResults.map(r =>
      headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const examId = document.getElementById("examId").value.trim();

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Exam_Results_${examId}.csv`;
  a.click();
}

/* ================= DOWNLOAD EXCEL  ================= */

function downloadExcel() {
  if (!currentResults || currentResults.length === 0) {
    alert("No results to download");
    return;
  }

  const examId = document.getElementById("examId").value.trim();

  /* ================= STATS ================= */
  const totalStudents = currentResults.length;
  const totalQ = Number(currentResults[0].TotalQ || 0);
  const passMark = Math.ceil(totalQ * 0.4);
  const maxScore = Math.max(...currentResults.map(r => Number(r.Score)));

  const topperCount = currentResults.filter(r => Number(r.Score) === maxScore).length;
  const cheaterCount = currentResults.filter(r => r.Cheated === "YES").length;
  const failedCount = currentResults.filter(
    r => Number(r.Score) < passMark && r.Cheated !== "YES"
  ).length;

  /* ================= SHEET DATA ================= */
  const headers = Object.keys(currentResults[0]);
  const sheetData = [headers];

  currentResults.forEach(r => {
    sheetData.push(headers.map(h => r[h]));
  });

  // Blank row + summary
  sheetData.push([]);
  sheetData.push(["Summary"]);
  sheetData.push(["Total Students", totalStudents]);
  sheetData.push(["Toppers", topperCount]);
  sheetData.push(["Cheaters", cheaterCount]);
  sheetData.push(["Failed", failedCount]);

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  /* ================= COLORS ================= */
  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let R = 1; R <= currentResults.length; R++) {
    const row = currentResults[R - 1];

    let fill = null;

    if (row.Cheated === "YES") {
      fill = { fgColor: { rgb: "FECACA" } }; // red
    } else if (Number(row.Score) < passMark) {
      fill = { fgColor: { rgb: "FED7AA" } }; // orange
    } else if (Number(row.Score) === maxScore) {
      fill = { fgColor: { rgb: "DCFCE7" } }; // green
    }

    if (fill) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell]) continue;
        ws[cell].s = { fill };
      }
    }
  }

  /* ================= SUMMARY STYLE ================= */
  for (let R = currentResults.length + 2; R <= currentResults.length + 6; R++) {
    const cell = XLSX.utils.encode_cell({ r: R, c: 0 });
    if (ws[cell]) {
      ws[cell].s = { font: { bold: true } };
    }
  }

  /* ================= DOWNLOAD ================= */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");

  XLSX.writeFile(wb, `Exam_Results_${examId}.xlsx`);
}

/* ================= LOGOUT ================= */

function logoutAdmin() {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}
function goBack() {
  window.location.href = "../admin/index.html";
}
