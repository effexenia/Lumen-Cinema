import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaPrint, FaQrcode, FaMoneyBillWave, FaTimes, FaSpinner } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import styles from "./MyTicketsPage.module.css";
import { getMyTickets, cancelTicket } from "../../api/ticketService.ts";
import PrintLayout from "../../components/PrintableTicket.tsx";

interface Ticket {
  ticket_id: number;
  seat_row: number;
  seat_col: number;
  start_time: string;
  movie: string;
  hall: string;
  price: number;
  status: "booked" | "paid" | "cancelled";
  session_id: number;
}

const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "booked" | "cancelled">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Помилка при отриманні квитків:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handlePrint = useCallback(async (ticket: Ticket) => {
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Дозвольте відкриття спливаючих вікон для друку');
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Квиток ${ticket.ticket_id}</title>
            <style>
              @page { size: auto; margin: 0; }
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            </style>
          </head>
          <body>
            ${ReactDOMServer.renderToString(<PrintLayout ticket={ticket} />)}
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      await new Promise(resolve => setTimeout(resolve, 300));
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    } catch (error) {
      console.error("Помилка при друку:", error);
      alert("Не вдалося надрукувати квиток");
    } finally {
      setIsPrinting(false);
    }
  }, []);

  const handleCancel = async (ticketId: number) => {
    if (!window.confirm("Ви впевнені, що хочете скасувати квиток?")) return;

    try {
      await cancelTicket(ticketId);
      setTickets(prev =>
        prev.map(t =>
          t.ticket_id === ticketId ? { ...t, status: "cancelled" } : t
        )
      );
    } catch (error) {
      console.error("Помилка при скасуванні квитка:", error);
      alert("Не вдалося скасувати квиток");
    }
  };

  const handlePay = async (ticketId: number) => {
    try {
      const ticket = tickets.find(t => t.ticket_id === ticketId);
      if (!ticket) return;

      const selectedSeats = [{ row: ticket.seat_row, seat: ticket.seat_col }];

      const response = await fetch("http://localhost:5000/api/payments/stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(ticket.price),
          session_id: ticket.session_id,
          selectedSeats: selectedSeats
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Помилка оплати");
      }

      const { url } = await response.json();
      window.location.href = url;

    } catch (error: any) {
      console.error("Stripe оплата не вдалася:", error);
      alert(error.message || "Не вдалося здійснити оплату");
    }
  };

  const toggleQrCode = (ticketId: number) => {
    setShowQr(showQr === ticketId ? null : ticketId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "#4CAF50";
      case "booked": return "#FFC107";
      case "cancelled": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Оплачено";
      case "booked": return "Заброньовано";
      case "cancelled": return "Скасовано";
      default: return "Невідомо";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const filteredTickets = tickets
  .filter(t => filterStatus === "all" || t.status === filterStatus)
  .sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      console.error('Invalid date format', { a: a.start_time, b: b.start_time });
      return 0;
    }
    
    return sortOrder === "asc" 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });
  useEffect(() => {
  console.log('Sorted tickets:', filteredTickets.map(t => ({
    id: t.ticket_id,
    date: t.start_time,
    formatted: formatDate(t.start_time)
  })));
}, [filteredTickets]);

const groupedTickets = new Map<number, Ticket[]>();

filteredTickets.forEach(ticket => {
  if (!groupedTickets.has(ticket.session_id)) {
    groupedTickets.set(ticket.session_id, []);
  }
  groupedTickets.get(ticket.session_id)!.push(ticket);
});


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Завантаження квитків...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мої квитки</h1>

      <div className={styles.controls}>
        <label>
          Сортування:
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as "asc" | "desc")}>
            <option value="desc">Спочатку нові</option>
            <option value="asc">Спочатку старі</option>
          </select>
        </label>

        <label>
          Статус:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">Всі</option>
            <option value="paid">Оплачені</option>
            <option value="booked">Заброньовані</option>
            <option value="cancelled">Скасовані</option>
          </select>
        </label>
      </div>

      {filteredTickets.length === 0 ? (
        <div className={styles.noTickets}>
          <p>Квитків за обраними параметрами немає.</p>
        </div>
      ) : (
        <div className={styles.tickets}>
          {Array.from(groupedTickets.entries()).map(([sessionId, ticketsInSession]) => (
            <div key={sessionId} className={styles.sessionGroup}>
              <h2 className={styles.sessionTitle}>
                {ticketsInSession[0].movie} — {formatDate(ticketsInSession[0].start_time)} — Зал {ticketsInSession[0].hall}
              </h2>

              <div className={styles.ticketGroup}>
                {ticketsInSession.map(ticket => (
                  <div key={ticket.ticket_id} className={styles.ticketCard}>
                    <div className={styles.ticketInfo}>
                      Місце: Ряд {ticket.seat_row}, Місце {ticket.seat_col} — {ticket.price} грн
                    </div>

                    <div>
                      Статус: <span style={{ color: getStatusColor(ticket.status) }}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>

                    {showQr === ticket.ticket_id && (
                      <div className={styles.qrContainer}>
                      <QRCodeSVG
                        value={`ticket:${ticket.ticket_id}`}
                        size={150}
                        level="H"
                        includeMargin={true}
                      />
                      </div>
                    )}

                    <div className={styles.actions}>
                      {ticket.status === "booked" && (
                        <>
                          <button className={styles.button} onClick={() => handlePay(ticket.ticket_id)} disabled={isPrinting}>
                            <FaMoneyBillWave /> Оплатити
                          </button>
                          <button className={styles.button} onClick={() => handleCancel(ticket.ticket_id)} style={{ backgroundColor: "#F44336" }} disabled={isPrinting}>
                            <FaTimes /> Скасувати
                          </button>
                        </>
                      )}

                      {ticket.status === "paid" && (
                        <>
                          <button className={styles.button} onClick={() => toggleQrCode(ticket.ticket_id)} disabled={isPrinting}>
                            <FaQrcode /> {showQr === ticket.ticket_id ? "Сховати QR" : "Показати QR"}
                          </button>
                          <button className={styles.button} onClick={() => handlePrint(ticket)} disabled={isPrinting}>
                            {isPrinting ? <><FaSpinner className={styles.spinner} /> Готується...</> : <><FaPrint /> Друк</>}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
