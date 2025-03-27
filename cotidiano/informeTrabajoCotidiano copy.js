function informeTrabajoCotidiano() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

    // Obtener todos los trabajos cotidianos de todos los estudiantes con información del estudiante
    let trabajoCotidiano = [];
    estudiantes.forEach(estudiante => {
        if (estudiante.trabajoCotidiano && estudiante.trabajoCotidiano.length > 0) {
            trabajoCotidiano = trabajoCotidiano.concat(estudiante.trabajoCotidiano.map(t => ({
                ...t,
                grupoId: t.grupoId.toString(), // Asegurar que grupoId sea string
                materiaId: t.materiaId.toString(), // Asegurar que materiaId sea string
                estudianteName: estudiante.name, // Añadir el nombre del estudiante
                estudianteId: estudiante.id.toString() // Añadir el ID del estudiante
            })));
        }
    });

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
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            return grupoSeleccionado ? grupoSeleccionado : Swal.showValidationMessage('Por favor selecciona un grupo');
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const grupoSeleccionado = grupos.find(grupo => grupo.id.toString() === result.value.toString());

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
                confirmButtonText: 'Siguiente',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    return materiaSeleccionada ? materiaSeleccionada : Swal.showValidationMessage('Por favor selecciona una materia');
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = materias.find(materia => materia.id.toString() === result.value.toString());

                    const meses = [
                        { nombre: 'Enero', dias: 31, value: 0 }, 
                        { nombre: 'Febrero', dias: 28, value: 1 }, 
                        { nombre: 'Marzo', dias: 31, value: 2 },
                        { nombre: 'Abril', dias: 30, value: 3 }, 
                        { nombre: 'Mayo', dias: 31, value: 4 }, 
                        { nombre: 'Junio', dias: 30, value: 5 },
                        { nombre: 'Julio', dias: 31, value: 6 }, 
                        { nombre: 'Agosto', dias: 31, value: 7 }, 
                        { nombre: 'Septiembre', dias: 30, value: 8 },
                        { nombre: 'Octubre', dias: 31, value: 9 }, 
                        { nombre: 'Noviembre', dias: 30, value: 10 }, 
                        { nombre: 'Diciembre', dias: 31, value: 11 }
                    ];

                    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
                    meses.forEach(mes => {
                        selectMesHTML += `<option value="${mes.value}">${mes.nombre} (${mes.dias} días)</option>`;
                    });
                    selectMesHTML += '</select>';

                    Swal.fire({
                        title: 'Selecciona el mes',
                        html: selectMesHTML,
                        showCancelButton: true,
                        confirmButtonText: 'Finalizar',
                        preConfirm: () => {
                            const mesValue = document.getElementById('mesSelect').value;
                            const mesSeleccionado = meses.find(m => m.value.toString() === mesValue.toString());
                            return { 
                                mesIndex: mesSeleccionado.value, 
                                diasDelMes: mesSeleccionado.dias,
                                nombreMes: mesSeleccionado.nombre
                            };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { mesIndex, diasDelMes, nombreMes } = result.value;

                            // Filtrar los trabajos según selección
                            const trabajosFiltrados = trabajoCotidiano.filter(trabajo => {
                                try {
                                    const fechaTrabajo = new Date(trabajo.date);
                                    return trabajo.grupoId.toString() === grupoSeleccionado.id.toString() &&
                                           trabajo.materiaId.toString() === materiaSeleccionada.id.toString() &&
                                           fechaTrabajo.getMonth() === mesIndex;
                                } catch (e) {
                                    console.error("Error al procesar fecha:", trabajo.date, e);
                                    return false;
                                }
                            });

                            // Ordenar por fecha y luego por nombre de estudiante
                            trabajosFiltrados.sort((a, b) => {
                                const dateDiff = new Date(a.date) - new Date(b.date);
                                if (dateDiff !== 0) return dateDiff;
                                return a.estudianteName.localeCompare(b.estudianteName);
                            });

                            // Crear tabla
                            let tableHTML = `
                                <table border="1" style="width:100%; border-collapse: collapse; margin-top: 10px;">
                                    <thead>
                                        <tr style="background-color: #f2f2f2;">
                                            <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Estudiante</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Tipo</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            `;

                            if (trabajosFiltrados.length > 0) {
                                trabajosFiltrados.forEach(trabajo => {
                                    tableHTML += `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${trabajo.id}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${trabajo.estudianteName}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${trabajo.type}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${trabajo.date}</td>
                                        </tr>
                                    `;
                                });
                            } else {
                                tableHTML += `
                                    <tr>
                                        <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                            No hay trabajos registrados para ${nombreMes}
                                        </td>
                                    </tr>`;
                            }

                            tableHTML += `</tbody></table>`;

                            Swal.fire({
                                title: 'Resumen de Trabajos',
                                html: `
                                    <div style="margin-bottom: 15px;">
                                        <p><strong>Grupo:</strong> ${grupoSeleccionado.nombre}</p>
                                        <p><strong>Materia:</strong> ${materiaSeleccionada.nombre}</p>
                                        <p><strong>Mes:</strong> ${nombreMes} (${diasDelMes} días)</p>
                                    </div>
                                    ${tableHTML}
                                `,
                                icon: 'info',
                                width: '800px',
                                customClass: {
                                    popup: 'custom-swal-popup'
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}