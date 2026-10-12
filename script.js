// When we deploy, only this one line changes (to the Railway backend link).
  API = "https://student-attendance-backend-v2-production.up.railway.app/api";

const el = id => document.getElementById(id);

functioconstn setMsg(id, text, ok) {
  el(id).textContent = text;
  el(id).className = "msg " + (ok ? "ok" : "bad");
}

async function checkBackend() {
  try {
    const res = await fetch(API + "/health");
    if (!res.ok) throw new Error("Status " + res.status);
    el("status").textContent = "Connected: " + (await res.text());
    el("status").className = "status ok";
  } catch (e) {
    el("status").textContent = "Backend is not reachable. Is it running on port 8080?";
    el("status").className = "status bad";
  }
}

async function loadStudents() {
  const body = el("studentBody");
  body.innerHTML = "";
  try {
    const res = await fetch(API + "/students");
    if (!res.ok) throw new Error("Status " + res.status);
    const students = await res.json();
    if (students.length === 0) { setMsg("listMessage", "No students yet.", true); return; }
    setMsg("listMessage", students.length + " student(s).", true);
    students.forEach(s => {
      const tr = document.createElement("tr");
      [s.id, s.name, s.rollNumber, s.department, s.email, s.phone].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v ?? "";
        tr.appendChild(td);
      });
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.className = "danger";
      btn.addEventListener("click", () => deleteStudent(s.id, s.name));
      td.appendChild(btn);
      tr.appendChild(td);
      body.appendChild(tr);
    });
  } catch (e) {
    setMsg("listMessage", "Could not load students: " + e.message, false);
  }
}

async function addStudent() {
  const student = {
    name: el("name").value.trim(),
    rollNumber: el("rollNumber").value.trim(),
    department: el("department").value.trim(),
    email: el("email").value.trim(),
    phone: el("phone").value.trim()
  };
  ["department", "email", "phone"].forEach(k => { if (!student[k]) student[k] = null; });

  try {
    const res = await fetch(API + "/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
    if (res.status === 201) {
      setMsg("formMessage", "Student added.", true);
      ["name", "rollNumber", "department", "email", "phone"].forEach(id => el(id).value = "");
      loadStudents();
    } else if (res.status === 400) {
      const errors = await res.json();
      setMsg("formMessage", Object.values(errors).join(" | "), false);
    } else if (res.status === 409) {
      setMsg("formMessage", "This roll number already exists.", false);
    } else {
      setMsg("formMessage", "Error: status " + res.status, false);
    }
  } catch (e) {
    setMsg("formMessage", "Backend is not reachable.", false);
  }
}

async function deleteStudent(id, name) {
  if (!confirm("Delete student " + name + "?")) return;
  try {
    const res = await fetch(API + "/students/" + id, { method: "DELETE" });
    if (res.status === 204) {
      setMsg("listMessage", "Student deleted.", true);
      loadStudents();
    } else if (res.status === 409) {
      setMsg("listMessage", "Cannot delete: this student has attendance records.", false);
    } else {
      setMsg("listMessage", "Error: status " + res.status, false);
    }
  } catch (e) {
    setMsg("listMessage", "Backend is not reachable.", false);
  }
}

el("addBtn").addEventListener("click", addStudent);
checkBackend();
loadStudents();