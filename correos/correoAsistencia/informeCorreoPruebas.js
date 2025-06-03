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
                                <th>👤 Estudiante</th>`;

            // Encabezados de pruebas
            if (pruebasUnicas.length > 0) {
                pruebasUnicas.forEach(prueba => {
                    const fecha = prueba.date ? new Date(prueba.date).toLocaleDateString() : '';
                    tableHTML += `<th>Prueba ${prueba.id}${fecha ? `<br><small>${fecha}</small>` : ''}</th>`;
                });
            } else {
                tableHTML += '<th>No hay pruebas</th>';
            }

            tableHTML += `<th>📊 Promedio</th></tr></thead><tbody>`;

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
                let promedioStyle = '';
                if (promedio >= 8) promedioStyle = 'color: #2e7d32;'; // Verde
                else if (promedio >= 5) promedioStyle = 'color: #f9a825;'; // Amarillo
                else if (promedio > 0) promedioStyle = 'color: #c62828;'; // Rojo
                
                tableHTML += `<td style="font-weight: bold; ${promedioStyle}">${promedio}</td></tr>`;
            });

            tableHTML += '</tbody></table></div>';

            // Obtener nombres para el título
            const grupoNombre = grupos.find(g => g.id == grupoSeleccionado)?.nombre || 'Grupo';
            const materiaNombre = materias.find(m => m.id == materiaSeleccionada)?.nombre || 'Materia';

            // Mostrar informe primero
            Swal.fire({
                title: `Informe de Pruebas - ${grupoNombre} - ${materiaNombre}`,
                html: tableHTML,
                width: '90%',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Enviar por correo',
                didOpen: () => {
                    // Agregar estilos para mejor visualización
                    const style = document.createElement('style');
                    style.textContent = `
                        #pruebasTable {
                            width: 100%;
                            margin: 10px 0;
                            font-size: 0.9em;
                        }
                        #pruebasTable th, #pruebasTable td {
                            padding: 8px;
                            text-align: center;
                            border: 1px solid #ddd;
                        }
                        #pruebasTable th {
                            background-color: #f8f9fa;
                            font-weight: bold;
                        }
                        #pruebasTable tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        #pruebasTable tr:hover {
                            background-color: #f1f1f1;
                        }
                        small {
                            font-size: 0.8em;
                            color: #666;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }).then((sendResult) => {
                if (!sendResult.isConfirmed) return;

                // Recuperar correo guardado para precargar
                const correoGuardado = localStorage.getItem('correoUsuario') || '';

                // Solicitar correo destino con valor precargado
                Swal.fire({
                    title: 'Enviar informe por correo',
                    html: `Enviar <b>Informe de Pruebas - ${grupoNombre} - ${materiaNombre}</b> a:`,
                    input: 'email',
                    inputLabel: 'Correo electrónico',
                    inputPlaceholder: 'correo@ejemplo.com',
                    inputValue: correoGuardado,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debe ingresar un correo electrónico';
                        }
                        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!re.test(value)) {
                            return 'Ingrese un correo electrónico válido';
                        }
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    cancelButtonText: 'Cancelar'
                }).then((emailResult) => {
                    if (!emailResult.isConfirmed) return;

                    const correoDestino = emailResult.value;

                    // Guardar el correo en localStorage para futuros usos
                    localStorage.setItem('correoUsuario', correoDestino);

                    // Mostrar mensaje de carga
                    Swal.fire({
                        title: 'Enviando informe...',
                        html: 'Por favor espere mientras se envía el correo',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // Enviar el correo
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
                        Swal.fire({
                            title: '¡Envío exitoso!',
                            html: `El <b>Informe de Pruebas - ${grupoNombre} - ${materiaNombre}</b> ha sido enviado a:<br><b>${correoDestino}</b>`,
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        });
                    })
                    .catch(err => {
                        Swal.fire({
                            title: 'Error al enviar',
                            html: `No se pudo enviar el informe a:<br><b>${correoDestino}</b><br><br>Error: ${err.message}`,
                            icon: 'error',
                            confirmButtonText: 'Entendido'
                        });
                    });
                });
            });
        });
    });
}