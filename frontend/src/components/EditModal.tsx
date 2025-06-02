import React, { useState } from 'react';
import styles from './EditModal.module.css';

type FieldType = 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'select';

interface FieldOption {
  value: string | number;
  label: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: FieldOption[];
}

interface EditModalProps {
  title: string;
  initialData: Record<string, any>;
  fields: FieldConfig[];
  onClose: () => void;
  onSave: (updatedData: Record<string, any>) => void;
}

const EditModal = ({ title, initialData, fields, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <label key={field.name}>
              {field.label}:
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={handleChange}
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={handleChange}
                  type={field.type || 'text'}
                />
              )}
            </label>
          ))}
          <div className={styles.modalActions}>
            <button type="submit">Зберегти</button>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;