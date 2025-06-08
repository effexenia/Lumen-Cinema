import React, { useEffect, useState } from 'react';
import { getMyTickets, cancelTicket } from '../../api/ticketService.ts';
import { Ticket } from '../../models/ITicket.ts';

export const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    getMyTickets().then(setTickets);
  }, []);

  const handleCancel = async (id: number) => {
    await cancelTicket(id);
    setTickets(prev =>
      prev.map(t => t.ticket_id === id ? { ...t, status: 'cancelled' } : t)
    );
  };

  return (
    <div>
      <h2>My Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Time</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.movie}</td>
              <td>{new Date(ticket.start_time).toLocaleString()}</td>
              <td>{`R${ticket.seat_row}S${ticket.seat_col}`}</td>
              <td>
                {ticket.status === 'booked' && 'Заброньований'}
                {ticket.status === 'cancelled' && 'Скасований'}
                {ticket.status === 'paid' && 'Оплачено'}
              </td>
              <td>
                {(ticket.status === 'booked' || ticket.status === 'paid') && (
                  <button onClick={() => handleCancel(ticket.ticket_id)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
