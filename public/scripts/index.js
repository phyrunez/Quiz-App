let quizzer;
/**
 * Set options for number of question
 */
const selector = document.querySelector("#question-number-selector");
let htmlOption = "";
const length = 100;
let counter = 0
while (counter < length) {
        htmlOption += `<option value="${counter + 1}">${counter + 1}</option>`;
        counter++;
}
selector.innerHTML = htmlOption;

/**
 * Handle start quiz
 */
const startQuiz = async (e) => {
        const numberOfQuestions = document.querySelector("#question-number-selector")
        const isTimed = document.querySelector("#is-timed-selector")
        const settings = document.querySelector("#settings")
        const questionArea = document.querySelector("#question-area")
        const button = document.querySelector("#start-quiz-button")
        quizzer = new Quizzer({
                numberOfQuestions: +numberOfQuestions.value,
                isTimed: isTimed.checked
        })
        button.textContent = "Loading Questions..."
        try {
                await quizzer.getQuestions()
                settings.classList.add("d-none");
                questionArea.classList.remove("d-none");
                quizzer.startQuiz();
                button.textContent = "Start quiz"
        } catch {
                button.textContent = "Start quiz"
        }
}

/**
 * Handle prev
 */
const handlePrev = () => {
        quizzer.setPreviousQuestion()
}

/**
 * Handle next
 */
const handleNext = () => {
        quizzer.setNextQuestion()
}

/**
 * Handle selection
 */
const handleSelection = (event) => {
        const answer = event.target.value
        quizzer.setAnswer(answer)
}

/**
 * Handle submit
 */
const handleSubmit= () => {
        quizzer.endQuiz()
}

/**
 * Restart test
 */
const restartTest = () => {
        quizzer.startQuiz()
        document.querySelector("#question-area").classList.remove("d-none")
        document.querySelector("#result").classList.add("d-none")
}

/**
 * Go home
 */
const goHome = () => {
        quizzer = undefined;
        document.querySelector("#settings").classList.remove("d-none")
        document.querySelector("#result").classList.add("d-none")
}