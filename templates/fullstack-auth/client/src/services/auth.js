import api from './api'

export const register = async (name, email, password) => {
  const res = await api.post('/user/register', { name, email, password })
  localStorage.setItem('token', res.data.token)
  return res.data
}

export const login = async (email, password) => {
  const res = await api.post('/user/login', { email, password })
  localStorage.setItem('token', res.data.token)
  return res.data
}

export const logout = async () => {
  localStorage.removeItem('token')
  await api.post('/user/logout').catch(() => {})
}

export const getToken = () => localStorage.getItem('token')