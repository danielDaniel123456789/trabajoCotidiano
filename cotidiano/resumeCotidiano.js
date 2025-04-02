function resumeCotidiano(index) {
    // Obtener los datos de localStorage
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Buscar al estudiante por ID
    const student = students.find(st => Number(st.id) === Number(index));
    if (!student) {
        Swal.fire({
            title: "No hay datos",
            text: "No se encontró el estudiante.",
            icon: "error",
        });
        console.log("No hay datos");
        return;
    }

    console.log("ID:", student.id);
    console.log("Nombre:", student.name);
    console.log("Cédula:", student.cedula);

    // Buscar la materia
    const materia = materias.find(m => Number(m.id) === Number(student.materiaId));
    const nomBreMateria = materia ? materia.nombre : "Materia no encontrada";

    let nombreGrupo = "Grupo no encontrado";
    const grupo = grupos.find(gr => Number(gr.id) === Number(student.groupId));
    if (grupo) {
        nombreGrupo = grupo.nombre;
        console.log(`Grupo encontrado: ID = ${grupo.id}, Nombre = ${grupo.nombre}`);
    } else {
        console.log("No se encontró el grupo para el estudiante.");
    }

    console.log("Materia:", nomBreMateria);



    // Crear la tabla de trabajo cotidiano
    let tareasDetails = `
    <h6>0 = No hubo participación </h6>
    <h6>1 = Baja participación de la clase </h6>
    <h6>2 = Participación parcial </h6>
    <h6>3 = Participación Activa durante la clase </h6>
    <hr>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Puntos</th>
              
                <th>Editar</th> <!-- Cambiado de "Acción" a "Editar" -->
            </tr>
        </thead>
        <tbody>
    `;

    // Verificar que `trabajoCotidiano` existe y es un array
    if (Array.isArray(student.trabajoCotidiano)) {
        student.trabajoCotidiano.forEach((tarea, tareaIndex) => {
            tareasDetails += `
            <tr>
            
                <td>${tarea.date}</td>
                <td>${tarea.type}</td> <!-- Se muestra el tipo de participación -->
      
                <td>
                    <button class="btn btn-primary btn-sm"
                        onclick="editarTrabajoCotidiano(${tareaIndex}, ${student.id})">Editar</button>
                </td>
            </tr>
            `;
        });
    } else {
        tareasDetails += `
            <tr>
                <td colspan="4" class="text-center">No se encontraron tareas registradas.</td>
            </tr>
        `;
    }

    tareasDetails += `
        </tbody>
    </table>`;

    // Mostrar SweetAlert2 con los datos del estudiante, grupo y materia
    Swal.fire({
        html: `
        <br>
        <h4>Trabajo Cotidiano / Tareas</h4>
        <hr>
        <h6>Estudiante: ${student.name}</h6>
        <h6>Grupo: ${nombreGrupo}</h6>
        <h6>Materia: ${nomBreMateria}</h6>
        <hr>
        ${tareasDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Acción confirmada', 'Has revisado las tareas del estudiante.', 'success');
        }
    });
}


