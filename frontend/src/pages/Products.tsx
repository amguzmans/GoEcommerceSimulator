import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Product, ExternalProduct } from "../types"
import * as api from "../api"

type UnifiedProduct = {
  id: string
  name: string
  price: number
  image: string
  amount?: number
  category?: string
  isLocal: boolean
  localData?: Product
  externalData?: ExternalProduct
}

const CATEGORIES = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"]

export default function Products() {
  const [allProducts, setAllProducts] = useState<UnifiedProduct[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState<{ [key: string]: number }>({})
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [local, external] = await Promise.all([api.getProducts(), api.getExternalProducts()])
      const localUnified: UnifiedProduct[] = (local ?? []).map(p => ({
        id: `local-${p.id}`, name: p.name, price: p.price, image: p.image,
        amount: p.amount, isLocal: true, localData: p,
      }))
      const localNames = new Set((local ?? []).map(p => p.name.toLowerCase()))
      const externalUnified: UnifiedProduct[] = (external ?? [])
        .filter(p => !localNames.has(p.title.toLowerCase()))
        .map(p => ({
          id: `ext-${p.id}`, name: p.title, price: p.price, image: p.image,
          category: p.category, isLocal: false, externalData: p,
        }))
      setAllProducts([...localUnified, ...externalUnified])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: UnifiedProduct) => {
    const qty = cantidad[product.id] || 1
    try {
      if (!product.isLocal && product.externalData) {
        await api.addExternalProduct(product.name, product.price, product.image)
      }
      await api.addToCart(product.name, qty)
      setMessage(`${product.name} added to cart`)
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.category ?? "").toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === "All" || (p.category ?? "our products") === activeCategory || (!p.category && activeCategory === "our products")
    return matchSearch && matchCat
  })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf7", fontFamily: "'Georgia', serif" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#9DC3C2", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
          mint<span style={{ color: "#D0EFB1" }}>Tech</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Search bar in navbar */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "13px", width: "220px", outline: "none", backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}
          />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", marginLeft: "8px" }}>Hi, {user?.mail?.split("@")[0]}</span>
          <button onClick={() => navigate("/cart")} style={{ padding: "8px 18px", borderRadius: "20px", border: "2px solid rgba(255,255,255,0.6)", backgroundColor: "transparent", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            🛒 Cart
          </button>
          <button onClick={() => { logout(); navigate("/login") }} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #D0EFB1 0%, #9DC3C2 60%, #B3D89C 100%)", padding: "60px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Blob decorativo */}
        <svg style={{ position: "absolute", right: "-40px", top: "-60px", opacity: 0.3 }} width="400" height="400" viewBox="0 0 400 400">
          <path fill="#EFB1D0" d="M320,200Q320,280,240,320Q160,360,100,300Q40,240,60,160Q80,80,160,60Q240,40,290,100Q340,160,320,200Z"/>
        </svg>
        <svg style={{ position: "absolute", left: "30%", bottom: "-30px", opacity: 0.2 }} width="250" height="250" viewBox="0 0 250 250">
          <path fill="#C3A69D" d="M200,125Q200,175,150,200Q100,225,65,187Q30,150,45,100Q60,50,112,40Q164,30,187,77Q210,124,200,125Z"/>
        </svg>

        <div style={{ position: "relative", zIndex: 2, maxWidth: "500px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "3px", color: "#5a9a8a", textTransform: "uppercase" }}>✦ New arrivals this week</span>
          <h1 style={{ fontSize: "52px", fontWeight: "700", color: "#2d2d2d", lineHeight: 1.1, margin: "12px 0 16px" }}>
            Fresh Deals.<br/>
            <span style={{ color: "#fff" }}>Every Day.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#444", marginBottom: "28px", lineHeight: 1.6 }}>
            Discover hundreds of curated products — from tech to fashion. Quality you can trust.
          </p>
          <button onClick={() => document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "14px 32px", borderRadius: "30px", border: "none", backgroundColor: "#2d2d2d", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.3px" }}>
            Shop Now →
          </button>
        </div>

        {/* Hero stats */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row", gap: "16px", marginRight: "60px" }}>
          {[["500+", "Products"], ["100%", "Secure"], ["24/7", "Support"]].map(([num, label]) => (
            <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "16px", padding: "16px 28px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#2d2d2d" }}>{num}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #eee", padding: "0 40px", display: "flex", gap: "8px", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              padding: "14px 20px", border: "none", backgroundColor: "transparent", fontSize: "13px", fontWeight: activeCategory === cat ? "700" : "500",
              color: activeCategory === cat ? "#9DC3C2" : "#888", borderBottom: activeCategory === cat ? "2px solid #9DC3C2" : "2px solid transparent",
              cursor: "pointer", whiteSpace: "nowrap", textTransform: "capitalize", transition: "all 0.2s",
            }}>
            {cat === "All" ? "All Products" : cat}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div id="products-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px" }}>

        {/* Messages */}
        {message && (
          <div style={{ backgroundColor: "#e8f5e1", color: "#5a9a5a", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", border: "1px solid #B3D89C" }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{ backgroundColor: "#fff0f3", color: "#c0547a", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", border: "1px solid #f5c2ce" }}>
            {error}
          </div>
        )}

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#2d2d2d", margin: 0 }}>
            {activeCategory === "All" ? "All Products" : activeCategory}
            <span style={{ fontSize: "14px", fontWeight: "400", color: "#aaa", marginLeft: "10px" }}>({filtered.length} items)</span>
          </h2>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#aaa", fontSize: "16px" }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#aaa", fontSize: "16px" }}>No products found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {filtered.map(product => (
              <div key={product.id} style={{ backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)" }}>

                {/* Image area */}
                <div style={{ backgroundColor: "#f8faf7", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "180px" }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "48px" }}>🛍️</span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {product.category && (
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#9DC3C2", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                      {product.category}
                    </span>
                  )}
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#2d2d2d", margin: "0 0 8px", lineHeight: 1.4, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {product.name}
                  </h3>
                  {product.isLocal && (
                    <span style={{ fontSize: "12px", color: product.amount === 0 ? "#e57373" : "#B3D89C", fontWeight: "600", marginBottom: "8px" }}>
                      {product.amount === 0 ? "Out of stock" : `${product.amount} in stock`}
                    </span>
                  )}
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#9DC3C2", marginBottom: "14px" }}>
                    ${product.price}
                  </div>

                  {/* Add to cart */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="number" min={1} max={product.isLocal ? product.amount : 99}
                      value={cantidad[product.id] || 1}
                      onChange={e => setCantidad({ ...cantidad, [product.id]: parseInt(e.target.value) })}
                      style={{ width: "52px", padding: "8px", borderRadius: "10px", border: "1.5px solid #e8e8e8", fontSize: "13px", textAlign: "center", outline: "none" }} />
                    <button onClick={() => handleAddToCart(product)}
                      disabled={product.isLocal && product.amount === 0}
                      style={{
                        flex: 1, padding: "8px", borderRadius: "10px", border: "none",
                        background: product.isLocal && product.amount === 0 ? "#e8e8e8" : "linear-gradient(135deg, #B3D89C, #9DC3C2)",
                        color: product.isLocal && product.amount === 0 ? "#aaa" : "#fff",
                        fontSize: "13px", fontWeight: "700", cursor: product.isLocal && product.amount === 0 ? "not-allowed" : "pointer",
                      }}>
                      {product.isLocal && product.amount === 0 ? "Out of stock" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}