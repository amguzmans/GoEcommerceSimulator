import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Product, ExternalProduct } from "../types"
import * as api from "../api"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState<{ [key: number]: number }>({})
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [local, external] = await Promise.all([
        api.getProducts(),
        api.getExternalProducts(),
      ])
      setProducts(local ?? [])
      setExternalProducts(external ?? [])
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

  const handleAddExternalToCart = async (product: ExternalProduct) => {
    try {
      await api.addExternalProduct(product.title, product.price, product.image)
      await api.addToCart(product.title, 1)
      setMessage(`${product.title} added to cart`)
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

  const filteredExternal = externalProducts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredLocal = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
        ) : (
          <>
            {/* Local Products */}
            {filteredLocal.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Our Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredLocal.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow p-5">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-40 object-contain mb-4 w-full"
                        />
                      )}
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
              </>
            )}

            {/* External Products */}
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Featured Products</h3>
            {filteredExternal.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExternal.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow p-5 flex flex-col">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-40 object-contain mb-4"
                    />
                    <span className="text-xs text-gray-400 uppercase mb-1">{product.category}</span>
                    <h3 className="text-sm font-semibold line-clamp-2 flex-1">{product.title}</h3>
                    <p className="text-blue-600 font-bold text-xl mt-2">${product.price}</p>
                    <button
                      onClick={() => handleAddExternalToCart(product)}
                      className="mt-4 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}