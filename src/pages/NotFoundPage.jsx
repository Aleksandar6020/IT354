import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button" to="/">Go Home</Link>
    </div>
  )
}

export default NotFoundPage
