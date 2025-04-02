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
    
    // Filtrar estudiantes del grupo seleccionado
    const estudiantesDelGrupo = estudiantes.filter(est =>
    est.groupId && est.groupId.toString() === grupoSeleccionado.id.toString()
    );
    
    // Preparar datos para copiar
    let datosColumna1 = [];
    let datosColumna2 = [];
    
    // Crear tabla
    let tableHTML = `
    <table class="table">
        <thead>
            <tr>
                <th>Estudiante</th>
                <th>Trabajos Cotidianos</th>
            </tr>
        </thead>
        <tbody>
            `;
    
            if (estudiantesDelGrupo.length > 0) {
            estudiantesDelGrupo.forEach(estudiante => {
            // Filtrar trabajos del estudiante para la materia y mes seleccionados
            const trabajosEstudiante = estudiante.trabajoCotidiano
            ? estudiante.trabajoCotidiano.filter(trabajo => {
            try {
            const fechaTrabajo = new Date(trabajo.date + "T00:00:00"); // Asegura la zona horaria
            return fechaTrabajo.getUTCMonth() === mesIndex; // getUTCMonth() previene errores de zona horaria
            } catch (e) {
            console.error("Error al procesar fecha:", trabajo.date, e);
            return false;
            }
            })
            : [];
    
            // Ordenar trabajos por fecha
            trabajosEstudiante.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            // Agregar a datos para copiar
            datosColumna1.push(estudiante.name);
    
            let trabajosTexto = '';
            if (trabajosEstudiante.length > 0) {
            trabajosTexto = trabajosEstudiante.map(trabajo =>
            ` ${trabajo.type}, `
            ).join('\n');
            } else {
            trabajosTexto = 'No hay trabajos registrados';
            }
            datosColumna2.push(trabajosTexto);
    
            tableHTML += `
            <tr>
                <td>
                    ${estudiante.name}
                </td>
                <td>
                    `;
    
                    if (trabajosEstudiante.length > 0) {
    
                    trabajosEstudiante.forEach(trabajo => {
                    tableHTML += `
                   
                    ${trabajo.type} , 
    
                    `;
                    });
                    tableHTML += `</ul>`;
                    } else {
                    tableHTML += `<em>No hay trabajos registrados</em>`;
                    }
    
                    tableHTML += `
                </td>
            </tr>
            `;
            });
            } else {
            tableHTML += `
            No hay estudiantes en este grupo`;
            }
    
            tableHTML += `</tbody>
    </table>`;
    
    // Función para copiar al portapapeles
    const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
    Swal.fire({
    icon: 'success',
    title: 'Copiado',
    text: 'Los datos han sido copiados al portapapeles',
    timer: 1500,
    showConfirmButton: false
    });
    }).catch(err => {
    console.error('Error al copiar: ', err);
    Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'No se pudo copiar al portapapeles'
    });
    });
    };
    
    // Botones para copiar
    const botonesCopiar = `
    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
        <button id="copiarColumna1" class="swal2-confirm swal2-styled" style="background-color: #4CAF50;">
            Copiar Nombres
        </button>
        <button id="copiarColumna2" class="swal2-confirm swal2-styled" style="background-color: #2196F3;">
            Copiar Trabajos
        </button>
    </div>
    `;
    
    Swal.fire({
    title: 'Resumen de Trabajos',
    html: `
    <div style="margin-bottom: 15px;">
        <p><strong>Grupo:</strong> ${grupoSeleccionado.nombre}</p>
        <p><strong>Materia:</strong> ${materiaSeleccionada.nombre}</p>
        <p><strong>Mes:</strong> ${nombreMes} (${diasDelMes} días)</p>
    </div>
    ${tableHTML}
    ${botonesCopiar}
    `,
    icon: 'info',
    width: '900px',
    customClass: {
    popup: 'custom-swal-popup'
    },
    didOpen: () => {
    document.getElementById('copiarColumna1').addEventListener('click', () => {
    copiarAlPortapapeles(datosColumna1.join('\n'));
    });
    
    document.getElementById('copiarColumna2').addEventListener('click', () => {
        // Obtener todos los elementos de la segunda columna (suponiendo que son celdas en una tabla)
        let celdasColumna2 = document.querySelectorAll('table tr td:nth-child(2)'); // Selecciona la segunda columna de la tabla
    
        // Clonar los datos de la columna, creando un array con los valores de las celdas
        let datosClonados = Array.from(celdasColumna2).map(celda => celda.innerText.trim());
    
        // Unir los datos clonados con una coma y espacio
        let textoParaCopiar = datosClonados.join('');
    
        // Verificar si la cadena termina con una coma seguida de un espacio y eliminarla
        if (textoParaCopiar.endsWith('')) {
            textoParaCopiar = textoParaCopiar.slice(0, -2); // Elimina la última coma y espacio
        }
    
        // Copiar los datos clonados al portapapeles
        copiarAlPortapapeles(textoParaCopiar);
    });
    
    
    
    }
    });
    }
    });
    }
    });
    }
    });
    }