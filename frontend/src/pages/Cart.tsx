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

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const data = await api.getCart()
      setItems(data ?? [])
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

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.cantidad, 0)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf7", fontFamily: "'Georgia', serif" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#9DC3C2", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px", cursor: "pointer" }} onClick={() => navigate("/products")}>
          mint<span style={{ color: "#D0EFB1" }}>Tech</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", marginRight: "8px" }}>Hi, {user?.mail?.split("@")[0]}</span>
          <button onClick={() => navigate("/products")} style={{ padding: "8px 18px", borderRadius: "20px", border: "2px solid rgba(255,255,255,0.6)", backgroundColor: "transparent", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            ← Products
          </button>
          <button onClick={() => { logout(); navigate("/login") }} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* HEADER BAR */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #eee", padding: "24px 40px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "28px" }}>🛒</span>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#2d2d2d", margin: 0 }}>Your Cart</h1>
          <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>{items.length} {items.length === 1 ? "item" : "items"} in your cart</p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

        {/* LEFT: Items */}
        <div>
          {/* Messages */}
          {message && (
            <div style={{ backgroundColor: "#e8f5e1", color: "#5a9a5a", padding: "16px 20px", borderRadius: "16px", marginBottom: "20px", border: "1px solid #B3D89C" }}>
              <p style={{ fontWeight: "700", margin: "0 0 4px", fontSize: "15px" }}>✓ Order placed successfully!</p>
              {total !== null && (
                <p style={{ margin: 0, fontSize: "14px" }}>Total charged: <strong>${total.toFixed(2)}</strong></p>
              )}
            </div>
          )}
          {error && (
            <div style={{ backgroundColor: "#fff0f3", color: "#c0547a", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", border: "1px solid #f5c2ce" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>Loading cart...</div>
          ) : items.length === 0 && !message ? (
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "60px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛍️</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#2d2d2d", margin: "0 0 8px" }}>Your cart is empty</h3>
              <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "28px" }}>Looks like you haven't added anything yet.</p>
              <button onClick={() => navigate("/products")} style={{ padding: "12px 32px", borderRadius: "30px", border: "none", background: "linear-gradient(135deg, #B3D89C, #9DC3C2)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                Start Shopping →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map((item, index) => (
                <div key={index} style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Item icon placeholder */}
                    <div style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#f8faf7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                      🛍️
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#2d2d2d", margin: "0 0 4px", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>Qty: {item.cantidad} × ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#9DC3C2" }}>
                    ${(item.price * item.cantidad).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Summary */}
        {(items.length > 0 || message) && (
          <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", position: "sticky", top: "80px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#2d2d2d", margin: "0 0 20px" }}>Order Summary</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888" }}>
                <span>Subtotal ({items.length} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888" }}>
                <span>Shipping</span>
                <span style={{ color: "#B3D89C", fontWeight: "600" }}>Free</span>
              </div>
              <div style={{ height: "1px", backgroundColor: "#f0f0f0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "700", color: "#2d2d2d" }}>
                <span>Total</span>
                <span style={{ color: "#9DC3C2" }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {items.length > 0 && (
              <button onClick={handlePlaceOrder} style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #B3D89C, #9DC3C2)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.3px" }}>
                Place Order →
              </button>
            )}

            <button onClick={() => navigate("/products")} style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1.5px solid #e8e8e8", backgroundColor: "transparent", color: "#888", fontSize: "14px", cursor: "pointer", marginTop: "10px" }}>
              Continue Shopping
            </button>

            {/* Trust badges */}
            <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f8faf7", borderRadius: "12px" }}>
              {[["🔒", "Secure checkout"], ["📦", "Fast delivery"], ["↩️", "Easy returns"]].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px" }}>{icon}</span>
                  <span style={{ fontSize: "12px", color: "#888" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}