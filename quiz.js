const quizForm = document.getElementById("quiz-form");
const quizResult = document.getElementById("quiz-result");
const timerDisplay = document.getElementById("quiz-timer");
const correctAnswersList = document.getElementById("correct-answers");
const incorrectQuestionsList = document.getElementById("incorrect-questions");
const retakeLink = document.getElementById("retake-quiz");
/* correct answers for the quiz */
const correctAnswers = {
    q1: "A",
    q2: "B",
    q3: "A",
    q4: "Markup",
    q5: "Delivery",
    q6: ["A", "B"]
};
/* the timer */
const quizDurationSeconds = 10 * 60;
let startTime = Date.now();
let timerInterval = null;
let quizSubmitted = false;
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
/* quiz score calculation */
function submitQuiz() {
    if (quizSubmitted) return;
    quizSubmitted = true;
    stopTimer();
    let score = 0;
    let totalQuestions = 0;
    const incorrectQuestions = [];
    for (const question in correctAnswers) {
        const selected = document.querySelectorAll(`input[name="${question}"]:checked`);
        const textInput = document.querySelector(`input[name="${question}"]`);
        totalQuestions++;
        let isCorrect = false;
        if (question === "q4" || question === "q5") {
            const value = textInput ? textInput.value.trim().toLowerCase() : "";
            isCorrect = value === correctAnswers[question].toLowerCase();
        } else if (question === "q6") {
            const checkedValues = Array.from(selected).map(item => item.value).sort();
            const correctValues = ["A", "B"].sort();
            isCorrect = JSON.stringify(checkedValues) === JSON.stringify(correctValues);
        } else {
            isCorrect = selected.length > 0 && selected[0].value === correctAnswers[question];
        }
        if (isCorrect) {
            score++;
        } else {
            const questionText = document.querySelector(`input[name="${question}"]`)
                .closest(".quiz-question")
                .querySelector("p").textContent;
            incorrectQuestions.push(questionText);
        }
    }
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
    const elapsedTime = formatTime(elapsedSeconds);
    if (quizResult) {
        const status = score >= 4 ? "PASS" : "FAILED";
        quizResult.textContent = `${status}\nYou scored ${score} out of ${totalQuestions} in ${elapsedTime}.`;
        quizResult.classList.toggle("passed", score >= 4);
        quizResult.classList.toggle("failed", score < 4);
    }
    if (correctAnswersList) {
        correctAnswersList.hidden = false;
    }
    if (incorrectQuestionsList) {
        const list = incorrectQuestionsList.querySelector("ul");
        list.replaceChildren();
        if (incorrectQuestions.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No incorrect answers.";
            list.appendChild(item);
        } else {
            incorrectQuestions.forEach(questionText => {
                const item = document.createElement("li");
                item.textContent = questionText;
                list.appendChild(item);
            });
        }
        incorrectQuestionsList.hidden = false;
    }
    if (retakeLink) {
        retakeLink.hidden = false;
    }
}
if (quizForm) {
    quizForm.addEventListener("submit", function (event) {
        event.preventDefault();
        submitQuiz();
    });
}
if (timerDisplay) {
    timerDisplay.textContent = formatTime(quizDurationSeconds);
    timerInterval = setInterval(function () {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remainingSeconds = Math.max(0, quizDurationSeconds - elapsedSeconds);
        timerDisplay.textContent = formatTime(remainingSeconds);
        if (remainingSeconds <= 0) {
            submitQuiz();
        }
    }, 1000);
}