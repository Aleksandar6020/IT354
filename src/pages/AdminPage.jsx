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
  const [suggestions, setSuggestions] = useState([])

  const loadManuls = async () => {
    const response = await fetch('http://localhost:3001/manuls')
    const data = await response.json()
    setManuls(data)
  }

  const loadSuggestions = async () => {
    const response = await fetch('http://localhost:3001/suggestions?type=STORY')
    const data = await response.json()
    setSuggestions(data)
  }

  useEffect(() => {
    loadManuls()
    loadSuggestions()
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

  const handleReject = async (suggestion) => {
    const response = await fetch(`http://localhost:3001/suggestions/${suggestion.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'REJECTED' }),
    })

    if (response.ok) {
      const updated = await response.json()
      setSuggestions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    }
  }

  const handleApprove = async (suggestion) => {
    const response = await fetch(`http://localhost:3001/suggestions/${suggestion.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'APPROVED' }),
    })

    if (!response.ok) return

    const updatedSuggestion = await response.json()
    const manulResponse = await fetch(`http://localhost:3001/manuls/${suggestion.manulId}`)
    const manul = await manulResponse.json()
    const currentStory = manul.longStory || ''
    const updatedLongStory = `${currentStory}\n\n[Approved story] ${suggestion.content}`

    await fetch(`http://localhost:3001/manuls/${suggestion.manulId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ longStory: updatedLongStory }),
    })

    setSuggestions((prev) => prev.map((s) => (s.id === updatedSuggestion.id ? updatedSuggestion : s)))
  }

  return (
    <div className="container">
      <h1>Admin panel</h1>

      <h2>{editingId ? 'Edit manul' : 'Create manul'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <label className="label">Name</label>
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="formRow">
          <label className="label">Photo URL</label>
          <input
            className="input"
            name="photoUrl"
            value={form.photoUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formRow">
          <label className="label">Short description</label>
          <input
            className="input"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formRow">
          <label className="label">Long story</label>
          <textarea
            className="input"
            name="longStory"
            value={form.longStory}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formRow">
          <label className="label">Location type</label>
          <select
            className="input"
            name="locationType"
            value={form.locationType}
            onChange={handleChange}
          >
            <option value="ZOO">ZOO</option>
            <option value="WILD">WILD</option>
          </select>
        </div>
        <div className="formRow">
          <label className="label">Region (optional)</label>
          <input className="input" name="region" value={form.region} onChange={handleChange} />
        </div>
        <button className="button" type="submit">{editingId ? 'Save' : 'Create'}</button>
        {editingId && (
          <button className="button buttonSecondary" type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <h2>Manuls</h2>
      <div className="table">
        {manuls.map((manul) => (
          <div className="row" key={manul.id}>
            <div className="rowMain">
              <strong>{manul.name}</strong> — {manul.locationType}
            </div>
            <div className="rowActions">
              <button className="button buttonSecondary" type="button" onClick={() => handleEdit(manul)}>
              Edit
              </button>
              <button className="button buttonDanger" type="button" onClick={() => handleDelete(manul.id)}>
              Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Moderation</h2>
      <div className="table">
        {suggestions
          .filter((s) => s.status === 'PENDING')
          .map((suggestion) => (
            <div className="row" key={suggestion.id}>
              <div className="rowMain">
                <strong>#{suggestion.id}</strong> | user: {suggestion.userId} | manul: {suggestion.manulId}
                <div>status: {suggestion.status}</div>
                <div>{suggestion.content}</div>
                <div>{suggestion.createdAt}</div>
              </div>
              <div className="rowActions">
                <button
                  className="button"
                  type="button"
                  onClick={() => handleApprove(suggestion)}
                >
                  Approve
                </button>
                <button
                  className="button buttonSecondary"
                  type="button"
                  onClick={() => handleReject(suggestion)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AdminPage
