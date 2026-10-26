import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type User = {
  id: number
  name: string
}
