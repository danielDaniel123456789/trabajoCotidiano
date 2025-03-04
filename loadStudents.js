

function loadStudents() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Limpiar lista antes de cargar

    // Si no hay estudiantes, se muestra un mensaje
    if (students.length === 0) {
        studentList.innerHTML = "<p>No hay estudiantes registrados.</p>";
    }

    students.forEach((student, index) => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'student-card');
        studentItem.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">
                        ${capitalizeFirstLetter(student.name)} ${capitalizeFirstLetter(student.surname)} ${student.secondSurname ? capitalizeFirstLetter(student.secondSurname) : ''} <!-- Segundo apellido -->
                    </h5>
                    <p class="card-text">Cédula: ${student.cedula || 'No disponible'}</p> <!-- Mostrar cédula -->
                    <button class="btn btn-link btn-sm" onclick="editStudent(${index})">
                        ✏️ <!-- Carácter de lápiz -->
                    </button>
                    <button class="btn btn-info" onclick="registerAbsence(${index})">Registrar Ausencia</button>
                    <button class="btn btn-secondary" onclick="viewAbsences(${index})">Informe</button>
                </div>
            </div>
        `;
        studentList.appendChild(studentItem);
    });
}
