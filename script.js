alert("JavaScript is working!");

const API_URL = "http://localhost:8080/students";

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("studentTableBody")) {
        loadStudents();
    }

    if (document.getElementById("totalStudents")) {
        updateDashboard();
    }

    if (document.getElementById("attendanceTableBody")) {
        loadAttendance();
    }
});

function loadStudents() {

    fetch(API_URL)
        .then(response => response.json())
        .then(students => {

            const tableBody = document.getElementById("studentTableBody");

            tableBody.innerHTML = "";

            students.forEach(student => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.rollNumber || ""}</td>
                    <td>${student.branch}</td>
                    <td>${student.email}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Edit</button>
                        <button onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {

            console.error("Error loading students:", error);

            alert("Unable to connect to backend.");
        });
}


function saveStudent() {

    const id = document.getElementById("studentId").value;

    const student = {

        name: document.getElementById("name").value,

        rollNumber: document.getElementById("rollNumber").value,

        branch: document.getElementById("branch").value,

        email: document.getElementById("email").value
    };

    let url = API_URL;

    let method = "POST";

    if (id) {

        url = `${API_URL}/${id}`;

        method = "PUT";
    }

    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    })

    .then(response => {

        if (!response.ok) {

            throw new Error("Failed to save student");
        }

        return response.json();
    })

    .then(data => {

        alert("Student saved successfully!");

        clearForm();

        loadStudents();
    })

    .catch(error => {

        console.error("Error:", error);

        alert("Unable to save student.");
    });
}


function editStudent(id) {

    fetch(`${API_URL}/${id}`)

        .then(response => response.json())

        .then(student => {

            document.getElementById("studentId").value = student.id;

            document.getElementById("name").value = student.name;

            document.getElementById("rollNumber").value =
                student.rollNumber || "";

            document.getElementById("branch").value = student.branch;

            document.getElementById("email").value = student.email;
        })

        .catch(error => {

            console.error("Error:", error);
        });
}


function deleteStudent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        loadStudents();
    })

    .catch(error => {

        console.error("Error:", error);

        alert("Unable to delete student.");
    });
}


function clearForm() {

    document.getElementById("studentId").value = "";

    document.getElementById("name").value = "";

    document.getElementById("rollNumber").value = "";

    document.getElementById("branch").value = "";

    document.getElementById("email").value = "";
}


function updateDashboard() {

    fetch(API_URL)

        .then(response => response.json())

        .then(students => {

            document.getElementById("totalStudents").textContent =
                students.length;
        })

        .catch(error => {

            console.error("Dashboard error:", error);
        });
}


function loadAttendance() {

    fetch(API_URL)

        .then(response => response.json())

        .then(students => {

            const tableBody =
                document.getElementById("attendanceTableBody");

            tableBody.innerHTML = "";

            students.forEach(student => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.rollNumber || ""}</td>
                    <td>${student.branch}</td>
                    <td>
                        <button onclick="markAttendance(${student.id}, 'Present')">
                            Present
                        </button>

                        <button onclick="markAttendance(${student.id}, 'Absent')">
                            Absent
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })

        .catch(error => {

            console.error("Attendance error:", error);
        });
}


function markAttendance(studentId, status) {

    alert(
        "Student ID: " +
        studentId +
        "\nAttendance: " +
        status
    );
}