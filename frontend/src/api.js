export const API = "http://localhost:8000/api"

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, options)

  let data = null
  const text = await response.text()
  if (text) data = JSON.parse(text)

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Request failed")
    error.code = data?.error?.code
    error.details = data?.detail
    throw error
  }

  return data
}