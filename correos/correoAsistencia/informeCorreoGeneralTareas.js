function informeCorreoGeneralTareas() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

    // Verificar si los grupos existen en localStorage
    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    // Crear el HTML del select para los grupos
    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    // Mostrar el primer modal con SweetAlert2 para seleccionar el grupo
    Swal.fire({
        title: 'Selecciona un grupo',
        html: selectGruposHTML,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            if (!grupoSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un grupo');
                return false;
            }
            return grupoSeleccionado;
        }
    }).then((result) => {
        if (!result.isConfirmed) return;
        const grupoSeleccionado = result.value;

        // Verificar si las materias existen en localStorage
        if (materias.length === 0) {
            Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
            return;
        }

        // Crear el HTML del select para las materias
        let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
        materias.forEach(materia => {
            selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
        });
        selectMateriasHTML += '</select>';

        // Mostrar el segundo modal con SweetAlert2 para seleccionar la materia
        Swal.fire({
            title: 'Selecciona una materia',
            html: selectMateriasHTML,
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'Mostrar Informe',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const materiaSeleccionada = document.getElementById('materiaSelect').value;
                if (!materiaSeleccionada) {
                    Swal.showValidationMessage('Por favor selecciona una materia');
                    return false;
                }
                return materiaSeleccionada;
            }
        }).then((result2) => {
            if (!result2.isConfirmed) return;
            const materiaSeleccionada = result2.value;

            // Filtrar estudiantes por grupo y materia seleccionados
            const estudiantesFiltrados = estudiantes.filter(estudiante =>
                estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
            );

            // Verificar si hay estudiantes filtrados
            if (estudiantesFiltrados.length === 0) {
                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                return;
            }

            // Obtener todas las tareas únicas para ese grupo y materia
            let tareasUnicas = [];
            estudiantesFiltrados.forEach(estudiante => {
                if (estudiante.tareas && Array.isArray(estudiante.tareas)) {
                    estudiante.tareas.forEach(tarea => {
                        if (!tareasUnicas.some(t => t.id === tarea.id)) {
                            tareasUnicas.push(tarea);
                        }
                    });
                }
            });

            // Ordenar tareas por ID
            tareasUnicas.sort((a, b) => a.id - b.id);

            // Crear la tabla HTML para las tareas
            let tableHTML = `
                <div style="overflow-x: auto;">
                    <table border="1" style="border-collapse: collapse; width: 100%;" id="tareasTable">
                        <thead>
                            <tr>
                                <th>Estudiante</th>`;

            // Crear las cabeceras de las tareas
            if (tareasUnicas.length > 0) {
                tareasUnicas.forEach(tarea => {
                    tableHTML += `<th>Tarea ${tarea.id}</th>`;
                });
            } else {
                tableHTML += '<th>No hay tareas</th>';
            }
            tableHTML += `<th>Total</th></tr></thead><tbody>`;

            // Recorrer los estudiantes y sus tareas
            estudiantesFiltrados.forEach(estudiante => {
                tableHTML += `<tr><td>${estudiante.name}</td>`;
                let totalPuntos = 0;

                // Crear las columnas de tareas para cada estudiante
                if (tareasUnicas.length > 0) {
                    tareasUnicas.forEach(tarea => {
                        const tareaEstudiante = (estudiante.tareas && Array.isArray(estudiante.tareas))
                            ? estudiante.tareas.find(t => t.id === tarea.id)
                            : null;
                        
                        let puntos = 0;
                        if (tareaEstudiante) {
                            puntos = parseFloat(tareaEstudiante.puntos || tareaEstudiante.score || 0);
                        }
                        
                        // Resaltar celdas con colores según los puntos
                        let cellStyle = '';
                        if (puntos >= 8) cellStyle = 'background-color: #ccffcc;'; // Verde claro
                        else if (puntos >= 5) cellStyle = 'background-color: #ffffcc;'; // Amarillo
                        else if (puntos > 0) cellStyle = 'background-color: #ffcccc;'; // Rojo claro
                        
                        tableHTML += `<td style="${cellStyle}">${puntos || ''}</td>`;
                        totalPuntos += puntos;
                    });
                } else {
                    tableHTML += '<td>Sin tareas</td>';
                }

                tableHTML += `<td><strong>${totalPuntos.toFixed(1)}</strong></td></tr>`;
            });

            tableHTML += '</tbody></table></div>';

            // Obtener nombres de grupo y materia para el título
            const grupoNombre = grupos.find(g => g.id == grupoSeleccionado)?.nombre || 'Grupo';
            const materiaNombre = materias.find(m => m.id == materiaSeleccionada)?.nombre || 'Materia';

            // Mostrar el informe primero
            Swal.fire({
                title: `Tareas de ${grupoNombre} - ${materiaNombre}`,
                html: tableHTML,
                width: '90%',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Enviar por correo',
                didOpen: () => {
                    // Agregar estilos para mejor visualización
                    const style = document.createElement('style');
                    style.textContent = `
                        #tareasTable th, #tareasTable td {
                            padding: 5px;
                            text-align: center;
                            min-width: 30px;
                        }
                        #tareasTable th {
                            background-color: #f2f2f2;
                        }
                        #tareasTable td {
                            font-size: 0.9em;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }).then((sendResult) => {
                if (!sendResult.isConfirmed) return;

                // Recuperar correo guardado para precargar
                const correoGuardado = localStorage.getItem('correoUsuario') || '';

                // Pide correo luego con el valor precargado
                Swal.fire({
                    title: 'Ingrese el correo destino para enviar el informe',
                    input: 'email',
                    inputLabel: 'Correo electrónico',
                    inputPlaceholder: 'correo@ejemplo.com',
                    inputValue: correoGuardado, // Precargar el correo guardado
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Necesitas ingresar un correo';
                        }
                        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!re.test(value)) {
                            return 'Correo inválido';
                        }
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar correo'
                }).then((emailResult) => {
                    if (!emailResult.isConfirmed) return;

                    const correoDestino = emailResult.value;

                    // Guardar el correo en localStorage para futuros usos
                    localStorage.setItem('correoUsuario', correoDestino);

                    // Mostrar mensaje "Enviando..."
                    Swal.fire({
                        title: 'Enviando informe',
                        html: 'Por favor espere mientras se envía el correo...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    fetch('https://facturahacienda.com/correosPHP/opcion4.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            correo: correoDestino,
                            tabla_html: tableHTML,
                            asunto: `Informe de Tareas - ${grupoNombre} - ${materiaNombre}`
                        })
                    })
                    .then(res => res.text())
                    .then(data => {
                        Swal.fire('Éxito', 'El informe de tareas ha sido enviado por correo.', 'success');
                    })
                    .catch(err => {
                        Swal.fire('Error', 'No se pudo enviar el correo. ' + err.message, 'error');
                    });
                });
            });
        });
    });
}