     // Guardar un estudiante en localStorage
     function saveStudent(student) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
    }