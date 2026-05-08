import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Product, Order } from "../types"
import * as api from "../api"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [p, o] = await Promise.all([
        api.getProducts(),
        api.getOrderHistory(),
      ])
      setProducts(p)
      setOrders(o)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await api.createProduct(name, parseFloat(price), parseInt(amount))
      setMessage("Product created successfully")
      setName("")
      setPrice("")
      setAmount("")
      setTimeout(() => setMessage(""), 3000)
      fetchData()
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
        <h1 className="text-xl font-bold">GoEcommerce — Admin</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">Hi, {user?.mail}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* Create Product */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Add Product</h2>

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

          <form onSubmit={handleCreateProduct} className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-32"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-32"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-32"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">${p.price}</td>
                    <td className="py-2">{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order History</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">User ID</th>
                  <th className="pb-2">Product ID</th>
                  <th className="pb-2">Quantity</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2">{o.id}</td>
                    <td className="py-2">{o.user_id}</td>
                    <td className="py-2">{o.product_id}</td>
                    <td className="py-2">{o.cantidad}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        o.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}