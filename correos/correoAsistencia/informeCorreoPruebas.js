function informeGeneralPruebas() {
    // Recuperar datos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

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

        if (materias.length === 0) {
            Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
            return;
        }

        let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
        materias.forEach(materia => {
            selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
        });
        selectMateriasHTML += '</select>';

        Swal.fire({
            title: 'Selecciona una materia',
            html: selectMateriasHTML,
            showCancelButton: true,
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

            const estudiantesFiltrados = estudiantes.filter(estudiante => 
                estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
            );

            if (estudiantesFiltrados.length === 0) {
                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                return;
            }

            // Obtener todas las pruebas únicas
            let pruebasUnicas = [];
            estudiantesFiltrados.forEach(estudiante => {
                if (estudiante.pruebas && Array.isArray(estudiante.pruebas)) {
                    estudiante.pruebas.forEach(prueba => {
                        if (!pruebasUnicas.some(p => p.id === prueba.id)) {
                            pruebasUnicas.push(prueba);
                        }
                    });
                }
            });

            // Ordenar pruebas por fecha (asumiendo que tienen propiedad date)
            pruebasUnicas.sort((a, b) => {
                if (a.date && b.date) return new Date(a.date) - new Date(b.date);
                return 0;
            });

            // Crear tabla HTML
            let tableHTML = `
                <div style="overflow-x: auto;">
                    <table border="1" style="border-collapse: collapse; width: 100%;" id="pruebasTable">
                        <thead>
                            <tr>
                                <th>Estudiante</th>`;

            // Encabezados de pruebas
            if (pruebasUnicas.length > 0) {
                pruebasUnicas.forEach(prueba => {
                    const fecha = prueba.date ? new Date(prueba.date).toLocaleDateString() : '';
                    tableHTML += `<th>Prueba ${prueba.id}${fecha ? `<br>${fecha}` : ''}</th>`;
                });
            } else {
                tableHTML += '<th>No hay pruebas</th>';
            }

            tableHTML += `<th>Promedio</th></tr></thead><tbody>`;

            // Filas de estudiantes
            estudiantesFiltrados.forEach(estudiante => {
                tableHTML += `<tr><td>${estudiante.name}</td>`;
                let totalPuntos = 0;
                let contadorPruebas = 0;

                if (pruebasUnicas.length > 0) {
                    pruebasUnicas.forEach(prueba => {
                        const pruebaEstudiante = (estudiante.pruebas && Array.isArray(estudiante.pruebas))
                            ? estudiante.pruebas.find(p => p.id === prueba.id)
                            : null;
                        
                        let puntos = pruebaEstudiante ? parseFloat(pruebaEstudiante.puntos) || 0 : 0;
                        
                        // Resaltar según puntuación
                        let cellStyle = '';
                        if (puntos >= 8) cellStyle = 'background-color: #ccffcc;'; // Verde
                        else if (puntos >= 5) cellStyle = 'background-color: #ffffcc;'; // Amarillo
                        else if (puntos > 0) cellStyle = 'background-color: #ffcccc;'; // Rojo
                        
                        tableHTML += `<td style="${cellStyle}">${puntos || ''}</td>`;
                        
                        if (pruebaEstudiante) {
                            totalPuntos += puntos;
                            contadorPruebas++;
                        }
                    });
                } else {
                    tableHTML += '<td>Sin pruebas</td>';
                }

                // Calcular promedio
                const promedio = contadorPruebas > 0 ? (totalPuntos / contadorPruebas).toFixed(2) : 0;
                tableHTML += `<td><strong>${promedio}</strong></td></tr>`;
            });

            tableHTML += '</tbody></table></div>';

            // Obtener nombres para el título
            const grupoNombre = grupos.find(g => g.id == grupoSeleccionado)?.nombre || 'Grupo';
            const materiaNombre = materias.find(m => m.id == materiaSeleccionada)?.nombre || 'Materia';

            // Mostrar informe primero
            Swal.fire({
                title: `Pruebas de ${grupoNombre} - ${materiaNombre}`,
                html: tableHTML,
                width: '90%',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Enviar por correo',
                didOpen: () => {
                    // Agregar estilos para mejor visualización
                    const style = document.createElement('style');
                    style.textContent = `
                        #pruebasTable th, #pruebasTable td {
                            padding: 5px;
                            text-align: center;
                            min-width: 30px;
                        }
                        #pruebasTable th {
                            background-color: #f2f2f2;
                        }
                        #pruebasTable td {
                            font-size: 0.9em;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }).then((sendResult) => {
                if (!sendResult.isConfirmed) return;

                // Solicitar correo destino
                Swal.fire({
                    title: 'Ingrese el correo destino',
                    input: 'email',
                    inputLabel: 'Correo electrónico',
                    inputPlaceholder: 'correo@ejemplo.com',
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
                    confirmButtonText: 'Enviar'
                }).then((emailResult) => {
                    if (!emailResult.isConfirmed) return;

                    const correoDestino = emailResult.value;

                    fetch('https://facturahacienda.com/correosPHP/opcion4.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            correo: correoDestino,
                            tabla_html: tableHTML,
                            asunto: `Informe de Pruebas - ${grupoNombre} - ${materiaNombre}`
                        })
                    })
                    .then(res => res.text())
                    .then(data => {
                        Swal.fire('Resultado', data, 'info');
                    })
                    .catch(err => {
                        Swal.fire('Error', 'No se pudo enviar el correo. ' + err.message, 'error');
                    });
                });
            });
        });
    });
}