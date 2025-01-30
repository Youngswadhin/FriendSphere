import { useId } from "react";
import { Label } from "../../components/ui/label";
import MultipleSelector, { Option } from "../../components/ui/multiselect";

interface SelectFieldProps {
  value: Option[];
  onChange: (value: Option[]) => void;
  title?: string;
  className?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  error?: string;
  errorEnabled?: boolean;
  flex?: number;
  name?: string;
  creatable?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  title = "",
  className = "",
  placeholder = "",
  options,
  error,
  errorEnabled = false,
  flex,
  creatable = false,
}) => {
  const id = useId();

  return (
    <div className="space-y-2" style={{ flex }}>
      <Label htmlFor={id}>{title}</Label>
      <MultipleSelector
        creatable={creatable}
        className={className}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
      />
      {errorEnabled && error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default SelectField;
