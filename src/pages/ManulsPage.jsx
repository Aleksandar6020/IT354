import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ManulsPage() {
  const [manuls, setManuls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadManuls = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('http://localhost:3001/manuls')
        if (!res.ok) {
          throw new Error('Failed to load manuls')
        }

        const data = await res.json()
        setManuls(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadManuls()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Manuls</h1>

      <div className="cardGrid">
        {manuls.map((m) => (
          <div key={m.id} className="card">
            <img
              className="cardImage"
              src={m.photoUrl}
              alt={m.name}
            />
            <h3>{m.name}</h3>
            <p>{m.shortDescription}</p>
            <Link className="button" to={`/manuls/${m.id}`}>
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManulsPage
