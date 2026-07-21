import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('กำลังโหลด...')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('เรียก API ไม่สำเร็จ')
        }
        return response.json()
      })
      .then((data) => {
        setMessage(data.message)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  return (
    <main>
      <h1>ATSlots</h1>
      {error ? <p>เกิดข้อผิดพลาด: {error}</p> : <p>{message}</p>}
    </main>
  )
}

export default App