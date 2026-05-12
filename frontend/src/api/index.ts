import type { AuthResponse, Product, CartItem, Order, ExternalProduct } from "../types"

const BASE_URL = "https://goecommercesimulator-production.up.railway.app/api"


const getToken = () => localStorage.getItem("token")

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
})

// Auth
export const register = async (mail: string, password: string, role: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail, password, role }),
  })
  if (!res.ok) throw new Error(await res.text())
}

export const login = async (mail: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail, password }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Products
export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/products`, { headers: headers() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const createProduct = async (name: string, price: number, amount: number, image: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, price, amount, image }),
  })
  if (!res.ok) throw new Error(await res.text())
}

// External API
export const getExternalProducts = async (): Promise<ExternalProduct[]> => {
  const res = await fetch("https://fakestoreapi.com/products")
  if (!res.ok) throw new Error("Could not fetch external products")
  return res.json()
}

export const addExternalProduct = async (name: string, price: number, image: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/products/external`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, price, amount: 99, image }),
  })
  if (!res.ok) throw new Error(await res.text())
}

// Cart
export const getCart = async (): Promise<CartItem[]> => {
  const res = await fetch(`${BASE_URL}/cart`, { headers: headers() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const addToCart = async (product_name: string, cantidad: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ product_name, cantidad }),
  })
  if (!res.ok) throw new Error(await res.text())
}

// Orders
export const placeOrder = async (): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: headers(),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const getOrderHistory = async (): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders/history`, { headers: headers() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}