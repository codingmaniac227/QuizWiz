import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

import Header from './components/Header'
import './index.css'
import './App.css'

function App() {
  // State Values
  const [count, setCount] = useState(0)

  // Derived Values

  return (
    <>
      <main className='quizwiz-container'>
        <Header className='quizwiz-header' h1className='quizwiz-h1' h2className='quizwiz-h2'/>
        <button className='quizwiz-startbutton'>Start quiz</button>
      </main>

    </>
  )
}

export default App
