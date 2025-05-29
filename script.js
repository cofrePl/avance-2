const students = [];
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
const editIndexInput = document.getElementById("editIndex");
const date = document.getElementById("date").value;
const totalStudentsSpan = document.getElementById("totalStudents");
const approvedCountSpan = document.getElementById("approvedCount");
const failedCountSpan = document.getElementById("failedCount");

document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);
    const date = document.getElementById("date").value;
    

    if (!name || !lastName || isNaN(grade) || grade < 1 || grade > 7 || !date) {
        alert("Error: por favor ingrese todos los datos correctamente (nota entre 1 y 7 y fecha válida)");
        return;
    }

    const student = {
        name,
        lastName,
        grade,
        date 
    };
    
    if (editIndexInput.value === "") {
        students.push(student);
        addStudentToTable(student);
    } else {
        const index = parseInt(editIndexInput.value);
        students[index] = student;
        updateStudentRow(index, student);
        editIndexInput.value = "";
    }

    calcularPromedio();
    this.reset();
});


function addStudentToTable(student) {
    const index = students.length - 1;
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${formatearFecha(student.date)}</td>
    <td>${student.grade}</td>
    <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button>
    </td>
`;

    row.querySelector(".delete-btn").addEventListener("click", function () {
        deleteEstudiante(student, row);
    });
    row.querySelector(".edit-btn").addEventListener("click", function () {
        loadStudentToForm(student, index);
    });
    tableBody.appendChild(row);
}

function updateStudentRow(index, student) {
    const row = tableBody.rows[index];
    row.cells[0].textContent = student.name;
    row.cells[1].textContent = student.lastName;
    row.cells[2].textContent = formatearFecha(student.date);
    row.cells[3].textContent = student.grade;  
}


function loadStudentToForm(student, index) {
    document.getElementById("name").value = student.name;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("grade").value = student.grade;
    document.getElementById("date").value = student.date;
    editIndexInput.value = index;
}


function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index > -1) {
        students.splice(index, 1);
        calcularPromedio();
        row.remove();
    }
}

function calcularPromedio() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso : N/A";
        actualizarResumen();
        return;
    }

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;
    averageDiv.textContent = "Promedio General del Curso : " + prom.toFixed(2);
    actualizarResumen();
}


function actualizarResumen() {
    const total = students.length;
    const aprobados = students.filter(s => s.grade >= 5).length;
    const reprobados = total - aprobados;

    totalStudentsSpan.textContent = total;
    approvedCountSpan.textContent = aprobados;
    failedCountSpan.textContent = reprobados;
}


function formatearFecha(fechaISO) {
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`; 
}