import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { CartItem } from "../types"
import * as api from "../api"

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [total, setTotal] = useState<number | null>(null)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await api.getCart()
      setItems(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const data = await api.placeOrder()
      setTotal(data.total)
      setMessage(data.message)
      setItems([])
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.cantidad, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">GoEcommerce</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">Hi, {user?.mail}</span>
          <button
            onClick={() => navigate("/products")}
            className="text-blue-600 hover:underline text-sm"
          >
            Products
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">{message}</p>
            {total !== null && (
              <p className="text-lg">Total: <span className="font-bold">${total.toFixed(2)}</span></p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading cart...</p>
        ) : items.length === 0 && !message ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.cantidad}</p>
                  </div>
                  <p className="text-blue-600 font-bold">
                    ${(item.price * item.cantidad).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-5 mt-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}