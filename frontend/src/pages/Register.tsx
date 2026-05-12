import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import * as api from "../api"

export default function Register() {
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.register(mail, password, "client")
      navigate("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Georgia', serif", backgroundColor: "#fdfcfb" }}>

      {/* LEFT: Form */}
      <div style={{
        width: "100%",
        maxWidth: "560px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        backgroundColor: "#ffffff",
        position: "relative",
        zIndex: 2,
      }}>

        {/* Logo */}
        <div style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            <span style={{ color: "#9DC3C2" }}>mint</span>
            <span style={{ color: "#B3D89C" }}>Tech</span>
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "36px", borderBottom: "2px solid #f0f0f0" }}>
          <Link to="/login" style={{
            padding: "10px 24px 10px 0",
            fontSize: "15px",
            fontWeight: "500",
            color: "#bbb",
            textDecoration: "none",
            borderBottom: "2px solid transparent",
            marginBottom: "-2px",
          }}>
            Login
          </Link>
          <div style={{
            padding: "10px 24px",
            fontSize: "15px",
            fontWeight: "700",
            color: "#9DC3C2",
            borderBottom: "2px solid #9DC3C2",
            marginBottom: "-2px",
            cursor: "pointer",
          }}>
            Sign up
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d2d2d", margin: "0 0 6px", lineHeight: 1.2 }}>
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
            Join mintTech and start shopping today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "#fff0f3",
            color: "#c0547a",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            marginBottom: "20px",
            border: "1px solid #f5c2ce"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={mail}
              onChange={e => setMail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1.5px solid #e8e8e8",
                fontSize: "14px",
                color: "#2d2d2d",
                outline: "none",
                backgroundColor: "#fafafa",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#9DC3C2"}
              onBlur={e => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1.5px solid #e8e8e8",
                fontSize: "14px",
                color: "#2d2d2d",
                outline: "none",
                backgroundColor: "#fafafa",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#9DC3C2"}
              onBlur={e => e.target.style.borderColor = "#e8e8e8"}
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #B3D89C, #9DC3C2)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              letterSpacing: "0.3px",
              marginTop: "4px",
            }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>
      </div>

      {/* RIGHT: Decorative */}
      <div style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #e8f5e1 0%, #D0EFB1 35%, #9DC3C2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {/* Blob 1 */}
        <svg style={{ position: "absolute", top: "-80px", right: "-60px", opacity: 0.5 }} width="500" height="500" viewBox="0 0 500 500">
          <path fill="#B3D89C" d="M421,298Q387,346,344,379Q301,412,248,421Q195,430,148,402Q101,374,72,327Q43,280,44,228Q45,176,78,135Q111,94,158,68Q205,42,255,46Q305,50,350,78Q395,106,424,153Q453,200,421,298Z"/>
        </svg>

        {/* Blob 2 */}
        <svg style={{ position: "absolute", bottom: "-100px", left: "-80px", opacity: 0.4 }} width="450" height="450" viewBox="0 0 450 450">
          <path fill="#EFB1D0" d="M380,260Q350,320,295,355Q240,390,185,365Q130,340,95,290Q60,240,70,183Q80,126,125,90Q170,54,228,50Q286,46,333,82Q380,118,400,184Q420,250,380,260Z"/>
        </svg>

        {/* Blob 3 */}
        <svg style={{ position: "absolute", top: "30%", left: "8%", opacity: 0.3 }} width="200" height="200" viewBox="0 0 200 200">
          <path fill="#D0EFB1" d="M160,100Q160,140,120,160Q80,180,50,150Q20,120,30,80Q40,40,80,30Q120,20,145,50Q170,80,160,100Z"/>
        </svg>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "60px", maxWidth: "440px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "3px", color: "#5a9a8a", marginBottom: "20px", textTransform: "uppercase" }}>
            ✦ Join the community
          </p>
          <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#2d2d2d", lineHeight: 1.1, margin: "0 0 24px" }}>
            Fresh finds.<br/>
            <span style={{ color: "#9DC3C2" }}>Every day.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.7, margin: "0 0 36px" }}>
            Create your account and get access to hundreds of curated products. Fast shipping, easy returns, and always something new.
          </p>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              ["🛍️", "Hundreds of products"],
              ["🔒", "Secure checkout"],
              ["📦", "Fast delivery"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <span style={{ fontSize: "14px", color: "#444", fontWeight: "500" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}