function informeTrabajoCotidiano() {
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
        showCloseButton: true,
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
                showCloseButton: true,
                confirmButtonText: 'Siguiente',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    return materiaSeleccionada ? materiaSeleccionada : Swal.showValidationMessage('Por favor selecciona una materia');
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = materias.find(materia => materia.id.toString() === result.value.toString());

                    const estudiantesDelGrupo = estudiantes.filter(est =>
                        est.groupId && est.groupId.toString() === grupoSeleccionado.id.toString()
                    );

                    let maxTrabajos = 0;
                    let trabajosPorEstudiante = {};

                    estudiantesDelGrupo.forEach(estudiante => {
                        let trabajosEstudiante = estudiante.trabajoCotidiano
                            ? estudiante.trabajoCotidiano.map(trabajo => trabajo.type)
                            : [];

                        trabajosPorEstudiante[estudiante.name] = trabajosEstudiante;
                        maxTrabajos = Math.max(maxTrabajos, trabajosEstudiante.length);
                    });

                    let tableHTML = `
                    <div style="overflow-x: auto;">
                        <table class="table" id="trabajoTable">
                            <thead>
                                <tr>
                                    <th>✅</th>`;

                    for (let i = 1; i <= maxTrabajos; i++) {
                        tableHTML += `<th>✅</th>`;
                    }

                    tableHTML += `</tr>
                            </thead>
                            <tbody>`;

                    estudiantesDelGrupo.forEach(estudiante => {
                        tableHTML += `<tr><td>${estudiante.name}</td>`;

                        let trabajos = trabajosPorEstudiante[estudiante.name] || [];
                        for (let i = 0; i < maxTrabajos; i++) {
                            tableHTML += `<td>${trabajos[i] || ''}</td>`;
                        }

                        tableHTML += `</tr>`;
                    });

                    tableHTML += `</tbody></table>
                    </div>`;

                    Swal.fire({
                        html: `
                        <div class="p-2">
                            <h5><strong>Grupo:</strong> ${grupoSeleccionado.nombre}</h5>
                            <h5><strong>Materia:</strong> ${materiaSeleccionada.nombre}</h5>
                        </div>
                        <div>
                            <button class="swal2-confirm swal2-styled" onclick="copiarNombres()">Copiar nombres</button>
                            <button class="swal2-confirm swal2-styled" onclick="copiarTrabajos()">Copiar trabajos</button>
                        </div>
                        ${tableHTML}`,
                        width: '1000px' // Ancho suficiente para que la tabla tenga espacio
                    });
                }
            });
        }
    });
}

function copiarNombres() {
    let nombres = [];
    document.querySelectorAll("#trabajoTable tbody tr td:first-child").forEach(td => {
        nombres.push(td.innerText.trim());
    });

    const textoCopiar = nombres.join("\n");

    navigator.clipboard.writeText(textoCopiar).then(() => {
        const footer = document.getElementById('footerCopiado');
        if (footer) {
            footer.style.display = 'block';
            setTimeout(() => {
                footer.style.display = 'none';
            }, 4000);
        }
        Swal.fire('Copiado', 'Nombres copiados al portapapeles', 'success');
    }).catch(() => {
        Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
    });
}


function copiarTrabajos() {
    let trabajos = [];
    document.querySelectorAll("#trabajoTable tbody tr").forEach(tr => {
        let celdas = [...tr.querySelectorAll("td:not(:first-child)")].map(td => td.textContent);
        trabajos.push(celdas.join("\t")); // Separa por tabulaciones para facilitar el pegado en Excel
    });

    navigator.clipboard.writeText(trabajos.join("\n")).then(() => {
        Swal.fire('Copiado', 'Trabajos copiados al portapapeles', 'success');
    });
}
