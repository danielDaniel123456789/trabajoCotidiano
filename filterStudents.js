function filterStudents() {
    const query = document.getElementById('buscarEstudiante').value.toLowerCase();
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    const filteredStudents = students.filter(student => {
        // Comprobar que las propiedades existan antes de llamar a toLowerCase()
        return (
            (student.name?.toLowerCase().includes(query)) || 
            (student.surname?.toLowerCase().includes(query)) || 
            (student.secondSurname?.toLowerCase().includes(query)) ||
            (student.id?.toLowerCase().includes(query))
        );
    });
    displayStudents(filteredStudents);
}

