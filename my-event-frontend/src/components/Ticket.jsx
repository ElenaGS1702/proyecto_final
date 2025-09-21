import { useRef } from "react";
import useAuth from "../hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Ticket({ event, ticket }) {
  const { user } = useAuth();
  const componentRef = useRef();

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    // Clonar el nodo
    const element = componentRef.current.cloneNode(true);

    // Aplicar clases solo para el PDF
    element.classList.add("text-black");

    // Insertar en DOM de forma oculta
    element.style.position = "absolute";
    element.style.top = "-9999px";
    document.body.appendChild(element);

    // Capturar con html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // Remover el clon
    document.body.removeChild(element);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("ticket.pdf");
  };

  const handleDownload = async () => {
      const response = await fetch(ticket.ticket.qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${ticket.ticket.event}.png` || "mi-qr.png";
      link.click();
      URL.revokeObjectURL(url); // liberar memoria

      await handleDownloadPDF()
  };

  return (
    <div className="h-1/2">
      <div 
        id="ticket-modal"
        ref={componentRef}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Gracias por tu compra, {user?.name || user?.email}. Tu ticket está
          listo
        </h2>
        <img src={ticket.ticket.qrUrl} className="mx-auto mb-4 w-1/2" alt="QR" />
        <div className="p-6">
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <p className="opacity-80">{new Date(event.date).toLocaleString()}</p>
          <p className="opacity-80 mb-2">{event.venue}</p>
          <p className="mb-4 opacity-80">
            Asiento: {ticket.ticket.seat.row}-{ticket.ticket.seat.col}
          </p>
          <div className="text-xl font-semibold">
            ${event.price?.toLocaleString("es-MX")}
          </div>
        </div>
      </div>
      <button className="btn btn-primary mt-4" onClick={handleDownload}>
        Descargar
      </button>
    </div>
  );
}
