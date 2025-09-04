
export default function Startscreen({ header, h1, h2, startbutton, getQuestions }) {
  return (
    <>
      <header className={header}>
        <h1 className={h1}>QuizWiZ</h1>
        <h2 className={h2}>Stimulate your mind!</h2>
      </header>
      <button className={startbutton} onClick={getQuestions}>
        Start quiz
      </button>
    </>
  )
}