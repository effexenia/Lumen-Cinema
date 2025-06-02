import React, { useEffect, useState } from 'react';
import { getUsers, deleteUserById } from '../../api/adminService.ts';
import { User } from '../../models/IUser.ts';
import EditModal from '../../components/EditModal.tsx';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUserById(id);
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSave = (updatedData: any) => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u));
    // Тут ти можеш викликати updateUser API, якщо воно у тебе є
    setEditingUser(null);
  };

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Created</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.dob}</td>
              <td>{user.created_at}</td>
              <td>{user.role}</td>
              <td>
                <button>View</button>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <EditModal
          title="Редагування користувача"
          initialData={editingUser}
          fields={[
            { name: 'name', label: "Ім'я" },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Телефон' },
            { name: 'dob', label: 'Дата народження', type: 'date' },
            { name: 'role', label: 'Роль' }
          ]}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
