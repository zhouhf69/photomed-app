import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
              PhotoMed
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              首页
            </Link>
            <Link 
              to="/kimi-app" 
              className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              Kimi APP
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
