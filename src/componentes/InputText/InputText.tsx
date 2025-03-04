import './InputText.css';

interface IInputTextProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText: React.FC<IInputTextProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input className='input-text form-control'
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}