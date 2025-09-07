import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { listEvents } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Events() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
        try {
            const res = await listEvents()
            setItems(res?.items || [])
        } catch (e) { setError(e.message) }
        finally { setLoading(false) }
        })()
    }, [])

    if (loading) return <LoadingSpinner />
    if (error) return <p className="text-red-600">{error}</p>

    return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map(ev => (
        <Card key={ev._id} className="p-0 overflow-hidden">
          <img src={ev.imageUrl} alt={ev.title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-lg font-semibold">{ev.title}</h2>
            <p className="opacity-80 text-sm mb-2">{new Date(ev.date).toLocaleString()}</p>
            <p className="opacity-80 text-sm mb-4">{ev.venue}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">${ev.price?.toLocaleString('es-MX')}</span>
              <Link to={`/events/${ev._id}`} className="btn btn-primary">Ver detalles</Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}