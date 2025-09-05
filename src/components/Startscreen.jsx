
export default function Startscreen({ container, headerContainer, h1, h2, startbutton, getQuestions}) {
  

  
  return (
    <>
      <div className={container}>
        <header className={headerContainer}>
          <h1 className={h1}>QuizWiZ</h1>
          <h2 className={h2}>Stimulate your mind!</h2>
        </header>
        <button className={startbutton} onClick={getQuestions}>
          Start quiz
        </button>
      </div>
    </>
  )
}