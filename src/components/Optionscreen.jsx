import { useEffect, useState } from 'react'



export default function Optionscreen({ values, onChange, onSubmit, onBack }) {
  const { amount, categoryId, difficulty, type, encode } = values

  const [categories, setCategories] = useState([])
  const [catsLoading, setCatsLoading] = useState(true)
  const [catsError, setCatsError] = useState('')

  useEffect(() => {
    // Tracks if component is still mounted
    let alive = true
    const ctrl = new AbortController()

    
    ;(async () => {
        try {
            const r = await fetch('https://opentdb.com/api_category.php', { signal: ctrl.signal })
            const d = await r.json()
            
            // Only update state if component is still mounted
            if (alive)  setCategories(d?.trivia_categories ?? [])

        } catch {
            if (alive) setCatsError('Could not load categories. Using "Any".')

        } finally {
            if (alive) setCatsLoading(false)
    }
    })()

    return () => {
        alive = false
        ctrl.abort()
    }
  },  [])

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} >
                <label>
                    Number of questions(1-50)
                    <input
                        type='number'
                        min={1} max={50}
                        value={amount}
                        onChange={(e) => onChange('amount', Math.max(1, Math.min(50, +e.target.value || 10)))}

                    />
                </label>

                <label>
                    Category
                    <select
                        value={categoryId}
                        onChange={(e) => onChange('categoryId', e.target.value)}
                        disabled={catsLoading}
                        aria-describedby={catsError ? 'catsError' : undefined}
                    >

                        <option value=''>Any category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {catsError && (
                        <small id='catsError' className='error'>{catsError}</small>
                    )}
                </label>

                <label>
                    Difficulty
                    <select
                        value={difficulty}
                        onChange={(e) => onChange('difficulty', e.target.value)}
                    >
                        <option value=''>Any</option>
                        <option value='easy'>Easy</option>
                        <option value='medium'>Medium</option>
                        <option value='hard'>Hard</option>
                    </select>
                </label>

                <label>
                    Type
                    <select
                        value={type}
                        onChange={(e) => onChange('type', e.target.value)}
                    >
                        <option value=''>Any</option>
                        <option value='multiple'>Multiple choice</option>                                                <option></option>
                        <option value='boolean'>True / False</option>
                    </select>  
                </label>

                <label>
                    Encoding
                    <select
                        value={encode}
                        onChange={(e) => onChange('encode', e.target.value)}
                    >
                        <option value='url3986'>URL-encoded (recommended)</option>
                        <option value='base64'>Base64</option>
                    </select>     
                </label>

                <div className='actions'>
                    <button type='button' onClick={onBack}>Back</button>
                    <button type='submit'>Start quiz</button>
                </div>
            </form>
        </>
    )
}