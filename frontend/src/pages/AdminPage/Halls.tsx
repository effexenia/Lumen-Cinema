import React, { useEffect, useState } from 'react';
import { getHalls, deleteHall, updateHall } from '../../api/hallService.ts';
import { Hall } from '../../models/ISession.ts';
import EditModal from '../../components/EditModal.tsx';

export const Halls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  useEffect(() => {
    getHalls().then(setHalls);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHall(id);
    setHalls(halls.filter(h => h.id !== id));
  };

const handleSave = async (updatedData: Hall) => {
  await updateHall(updatedData.id, {
    name: updatedData.name,
    seat_rows: updatedData.seat_rows,
    seat_cols: updatedData.seat_cols,
  });

  setHalls(prev => prev.map(h => (h.id === updatedData.id ? updatedData : h)));
  setEditingHall(null);
};


  return (
    <div>
      <h2>Halls</h2>
      <ul>
        {halls.map(hall => (
          <li key={hall.id}>
            {hall.name} — {hall.seat_rows}x{hall.seat_cols}
            <button onClick={() => setEditingHall(hall)}>Edit</button>
            <button onClick={() => handleDelete(hall.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingHall && (
        <EditModal
          title="Редагувати зал"
          initialData={editingHall}
          fields={[
            { name: 'name', label: 'Назва залу' },
            { name: 'seat_rows', label: 'Кількість рядів', type: 'number' },
            { name: 'seat_cols', label: 'Кількість місць у ряду', type: 'number' },
          ]}
          onClose={() => setEditingHall(null)}
          onSave={(data) => handleSave(data as Hall)}
        />
      )}
    </div>
  );
};
