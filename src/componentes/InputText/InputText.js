import './InputText.css';

export const InputText = ({ type, placeholder, value, onChange }) => {
  return (
    <input className='input-text form-control'
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}