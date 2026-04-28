import { useEffect, useState } from 'react'
import axios from 'axios'

export function useMockFetch(url, fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(url)
        if (!active) {
          return
        }
        setTimeout(() => {
          if (active) {
            setData(response.data)
            setLoading(false)
          }
        }, 500)
      } catch {
        if (!active) {
          return
        }
        setError('Unable to load data')
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [url])

  return { data, loading, error }
}
