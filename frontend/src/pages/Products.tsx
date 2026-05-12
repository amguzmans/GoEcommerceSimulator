import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Product } from "../types"
import * as api from "../api"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState<{ [key: number]: number }>({})
  const [message, setMessage] = useState("")

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    const qty = cantidad[product.id] || 1
    try {
      await api.addToCart(product.name, qty)
      setMessage(`${product.name} added to cart`)
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">GoEcommerce</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">Hi, {user?.mail}</span>
          <button
            onClick={() => navigate("/cart")}
            className="text-blue-600 hover:underline text-sm"
          >
            Cart
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Products</h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1">Stock: {product.amount}</p>
                <p className="text-blue-600 font-bold text-xl mt-2">${product.price}</p>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    min={1}
                    max={product.amount}
                    value={cantidad[product.id] || 1}
                    onChange={e => setCantidad({ ...cantidad, [product.id]: parseInt(e.target.value) })}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.amount === 0}
                    className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition text-sm disabled:opacity-50"
                  >
                    {product.amount === 0 ? "Out of stock" : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}