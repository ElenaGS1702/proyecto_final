import { useRef } from "react";
import useAuth from "../hooks/useAuth"
import { usePDF } from "react-to-pdf"

export default function Ticket({ event, ticket }) {
    const { user } = useAuth()
    const { toPDF, targetRef } = usePDF({ filename: `${ticket.ticket.event}.pdf` })

    const handleDownload = async () => {
        const response = await fetch(ticket.ticket.qrUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${ticket.ticket.event}.png` || "mi-qr.png";
        link.click();
        URL.revokeObjectURL(url); // liberar memoria

        toPDF()
    };

    return (
      <div className="h-1/2">
        <div ref={targetRef}>
            <h2 className="text-lg font-semibold mb-4 text-center">
                Gracias por tu compra, {user?.name || user?.email}. Tu ticket está
                listo
            </h2>
            <img src={ticket.ticket.qrUrl} height="25%" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">{event.title}</h1>
                <p className="opacity-80">{new Date(event.date).toLocaleString()}</p>
                <p className="opacity-80 mb-2">{event.venue}</p>
                <p className="mb-4 opacity-80">Asiento: {ticket.ticket.seat.row}-{ticket.ticket.seat.col}</p>
                <div className="text-xl font-semibold">${event.price?.toLocaleString('es-MX')}</div>
            </div>
        </div>
        <button
            className="btn btn-primary mt-4"
            onClick={handleDownload}
        >
            Descargar
        </button>
      </div>
    );
}