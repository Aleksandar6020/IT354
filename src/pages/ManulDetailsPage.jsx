import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function ManulDetailsPage() {
  const { id } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [manul, setManul] = useState(null)
  const [liked, setLiked] = useState(false)
  const [suggestionText, setSuggestionText] = useState('')

  useEffect(() => {
    const loadManul = async () => {
      const response = await fetch(`http://localhost:3001/manuls/${id}`)
      const data = await response.json()
      setManul(data)
      setLiked(false)
    }

    loadManul()
  }, [id])

  const handleLike = async () => {
    if (!currentUser) {
      alert('Login required')
      return
    }

    const newLikes = liked ? manul.likesCount - 1 : manul.likesCount + 1

    const response = await fetch(`http://localhost:3001/manuls/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likesCount: newLikes }),
    })

    if (response.ok) {
      const updated = await response.json()
      setManul(updated)
      if (!liked) {
        await fetch('http://localhost:3001/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            manulId: updated.id,
            type: 'LIKE',
            createdAt: new Date().toISOString(),
          }),
        })
      }
      setLiked(!liked)
    }
  }

  const handleSuggestionSubmit = async (event) => {
    event.preventDefault()

    if (!currentUser) {
      alert('Login required')
      return
    }

    const response = await fetch('http://localhost:3001/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        manulId: Number(id),
        type: 'STORY',
        content: suggestionText,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      }),
    })

    if (response.ok) {
      setSuggestionText('')
      alert('Suggestion sent')
    }
  }

  return (
    <div className="container">
      {!manul ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{manul.name}</h1>
          <div className="details">
            <img className="detailsImage" src={manul.photoUrl} alt={manul.name} />
            <div className="detailsBody">
              <p>{manul.longStory}</p>
              <p>Likes: {manul.likesCount}</p>
              <button className="button" type="button" onClick={handleLike}>
                {liked ? 'Unlike' : 'Like'}
              </button>
            </div>
          </div>
          <h2>Suggest a story</h2>
          <form className="form" onSubmit={handleSuggestionSubmit}>
            <div className="formRow">
              <label className="label">Your story</label>
              <textarea
                className="input"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                required
              />
            </div>
            <button className="button" type="submit">Submit suggestion</button>
          </form>
        </>
      )}
    </div>
  )
}

export default ManulDetailsPage
