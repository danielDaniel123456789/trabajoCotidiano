function importarEstudiantes() {
    Swal.fire({
        title: "Importar Estudiantes",
        html: `
            <p>Pega los nombres de los estudiantes (uno por línea):</p>
            <textarea id="studentTextarea" rows="6" style="width:100%;"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: "Importar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const textareaValue = document.getElementById("studentTextarea").value.trim();

            if (textareaValue) {
                // Convertimos cada línea en un objeto con la estructura esperada
                const newStudents = textareaValue.split("\n").map(name => ({
                    name: name.trim(),
                    surname: "",
                    secondSurname: "",
                    cedula: "",
                    absences: [],
                    lastSelectedMateria: "",
                    trabajoCotidiano: []
                })).filter(student => student.name !== "");

                // Obtener los estudiantes almacenados y fusionar con los nuevos
                const existingStudents = JSON.parse(localStorage.getItem("students")) || [];
                const updatedStudents = [...existingStudents, ...newStudents];

                localStorage.setItem("students", JSON.stringify(updatedStudents));
                Swal.fire("Éxito", "Estudiantes importados correctamente.", "success");
                loadStudents(); // Recargar la lista
            } else {
                Swal.fire("Error", "No se ingresaron estudiantes.", "error");
            }
        }
    });
}
