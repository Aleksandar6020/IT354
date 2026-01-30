import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Manuls</h1>
      <p>Pallas''s cats are small wild cats from Central Asia known for their fluffy coats.</p>
      <Link to="/manuls">Go to Manuls</Link>
    </div>
  )
}

export default HomePage
