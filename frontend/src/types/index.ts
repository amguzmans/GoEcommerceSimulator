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
  image: ''
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

export interface ExternalProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}