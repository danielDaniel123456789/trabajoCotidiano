function informeCorreoTrabajoCotidiano() {
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
            confirmButtonText: 'Siguiente',
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

            // Construcción tabla HTML con scroll horizontal y aviso copiado
            let tableHTML = `
                <div id="avisoCopiado" class="alert alert-primary" style="display: none;">
                    <h2>Ya lo copié. Ahora abrí WhatsApp y pegalo.</h2>
                </div>
                <div style="overflow-x: auto;">
                    <table class="table table-bordered" id="trabajoTable" style="border-collapse: collapse; width: 100%;">
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

            tableHTML += `</tbody></table></div>`;

            // Mostrar tabla y botón para copiar al portapapeles
            Swal.fire({
                title: `Informe trabajo cotidiano - Grupo: ${grupoSeleccionado.nombre}, Mes: ${meses.find(mesObj => mesObj.id == mes).nombre}, Materia: ${materiaSeleccionada.nombre}`,
                html: tableHTML,
                showCancelButton: true,
                confirmButtonText: 'Copiar para WhatsApp',
                cancelButtonText: 'Cancelar',
                width: '80%',
                didOpen: () => {
                    // Insertamos botón para copiar al portapapeles dentro del modal
                    const container = Swal.getHtmlContainer();
                    const copyBtn = document.createElement('button');
                    copyBtn.textContent = 'Copiar tabla';
                    copyBtn.style.marginTop = '10px';
                    copyBtn.classList.add('btn', 'btn-primary');

                    copyBtn.onclick = () => {
                        // Copiar solo el texto plano de la tabla (podrías adaptar para copiar HTML si quieres)
                        const tempElement = document.createElement('textarea');
                        // Generar texto plano (puedes mejorar formato si quieres)
                        let textoPlano = `Informe trabajo cotidiano\nGrupo: ${grupoSeleccionado.nombre}\nMes: ${meses.find(m => m.id == mes).nombre}\nMateria: ${materiaSeleccionada.nombre}\n\n`;
                        textoPlano += `Alumno\t${Array.from({ length: maxTrabajos }, (_, i) => {
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
                            if (fecha) {
                                const [año, mesF, dia] = fecha.split('-');
                                const mesesAbrev = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                                const mesAbrev = mesesAbrev[parseInt(mesF, 10) - 1];
                                return `${mesAbrev} ${dia}`;
                            }
                            return '#';
                        }).join('\t')}\n`;

                        estudiantesDelGrupo.forEach(estudiante => {
                            textoPlano += estudiante.name + '\t';
                            let trabajos = trabajosPorEstudiante[estudiante.name] || [];
                            for (let i = 0; i < maxTrabajos; i++) {
                                textoPlano += (trabajos[i] || '') + '\t';
                            }
                            textoPlano += '\n';
                        });

                        tempElement.value = textoPlano.trim();
                        document.body.appendChild(tempElement);
                        tempElement.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempElement);

                        // Mostrar aviso de copiado
                        const aviso = document.getElementById('avisoCopiado');
                        if (aviso) {
                            aviso.style.display = 'block';
                            setTimeout(() => { aviso.style.display = 'none'; }, 5000);
                        }
                    };

                    container.appendChild(copyBtn);
                }
            });
        });
    });
}
