import React, { useEffect, useState } from 'react';
import styles from './EditModal.module.css';
import Select from 'react-select';


type FieldType = 'text' | 'email' | 'number' | 'password' | 'date' | 'datetime-local' | 'select';

interface FieldOption {
  value: string | number;
  label: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: FieldOption[];
  required?: boolean;
}

interface EditModalProps {
  title: string;
  initialData: Record<string, any>;
  fields: FieldConfig[];
  onClose: () => void;
  onSave: (updatedData: Record<string, any>) => void;
}


const EditModal = ({ title, initialData, fields, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
  setFormData(initialData);
}, [initialData]);

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#333',
    borderColor: '#444',
    borderRadius: 4,
    minHeight: 38,
    color: '#fff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1c1c1c',
    color: '#fff',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#2d72d9' : '#1c1c1c',
    color: '#fff',
    cursor: 'pointer',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#2d72d9',
    color: '#fff',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#fff',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#1c1c1c',
      color: '#2d72d9',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#aaa',
  }),
};

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <label key={field.name} className={styles.label}>
              {field.label}:
                {field.name === 'genres' && field.options ? (
                  <Select
                    isMulti
                    name={field.name}
                    options={field.options}
                    classNamePrefix="react-select"
                    value={field.options.filter(option => (formData[field.name] || []).includes(option.value))}
                    styles={customStyles}
                    placeholder={`Оберіть ${field.label.toLowerCase()}...`}
                    closeMenuOnSelect={false}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                      setFormData(prev => ({ ...prev, [field.name]: values }));
                    }}
                    required={field.required}
                  />

              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={handleChange}
                  required={field.required}
                  className={styles.input}
                >
                  <option value="">Оберіть {field.label.toLowerCase()}...</option>
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
                  required={field.required}
                  className={styles.input}
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
