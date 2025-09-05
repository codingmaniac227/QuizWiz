
export default function Startscreen({ container, headerContainer, logoSpan, h1, h2, startbutton, getQuestions}) {
  

  
  return (
    <>
      <div className={container}>
        <header className={headerContainer}>
          <h1 className={h1}>Quiz<span className={logoSpan}>WIZZED</span></h1>
          <h2 className={h2}>Stimulate your mind!</h2>
        </header>
        <button className={startbutton} onClick={getQuestions}>
          PLAY
        </button>
      </div>
    </>
  )
}