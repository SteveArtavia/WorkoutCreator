document.getElementById('exercise-form').addEventListener('submit', handleFormSubmit);
document.addEventListener('DOMContentLoaded', loadExercises);
document.getElementById('sort-options').addEventListener('change', loadExercises);
document.getElementById('export-btn').addEventListener('click', exportRoutines);
document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', importRoutines);

let isEditing = false;
let currentExercise = null;

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('exercise-name').value;
    const category = document.getElementById('exercise-category').value;
    const reps = document.getElementById('exercise-reps').value;
    const sets = document.getElementById('exercise-sets').value;
    const notes = document.getElementById('exercise-notes').value;

    const exercise = {
        name,
        category,
        reps,
        sets,
        notes
    };

    if (isEditing) {
        updateExercise(exercise);
        isEditing = false;
        currentExercise = null;
    } else {
        saveExercise(exercise);
        displayExercise(exercise);
    }

    document.getElementById('exercise-form').reset();
}

function saveExercise(exercise) {
    let exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    exercises.push(exercise);
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function loadExercises() {
    const exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    const sortOption = document.getElementById('sort-options').value;
    exercises.sort((a, b) => {
        if (a[sortOption] > b[sortOption]) {
            return 1;
        } else if (a[sortOption] < b[sortOption]) {
            return -1;
        }
        return 0;
    });
    document.getElementById('routine-list').innerHTML = '';
    exercises.forEach(displayExercise);
}

function displayExercise(exercise) {
    const routineList = document.getElementById('routine-list');

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    listItem.innerHTML = `
        <div>
            <span>${exercise.name} - ${exercise.category} - ${exercise.reps} reps x ${exercise.sets} sets</span>
            <small class="d-block text-muted">${exercise.notes}</small>
        </div>
        <div>
            <button class="btn btn-secondary btn-sm edit">Edit</button>
            <button class="btn btn-danger btn-sm delete">Delete</button>
        </div>
    `;

    listItem.querySelector('.delete').addEventListener('click', () => {
        removeExercise(exercise);
        routineList.removeChild(listItem);
    });

    listItem.querySelector('.edit').addEventListener('click', () => {
        editExercise(exercise, listItem);
    });

    routineList.appendChild(listItem);
}

function removeExercise(exercise) {
    let exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    exercises = exercises.filter(e => e.name !== exercise.name || e.category !== exercise.category || e.reps !== exercise.reps || e.sets !== exercise.sets || e.notes !== exercise.notes);
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function editExercise(exercise, listItem) {
    document.getElementById('exercise-name').value = exercise.name;
    document.getElementById('exercise-category').value = exercise.category;
    document.getElementById('exercise-reps').value = exercise.reps;
    document.getElementById('exercise-sets').value = exercise.sets;
    document.getElementById('exercise-notes').value = exercise.notes;

    isEditing = true;
    currentExercise = exercise;

    document.getElementById('routine-list').removeChild(listItem);
    removeExercise(exercise);
}

function updateExercise(updatedExercise) {
    saveExercise(updatedExercise);
    displayExercise(updatedExercise);
}

function exportRoutines() {
    const exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    let textContent = 'Exercise Routine:\n\n';
    exercises.forEach(exercise => {
        textContent += `Name: ${exercise.name}\nCategory: ${exercise.category}\nRepetitions: ${exercise.reps}\nSets: ${exercise.sets}\nNotes: ${exercise.notes}\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'routine.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function importRoutines(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const exercises = JSON.parse(e.target.result);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        loadExercises();
    };
    reader.readAsText(file);
}
