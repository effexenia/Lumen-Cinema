import React, { useEffect, useState } from 'react';
import { getHalls, deleteHall, updateHall, createHall } from '../../api/hallService.ts';
import { Hall } from '../../models/ISession.ts';
import EditModal from '../../components/EditModal.tsx';

export const Halls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    getHalls().then(setHalls);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHall(id);
    setHalls(halls.filter(h => h.id !== id));
  };

const handleSave = async (data: Hall) => {
  if (isNew) {
    const created = await createHall({
      name: data.name,
      seat_rows: data.seat_rows,
      seat_cols: data.seat_cols,
    });

    setHalls(prev => [...prev, created]);
  } else {
    const updated = await updateHall(data.id, {
      name: data.name,
      seat_rows: data.seat_rows,
      seat_cols: data.seat_cols,
    });

    setHalls(prev => prev.map(h => (h.id === updated.id ? updated : h)));
  }

  setEditingHall(null);
  setIsNew(false);
};


  return (
    <div>
      <h2>Halls</h2>
      <button
        onClick={() => {
          setIsNew(true);
          setEditingHall({
            id: 0,
            name: '',
            seat_rows: 5,
            seat_cols: 5
          });
        }}
      >
        ➕ Додати зал
      </button>

      <ul>
        {halls.map(hall => (
          <li key={hall.id}>
            {hall.name} — {hall.seat_rows}x{hall.seat_cols}
            <button onClick={() => { setIsNew(false); setEditingHall(hall); }}>Edit</button>
            <button onClick={() => handleDelete(hall.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingHall && (
        <EditModal
          title={isNew ? 'Додати зал' : 'Редагувати зал'}
          initialData={editingHall}
          fields={[
            { name: 'name', label: 'Назва залу' },
            { name: 'seat_rows', label: 'Кількість рядів', type: 'number' },
            { name: 'seat_cols', label: 'Кількість місць у ряду', type: 'number' },
          ]}
          onClose={() => { setEditingHall(null); setIsNew(false); }}
          onSave={(data) => handleSave(data as Hall)}
        />
      )}
    </div>
  );
};
