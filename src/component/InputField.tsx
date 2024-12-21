import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string | number; // Accept both string and number types
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  min?: number; // Optional min prop for number fields
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, value, onChange, min }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        min={min} // Apply the min attribute if provided
      />
    </div>
  );
};

export default InputField;
