document.getElementById('exercise-form').addEventListener('submit', addExercise);
document.addEventListener('DOMContentLoaded', loadExercises);

function addExercise(event) {
    event.preventDefault();

    const name = document.getElementById('exercise-name').value;
    const reps = document.getElementById('exercise-reps').value;
    const sets = document.getElementById('exercise-sets').value;

    const exercise = {
        name,
        reps,
        sets
    };

    saveExercise(exercise);
    displayExercise(exercise);

    document.getElementById('exercise-form').reset();
}

function saveExercise(exercise) {
    let exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    exercises.push(exercise);
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function loadExercises() {
    const exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    exercises.forEach(displayExercise);
}

function displayExercise(exercise) {
    const routineList = document.getElementById('routine-list');

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    listItem.innerHTML = `
        <span>${exercise.name} - ${exercise.reps} reps x ${exercise.sets} sets</span>
        <button class="btn btn-danger btn-sm delete">Delete</button>
    `;

    listItem.querySelector('.delete').addEventListener('click', () => {
        removeExercise(exercise);
        routineList.removeChild(listItem);
    });

    routineList.appendChild(listItem);
}

function removeExercise(exercise) {
    let exercises = localStorage.getItem('exercises') ? JSON.parse(localStorage.getItem('exercises')) : [];
    exercises = exercises.filter(e => e.name !== exercise.name || e.reps !== exercise.reps || e.sets !== exercise.sets);
    localStorage.setItem('exercises', JSON.stringify(exercises));
}
