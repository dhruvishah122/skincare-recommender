import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SkinCareApp from './SkinCareRecommendation'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SkinCareApp/>
    </>
  )
}

export default App
