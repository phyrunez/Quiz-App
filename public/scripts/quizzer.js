const API_URL = "https://opentdb.com/api.php"
// Note: Each question is timed at 20sec
const SECONDS_PER_QUESTION = 10
class Quizzer {
        constructor({ numberOfQuestions, isTimed } = {}) {
                this.numberOfQuestions =  numberOfQuestions > 100 ? 100 : numberOfQuestions;
                this.isTimed = isTimed || false;
                this.currentQuestionIndex = 0;
                this.answers = [];
                this.numberInicator = document.querySelector("#question-number")
                this.questionPreviewer = document.querySelector("#question-previewer")
                this.questionCategory = document.querySelector("#question-category")
                this.optionsContainer = document.querySelector("#options-container")
                this.nextButton = document.querySelector("#next")
                this.prevButton = document.querySelector("#prev")
                this.submitButton = document.querySelector("#submit")
                this.resultPage = document.querySelector("#result")
                this.questionPage = document.querySelector("#question-area")
                this.homePage = document.querySelector("#settings")
                this.correctScore = document.querySelector("#correct-score")
                this.wrongScore = document.querySelector("#wrong-score")
                this.totalScore = document.querySelector("#total-score")
                this.restartButton = document.querySelector("#restart-test")
                this.homeButton = document.querySelector("#go-home")
                this.timerElem = document.querySelector("#timer")
        }

        getQuestions() {
                return new Promise((resolve) => {
                        fetch(`${API_URL}?amount=${this.numberOfQuestions}`)
                        .then((resp) => resp.json())
                        .then((resp) => {
                                if (Object.hasOwn(resp, "results")) {
                                        const transformedResponse = resp.results.map((item) => {
                                                const options = this.shuffleOptions([...item.incorrect_answers, item.correct_answer])
                                                return {...item, options}
                                        })
                                        this.questions = transformedResponse
                                        this.currentQuestion = this.questions[this.currentQuestionIndex]
                                        resolve({})
                                }
                        })
                        .catch(err => {
                                reject({});
                        })
                })
        }

        startQuiz() {
                this.time = this.numberOfQuestions * SECONDS_PER_QUESTION
                this.timeInMill = this.time * 1000
                if (this.isTimed) {
                        this.timer = setTimeout(() => this.endQuiz(), this.timeInMill)
                        this.interval = setInterval(() => this.setTimer(), 1000)
                }
                this.renderQuestion()
        }

        setNextQuestion() {
                this.nextButton.setAttribute("disabled", true);
                if (this.currentQuestionIndex >= this.numberOfQuestions) return
                this.prevButton.removeAttribute("disabled");
                this.currentQuestionIndex++
                this.currentQuestion = this.questions[this.currentQuestionIndex]
                this.renderQuestion()
        }

        setPreviousQuestion() {
                if (!this.currentQuestionIndex) {
                        this.prevButton.setAttribute("disabled", true);
                        return
                }
                this.nextButton.removeAttribute("disabled");
                this.currentQuestionIndex--
                this.currentQuestion = this.questions[this.currentQuestionIndex]
                this.renderQuestion();
        }

        setAnswer(answer) {
                this.answers[this.currentQuestionIndex] = answer.toLowerCase() === this.questions[this.currentQuestionIndex].correct_answer.toLowerCase()
                if (this.numberOfQuestions > 1 && this.numberOfQuestions !== this.answers.length) this.nextButton.removeAttribute("disabled")
                if(this.numberOfQuestions === this.answers.length) this.submitButton.removeAttribute("disabled")
        }

        endQuiz() {
                this.correctAnswers = this.answers.filter(answer => Boolean(answer)).length
                this.wrongAnswers = this.numberOfQuestions - this.correctAnswers
                this.questionPage.classList.add("d-none");
                this.correctScore.textContent = this.correctAnswers;
                this.wrongScore.textContent = this.wrongAnswers;
                this.totalScore.textContent = this.numberOfQuestions;
                this.resultPage.classList.remove("d-none");
                if (this.timer) {
                        clearTimeout(this.timer);
                        clearInterval(this.interval);
                }
        }

        shuffleOptions(options) {
                for (let i = options.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [options[i], options[j]] = [options[j], options[i]];
                }
                return options
        }

        renderQuestion() {
                this.numberInicator = document.querySelector("#question-number")
                this.numberInicator.textContent = this.currentQuestionIndex + 1;
                this.questionPreviewer.textContent = this.currentQuestion.question
                let options = ''
                this.currentQuestion.options.forEach((item) => {
                        options += `<div class="d-flex option p-3">
                                        <input type="radio" name="answer" value="${item}" onchange="handleSelection(event)">
                                        <label for="questionA" class="ms-2">${item}</label>
                                </div>`
                })
                this.optionsContainer.innerHTML = options;
                if (!this.isTimed) {
                        this.timerElem.classList.add("d-none")
                } else {
                        this.setTimer(false)
                }
        }

        setTimer(shouldDeduct=true) {
                if(shouldDeduct) this.time -= 1
                let minutes = Math.floor(this.time / (60));
                let seconds = this.time > 60 ? this.time % 60 : this.time
                if (minutes.toString().length === 1) minutes = minutes.toString().padStart(2, 0)
                if (seconds.toString().length === 1) seconds = seconds.toString().padStart(2, 0)
                this.timerElem.innerHTML = `${minutes}:${seconds}`
        }
}