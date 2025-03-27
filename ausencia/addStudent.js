function addStudent() {
    // Cargar los grupos y materias desde el localStorage de forma segura
    let grupos = localStorage.getItem('grupos') ? JSON.parse(localStorage.getItem('grupos')) : [];
    let materias = localStorage.getItem('materias') ? JSON.parse(localStorage.getItem('materias')) : [];

    // Verificar si hay grupos o materias para mostrar
    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    if (materias.length === 0) {
        Swal.fire('Información', 'No hay materias disponibles. Por favor, agregue una materia primero.', 'info');
        return;
    }

    // Crear las opciones del selector de grupos
    let grupoOptions = grupos.map(grupo => `<option value="${grupo.id}">${grupo.nombre}</option>`).join('');

    // Crear las opciones del selector de materias
    let materiaOptions = materias.map(materia => `<option value="${materia.id}">${materia.nombre}</option>`).join(''); 

    // Abrir SweetAlert para agregar un estudiante
    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula (opcional)" type="text">
            <br> <br>
            <select id="studentGroup" class="form-select">
                <option value="" disabled selected>Selecciona un grupo</option>
                ${grupoOptions}
            </select>
            <br>
            <select id="studentMateria" class="form-select">
                <option value="" disabled selected>Selecciona una materia</option>
                ${materiaOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = document.getElementById('studentGroup').value;
            const materiaId = document.getElementById('studentMateria').value;

            // Verificar que al menos el nombre, el grupo y la materia estén seleccionados
            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }
            if (!groupId) {
                Swal.showValidationMessage('Debe seleccionar un grupo');
                return false;
            }
            if (!materiaId) {
                Swal.showValidationMessage('Debe seleccionar una materia');
                return false;
            }

            // Obtener estudiantes de localStorage de forma segura
            let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

            // Generar un ID único para el estudiante
            const studentId = students.length > 0 ? students[students.length - 1].id + 1 : 1; // Generar ID basado en el último estudiante

            // Crear objeto del estudiante
            const student = {
                id: studentId, // Asignar el ID único
                name: name,
                cedula: cedula || '', // Si no se ingresa, se guarda como cadena vacía
                groupId: groupId, // Guardamos solo el ID del grupo
                materiaId: materiaId, // Guardamos el ID de la materia seleccionada
                absences: [] // Inicializar las ausencias
            };

            saveStudent(student);

            Swal.fire({
                title: "Insertado",
                text: "Estudiante agregado correctamente",
                icon: "success"
              });
        }
    });
}
