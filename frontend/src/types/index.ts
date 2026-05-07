export interface User {
  id: number
  mail: string
  role: "admin" | "client"
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Product {
  id: number
  name: string
  price: number
  amount: number
}

export interface CartItem {
  name: string
  cantidad: number
  price: number
  status: string
}

export interface Order {
  message: string
  total: number
}