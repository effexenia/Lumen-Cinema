import React, { useEffect, useState } from 'react';
import { getUsers, deleteUserById, createUser, updateUser } from '../../api/adminService.ts';
import { User } from '../../models/IUser.ts';
import EditModal from '../../components/EditModal.tsx';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUserById(id);
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSave = async (data: any) => {
    if (isAdding) {
      const newUser = await createUser(data);
      setUsers([...users, newUser]);
      setIsAdding(false);
    } else if (editingUser) {
      const updated = await updateUser(editingUser.id, data); // якщо є update API
      setUsers(users.map(u => u.id === editingUser.id ? updated : u));
      setEditingUser(null);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <button onClick={() => setIsAdding(true)}>+ Add User</button>

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
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editingUser || isAdding) && (
        <EditModal
        title={isAdding ? 'Додавання користувача' : 'Редагування користувача'}
        initialData={editingUser || {
            name: '',
            email: '',
            phone: '',
            dob: '',
            role: 'user',
            password: '' 
        }}
        fields={[
            { name: 'name', label: "Ім'я" },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Телефон' },
            { name: 'dob', label: 'Дата народження', type: 'date' },
            { name: 'role', label: 'Роль' },
            ...(isAdding ? [{ name: 'password', label: 'Пароль', type: 'password' as const }] : [])
        ]}
        onClose={() => {
            setEditingUser(null);
            setIsAdding(false);
        }}
        onSave={handleSave}
        />
      )}
    </div>
  );
};
