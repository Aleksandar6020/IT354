import { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  photoUrl: '',
  shortDescription: '',
  longStory: '',
  locationType: 'ZOO',
  region: '',
}

function AdminPage() {
  const [manuls, setManuls] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const loadManuls = async () => {
    const response = await fetch('http://localhost:3001/manuls')
    const data = await response.json()
    setManuls(data)
  }

  useEffect(() => {
    loadManuls()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (manul) => {
    setEditingId(manul.id)
    setForm({
      name: manul.name || '',
      photoUrl: manul.photoUrl || '',
      shortDescription: manul.shortDescription || '',
      longStory: manul.longStory || '',
      locationType: manul.locationType || 'ZOO',
      region: manul.region || '',
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDelete = async (id) => {
    const confirmed = confirm('Delete this manul?')
    if (!confirmed) return

    await fetch(`http://localhost:3001/manuls/${id}`, {
      method: 'DELETE',
    })
    setManuls((prev) => prev.filter((manul) => manul.id !== id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (editingId) {
      const response = await fetch(`http://localhost:3001/manuls/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const updated = await response.json()
      setManuls((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      handleCancel()
      return
    }

    const payload = {
      ...form,
      likesCount: 0,
      favoritesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    const response = await fetch('http://localhost:3001/manuls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const created = await response.json()
    setManuls((prev) => [...prev, created])
    setForm(emptyForm)
  }

  return (
    <div>
      <h1>Admin panel</h1>

      <h2>{editingId ? 'Edit manul' : 'Create manul'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Photo URL
            <input name="photoUrl" value={form.photoUrl} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Short description
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Long story
            <textarea name="longStory" value={form.longStory} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Location type
            <select name="locationType" value={form.locationType} onChange={handleChange}>
              <option value="ZOO">ZOO</option>
              <option value="WILD">WILD</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Region (optional)
            <input name="region" value={form.region} onChange={handleChange} />
          </label>
        </div>
        <button type="submit">{editingId ? 'Save' : 'Create'}</button>
        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <h2>Manuls</h2>
      <div>
        {manuls.map((manul) => (
          <div key={manul.id}>
            <strong>{manul.name}</strong> — {manul.locationType}{' '}
            <button type="button" onClick={() => handleEdit(manul)}>
              Edit
            </button>{' '}
            <button type="button" onClick={() => handleDelete(manul.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage
