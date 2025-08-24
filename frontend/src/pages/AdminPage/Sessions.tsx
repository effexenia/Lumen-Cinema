import React, { useEffect, useState } from 'react';
import { getSessions, deleteSession, createSession, updateSession} from '../../api/sessionService.ts';
import { getAllMovies } from '../../api/api.ts';
import { getHalls } from '../../api/hallService.ts';
import { Session } from '../../models/ISession.ts';
import EditModal from '../../components/EditModal.tsx';

export const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [movies, setMovies] = useState<{id: number, title: string}[]>([]);
  const [halls, setHalls] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessionsData, moviesData, hallsData] = await Promise.all([
      getSessions(),
      getAllMovies(),
      getHalls()
    ]);
    
    const sessionsWithNames = sessionsData.map(session => ({
      ...session,
      movie_title: moviesData.find(m => m.id === session.movie_id)?.title,
      hall_name: hallsData.find(h => h.id === session.hall_id)?.name,
      start_time: formatDateTimeForInput(session.start_time)
    }));
    
    setSessions(sessionsWithNames);
    setMovies(moviesData);
    setHalls(hallsData);
  };

const formatDateTimeForInput = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
const convertToMySQLDateTime = (localDateTime: string) => {
  const date = new Date(localDateTime);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 19).replace('T', ' '); 
};


  const handleDelete = async (id: number) => {
    await deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async (data: any) => {
    const movie = movies.find(m => m.title === data.movie_title);
    const hall = halls.find(h => h.name === data.hall_name);
    
    if (!movie || !hall) {
      alert('Please select valid movie and hall');
      return;
    }

    const sessionData = {
      movie_id: movie.id,
      hall_id: hall.id,
      start_time: convertToMySQLDateTime(data.start_time),
      price: Number(data.price),
    };

    if (isNew) {
      const created = await createSession(sessionData);
      setSessions(prev => [...prev, {
        ...created, 
        movie_title: movie.title, 
        hall_name: hall.name,
        start_time: formatDateTimeForInput(created.start_time)
      }]);
    } else if (editingSession) {
      const updated = await updateSession(editingSession.id, sessionData);
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id ? {
          ...updated, 
          movie_title: movie.title, 
          hall_name: hall.name,
          start_time: formatDateTimeForInput(updated.start_time)
        } : s
      ));
    }

    setEditingSession(null);
    setIsNew(false);
  };

  return (
    <div>
      <h2>Sessions</h2>
      <button onClick={() => { 
        setIsNew(true); 
        setEditingSession({
          id: 0,
          movie_id: 0,
          hall_id: 0,
          start_time: formatDateTimeForInput(new Date().toISOString()),
          price: 0,
          movie_title: '',
          hall_name: ''
        } as Session); 
      }}>➕ Add Session</button>

      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Hall</th>
            <th>Start Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id}>
              <td>{session.movie_title}</td>
              <td>{session.hall_name}</td>
              <td>{new Date(session.start_time).toLocaleString()}</td>
              <td>{session.price} ₴</td>
              <td>
                <button onClick={() => { 
                  setEditingSession({
                    ...session,
                    start_time: formatDateTimeForInput(session.start_time)
                  }); 
                  setIsNew(false); 
                }}>Edit</button>
                <button onClick={() => handleDelete(session.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSession && (
        <EditModal
          title={isNew ? "Create Session" : "Edit Session"}
          initialData={editingSession}
          fields={[
            { 
              name: 'movie_title', 
              label: 'Movie', 
              type: 'select',
              options: movies.map(m => ({ value: m.title, label: m.title }))
            },
            { 
              name: 'hall_name', 
              label: 'Hall', 
              type: 'select',
              options: halls.map(h => ({ value: h.name, label: h.name }))
            },
            { name: 'start_time', label: 'Start Time', type: 'datetime-local' },
            { name: 'price', label: 'Price', type: 'number' },
          ]}
          onClose={() => { setEditingSession(null); setIsNew(false); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};