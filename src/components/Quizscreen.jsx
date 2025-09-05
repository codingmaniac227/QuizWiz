import { useMemo, useState } from "react"
import clsx from "clsx"

export default function Quizscreen({ questions, onBack, onRestart, container, questionContainer, questionChoiceContainer, questionTitle, questionChoice, questionChoiceSelected, questionChoiceCorrect, questionChoiceWrong, questionChoiceDim, checkAnswer, triviaOptionsCheck, playAgainButton, triviaOptionsChecked, scoreBox, quizScore, menu}) {
  // q.id -> chosen choice
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const score = useMemo(
    () =>
      questions.reduce(
        (sum, q) => sum + (answers[q.id] === q.correct_answer ? 1 : 0),
        0
      ),
    [answers, questions]
  )

  const allAnswered = questions.length > 0 &&
    questions.every(q => answers[q.id] != null)

  function choose(qid, choice) {
    if (checked) return
    setAnswers(prev => ({ ...prev, [qid]: choice }))
  }

  function checkAnswers() {
    if (!allAnswered) return
    setChecked(true)
  }

  function playAgain() {
    setAnswers({})
    setChecked(false)
    onRestart?.()
  }

  return (
    <div className={container}>
      {questions.map((q, idx) => {
        const picked = answers[q.id]
        const answered = picked != null

        return (
          <section key={q.id} className={questionContainer}>
            <h3 className={questionTitle}>{q.question}</h3>

            <div className={questionChoiceContainer}>
              {q.choices.map(choice => {
                const isPicked = picked === choice
                const isCorrect = checked && choice === q.correct_answer
                const isWrongPicked = checked && isPicked && !isCorrect
                const isDimmed = checked && !isPicked && !isCorrect

                return (
                  <button
                    key={choice}
                    type="button"
                    className={clsx(
                      questionChoice,
                      isPicked && !checked && questionChoiceSelected,
                      isCorrect && questionChoiceCorrect,
                      isWrongPicked && questionChoiceWrong,
                      isDimmed && questionChoiceDim
                    )}
                    disabled={checked}
                    aria-pressed={isPicked}
                    onClick={() => choose(q.id, choice)}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>

           

            
          </section>
        )
      })}

      <div>
        {!checked ? (
          <>
            <button
              className={checkAnswer}
              onClick={checkAnswers}
              disabled={!allAnswered}
              title={!allAnswered ? "Answer all questions first" : undefined}
            >
              Check answers
            </button>
            <button className={triviaOptionsCheck} onClick={onBack}>Change options</button>
          </>
        ) : (
          <>
            <div className={scoreBox}>
              <p className={quizScore}>
                You scored <strong>{score}</strong>/{questions.length} correct answers
              </p>
              <div className={menu}>
                <button className={playAgainButton} onClick={playAgain}>Play again</button>
                <button className={triviaOptionsChecked} onClick={onBack}>Trivia Options</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
