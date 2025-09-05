import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

import Startscreen from './components/Startscreen'
import Optionscreen from './components/Optionscreen'
import Quizscreen from './components/Quizscreen'
import './App.css'

function App() {
  // State Values
  const [stage, setStage] = useState('start')
  const [options, setOptions] = useState({
    amount: 10,
    categoryId: '',
    difficulty: '',
    type: '',
    encode: 'url3986'
  })
  const [token, setToken] = useState(null)

  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  

  const updateOption = (key, value) =>
    setOptions(prev => ({ ...prev, [key]: value }))

  // Derived Values

  // Functions & State Changes

  useEffect(() => {
      (async () => {
        const r = await fetch('https://opentdb.com/api_token.php?command=request')
        const d = await r.json()
        setToken(d?.token ?? null)
      })()
    }, [])

  const buildUrl = (opts) => {
    const p = new URLSearchParams()
    p.set('amount', String(opts.amount))
    if (opts.categoryId) p.set('category', String(opts.categoryId))
    if (opts.difficulty) p.set('difficulty', opts.difficulty)
    if (opts.type) p.set('type', opts.type)
    if (opts.encode) p.set('encode', opts.encode)
    if (token) p.set('token', token)
    return `https://opentdb.com/api.php?${p.toString()}`
  }

  const decode = (s) => {
    if (!s) return s
    if (options.encode === 'base64') {
      try { return decodeURIComponent(escape(atob(s))) } catch { return atob(s) }
    }
    try { return decodeURIComponent(s) } catch { return s }
  }

  async function startQuiz() {
  setError('')
  setStage('loading')

  try {
    const url = buildUrl(options)        // 1) build the request URL
    const res = await fetch(url)         // 2) send the HTTP GET request
    if (!res.ok) throw new Error('Network error')

    const data = await res.json()        // 3) parse JSON response

    // 4) OpenTDB-specific success code (0 = OK)
    if (data.response_code !== 0) {
      throw new Error('No questions for those options. Try different filters.')
    }

    // 5) normalize & save questions (decode HTML/base64 if needed)

    const normalized = data.results.map((q, i) => {
      const correct = decode(q.correct_answer)
      const incorrect = q.incorrect_answers.map(decode)
      return {
        id: `${Date.now()}-${i}`,
        category: decode(q.category),
        difficulty: q.difficulty,
        type: q.type,
        question: decode(q.question),
        correct_answer: correct,
        choices: [...incorrect, correct].sort(() => Math.random() - 0.5),
      }
    })

    setQuestions(normalized)
    setStage('quiz')
  } catch (err) {
    setError(err.message || 'Failed to load questions.')
    setStage('options')
  }
}

  function optionsScreen() {
    setStage('options')
  }

  function quizScreen() {
    setStage('quiz')
  }

  
  return (
    <>
      <main className='quizwizzed-container'>
        {stage === 'start' && (
          <Startscreen
            container='quizwizzed-container-start'
            shootingStar='quizwizzed-background-shootingstar-start'
            headerContainer='quizwizzed-container-header-start'
            logoSpan='quizwizzed-logo-span' 
            h1='quizwizzed-h1-start' 
            h2='quizwizzed-h2-start' 
            startbutton='quizwizzed-startbutton-start'
            getQuestions={optionsScreen} 
          />
        )}
        
        {stage === 'options' && ( 
          <Optionscreen
          container ='quizwizzed-container-options'
          logoSpanOptions='quizwizzed-logospan-options'
          headerContainer='quizwizzed-headercontainer-options'
          labelContainerOptions='quizwizzed-label-container-options'
          labelSingleContainerOptions='quizwizzed-single-label-container-options'
          backToStart='quizwizzed-backtostart-button-options'
          startQuiz='quizwizzed-startquiz-button-options'
          values={options}
          onChange={updateOption}
          onSubmit={startQuiz}
          onBack={() => setStage('start')}
          />
        )}

        {stage === 'loading' && <p>Loading questions…</p>}
        {!!error && stage !== 'start' && <p className="error">{error}</p>}

        {stage === 'quiz' && (
          <Quizscreen
            container='quizwizzed-container-quiz'
            questionContainer='quizwizzed-questioncontainer-quiz'
            questionChoiceContainer='quizwizzed-questionchoicecontainer-quiz'
            questionTitle='quizwizzed-questiontitle-quiz'
            questionChoice='quizwizzed-questionchoice-quiz'
            questionChoiceSelected='quizwizzed-questionchoiceselected-quiz'
            questionChoiceCorrect='quizwizzed-questionchoicecorrect-quiz'
            questionChoiceWrong='quizwizzed-questionchoiceincorrect-quiz'
            questionChoiceDim='quizwizzed-questionchoicedimmed-quiz'
            checkAnswer='quizwizzed-checkanswer-quiz'
            triviaOptionsCheck='quizwizzed-triviaoptions-quiz'
            playAgainButton='quizwizzed-playagain-quiz'
            triviaOptionsChecked='quizwizzed-triviaoptionschecked-quiz'
            scoreBox='quizwizzed-scorebox-quiz'
            quizScore='quizwizzed-quizscore-quiz'
            menu='quizwizzed-menu-quiz'
            questions={questions}
            onBack={() => setStage('options')}
            onRestart={() => { setQuestions([]); setStage('start') }}
          />
        )}
      </main>

    </>
  )
}

export default App
