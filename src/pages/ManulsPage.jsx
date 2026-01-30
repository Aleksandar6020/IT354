import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ManulsPage() {
  const [manuls, setManuls] = useState([])

  useEffect(() => {
    const loadManuls = async () => {
      const response = await fetch('http://localhost:3001/manuls')
      const data = await response.json()
      setManuls(data)
    }

    loadManuls()
  }, [])

  return (
    <div className="container">
      <h1>Manuls</h1>
      <div className="cardGrid">
        {manuls.map((manul) => (
          <div className="card" key={manul.id}>
            <h3>{manul.name}</h3>
            <p>{manul.shortDescription}</p>
            <p>Likes: {manul.likesCount}</p>
            <Link className="button" to={`/manuls/${manul.id}`}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManulsPage
