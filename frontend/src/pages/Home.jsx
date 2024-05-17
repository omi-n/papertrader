import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/Home.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Paper Trader</h1>
      <div className="card">
        <p>Click on Sign Up to get Started, or Login if you have an account!</p>
      </div>
    </>
  )
}

export default Home;