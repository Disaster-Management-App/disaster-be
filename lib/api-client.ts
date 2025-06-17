const API_BASE = process.env.NODE_ENV === "production" ? "" : "http://localhost:3000"

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    throw error
  }
}

export const api = {
  alerts: {
    getAll: () => fetchAPI("/alerts"),
    create: (data: any) =>
      fetchAPI("/alerts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  sensors: {
    getAll: () => fetchAPI("/sensors"),
  },
  resources: {
    getAll: () => fetchAPI("/resources"),
  },
  evacuation: {
    getAll: () => fetchAPI("/evacuation"),
  },
  realtime: {
    getData: () => fetchAPI("/realtime"),
  },
}
