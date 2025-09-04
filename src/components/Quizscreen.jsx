import { useMemo, useState } from "react"
import clsx from "clsx"

export default function Quizscreen({ questions, onBack, onRestart }) {
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
    <div className="allq">
      {questions.map((q, idx) => {
        const picked = answers[q.id]
        const answered = picked != null

        return (
          <section key={q.id} className="qblock">
            <h3 className="qtitle">{q.question}</h3>

            <div className="choices">
              {q.choices.map(choice => {
                const isPicked = picked === choice
                const isCorrect = checked && choice === q.correct_answer
                const isWrongPicked = checked && isPicked && !isCorrect

                return (
                  <button
                    key={choice}
                    type="button"
                    className={clsx(
                      "chip",
                      isPicked && !checked && "chip--selected",
                      isCorrect && "chip--correct",
                      isWrongPicked && "chip--wrong"
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

            {checked && (
              <p className="feedback">
                {answers[q.id] === q.correct_answer
                  ? "Correct ✅"
                  : <>Correct answer: <strong>{q.correct_answer}</strong></>}
              </p>
            )}

            {idx < questions.length - 1 && <hr className="divider" />}
          </section>
        )
      })}

      <div className="footer">
        {!checked ? (
          <>
            <button
              className="primary"
              onClick={checkAnswers}
              disabled={!allAnswered}
              title={!allAnswered ? "Answer all questions first" : undefined}
            >
              Check answers
            </button>
            <button className="link" onClick={onBack}>Change options</button>
          </>
        ) : (
          <>
            <p className="score">
              You scored <strong>{score}</strong>/{questions.length} correct answers
            </p>
            <button className="primary" onClick={playAgain}>Play again</button>
            <button className="link" onClick={onBack}>Change options</button>
          </>
        )}
      </div>
    </div>
  )
}
