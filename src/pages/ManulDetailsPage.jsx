import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function ManulDetailsPage() {
  const { id } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [manul, setManul] = useState(null)
  const [liked, setLiked] = useState(false)

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

  if (!manul) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>{manul.name}</h1>
      <img src={manul.photoUrl} alt={manul.name} />
      <p>{manul.longStory}</p>
      <p>Likes: {manul.likesCount}</p>
      <button type="button" onClick={handleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    </div>
  )
}

export default ManulDetailsPage
