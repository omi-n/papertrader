import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/Home.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="home-container">
      <h1>Paper Trader</h1>
    <div className="card">
        <p>Sign Up To Get Started or Log In If You Already Have An Account!</p>
      </div>
      </div>
    </>
  )
}

export default Home;