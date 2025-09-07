import http from "./http";

export async function register({name, email, password, role}) {
    const { data } = await http.post('/auth/register',{name, email, password, role})
    return data
}

export async function login({email, password}) {
    const { data } = await http.post('/auth/login',{email, password})
    return data
}

export async function me() {
    const { data } = await http.post('/auth/me')
    return data
}

export async function listEvents() {
    const { data } = await http.get('/events')
    return data
}

export async function getEvent(id) {
    const { data } = await http.get(`/events/${id}`)
    return data
}

export async function createEvent(payload) {
    const { data } = await http.post('/events',payload)
    return data
}

export async function purchaseTicket({eventId, seat}) {
    const { data } = await http.post('/tickets/purchase',{eventId, seat})
    console.log(data)

    return data
}

export async function scanTicket({token}) {
    const { data } = await http.post('/checkin/scan',{token})
    return data
}

export async function getOccupiedSeats(eventId) {
  try {
    const { data } = await http.get(`/events/${eventId}/occupied`)
    return data
  } catch {
    return { occupied: [] }
  }
}