import * as Events from '../services/event.service.js';
import * as Tickets from '../services/ticket.service.js';

export async function list(req, res, next) {
  try {
    const items = await Events.listPublished();
    res.json({ items });
  } catch (e) { next(e); }
}

export async function get(req, res, next) {
  try {
    const item = await Events.getById(req.params.id);
    res.json({ item });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const item = await Events.createEvent(req.body, req.user.sub);
    res.status(201).json({ item });
  } catch (e) { next(e); }
}

export async function occupied(req, res, next) {
  try {
    const event = await Events.getById(req.params.id);
    const tickets = await Tickets.findTicketsByEventId(req.params.id);

    const seatType = event?.seatMap?.type;
    const occupied = [];

    if (seatType === 'ga') {
      return res.json({ occupied });
    } else if(seatType === 'grid') {
      tickets.forEach((item) => {
        occupied.push(item.seat)
      });
      return res.json({ occupied });
    } else {
      return res.json({ occupied });
    }
  } catch (e) { next(e); }
}
