function informeTrabajoCotidianoYEnviarCorreo() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
    const meses = [
        { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' },
        { id: 3, nombre: 'Marzo' }, { id: 4, nombre: 'Abril' },
        { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' },
        { id: 9, nombre: 'Septiembre' }, { id: 10, nombre: 'Octubre' },
        { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
    ];

    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`);
    selectMesHTML += '</select>';

    Swal.fire({
        title: 'Selecciona un grupo y un mes',
        html: `
            <label>Grupo:</label> ${selectGruposHTML} <br><br>
            <label>Mes:</label> ${selectMesHTML}
        `,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Siguiente',
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            const mesSeleccionado = document.getElementById('mesSelect').value;
            if (!grupoSeleccionado || !mesSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un grupo y un mes');
                return false;
            }
            return { grupo: grupoSeleccionado, mes: mesSeleccionado };
        }
    }).then((result) => {
        if (!result.isConfirmed) return;

        const { grupo, mes } = result.value;
        const grupoSeleccionado = grupos.find(g => g.id.toString() === grupo.toString());

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
            showCloseButton: true,
            confirmButtonText: 'Generar informe',
            preConfirm: () => {
                const materiaSeleccionada = document.getElementById('materiaSelect').value;
                return materiaSeleccionada ? materiaSeleccionada : Swal.showValidationMessage('Por favor selecciona una materia');
            }
        }).then((result2) => {
            if (!result2.isConfirmed) return;

            const materiaSeleccionada = materias.find(m => m.id.toString() === result2.value.toString());
            const estudiantesDelGrupo = estudiantes.filter(est =>
                est.groupId && est.groupId.toString() === grupoSeleccionado.id.toString()
            );

            let maxTrabajos = 0;
            let trabajosPorEstudiante = {};

            estudiantesDelGrupo.forEach(estudiante => {
                let trabajosEstudiante = estudiante.trabajoCotidiano
                    ? estudiante.trabajoCotidiano.filter(trabajo => {
                        const [año, mesTrabajo] = trabajo.date.split('-').map(Number);
                        return mesTrabajo === parseInt(mes);
                    }).map(trabajo => trabajo.type)
                    : [];

                trabajosPorEstudiante[estudiante.name] = trabajosEstudiante;
                maxTrabajos = Math.max(maxTrabajos, trabajosEstudiante.length);
            });

            let tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%;" id="trabajoTable">
                                <thead>
                                    <tr>
                                        <th>👤</th>`;

            for (let i = 0; i < maxTrabajos; i++) {
                let fecha = '';
                for (const estudiante of estudiantesDelGrupo) {
                    const trabajosFiltrados = estudiante.trabajoCotidiano
                        ? estudiante.trabajoCotidiano.filter(trabajo => {
                            const [año, mesTrabajo] = trabajo.date.split('-').map(Number);
                            return mesTrabajo === parseInt(mes);
                        })
                        : [];

                    if (trabajosFiltrados[i]) {
                        fecha = trabajosFiltrados[i].date;
                        break;
                    }
                }

                let fechaFormateada = '#';
                if (fecha) {
                    const [año, mesF, dia] = fecha.split('-');
                    const mesesAbrev = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                    const mesAbrev = mesesAbrev[parseInt(mesF, 10) - 1];
                    fechaFormateada = `${mesAbrev} ${dia}`;
                }

                tableHTML += `<th>${fechaFormateada}</th>`;
            }

            tableHTML += `</tr></thead><tbody>`;

            estudiantesDelGrupo.forEach(estudiante => {
                tableHTML += `<tr><td>${estudiante.name}</td>`;
                let trabajos = trabajosPorEstudiante[estudiante.name] || [];
                for (let i = 0; i < maxTrabajos; i++) {
                    tableHTML += `<td>${trabajos[i] || ''}</td>`;
                }
                tableHTML += `</tr>`;
            });

            tableHTML += `</tbody></table>`;

            // Aquí mostramos el Swal para confirmar/modificar correo
            let correoGuardado = localStorage.getItem("correoUsuario") || '';

            Swal.fire({
                title: 'Confirma o modifica tu correo electrónico',
                input: 'email',
                inputLabel: 'Correo',
                inputValue: correoGuardado,
                inputPlaceholder: 'ejemplo@correo.com',
                showCancelButton: true,
                confirmButtonText: 'Enviar informe',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) return 'Por favor ingresa un correo válido';
                    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!re.test(value)) return 'Correo inválido';
                }
            }).then((resultCorreo) => {
                if (!resultCorreo.isConfirmed) return;

                const correoFinal = resultCorreo.value;
                // Actualizamos localStorage si cambió el correo
                if (correoFinal !== correoGuardado) {
                    localStorage.setItem("correoUsuario", correoFinal);
                }

                Swal.fire({
                    title: 'Enviando informe...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                fetch('https://facturahacienda.com/correosPHP/opcion4.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        correo: correoFinal,
                        tabla_html: tableHTML
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
}
