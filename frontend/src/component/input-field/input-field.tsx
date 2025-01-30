import { useId, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { LucideIcon } from "lucide-react";

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  title?: string;
  className?: string;
  placeholder?: string;
  type?: string;
  max?: number;
  error?: string;
  errorEnabled?: boolean;
  preIcon?: LucideIcon;
  password?: boolean;
  flex?: number;
  name?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  onBlur,
  title = "Enter Email",
  className = "",
  placeholder = "Email",
  type = "email",
  max,
  error,
  errorEnabled = false,
  preIcon: PreIcon,
  password = false,
  flex,
  name = "",
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="space-y-2" style={{ flex }}>
      <Label htmlFor={id}>{title}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          className={
            className
              ? password
                ? ""
                : className + "peer ps-9"
              : password
              ? ""
              : PreIcon
              ? "peer ps-9"
              : ""
          }
          placeholder={placeholder}
          type={password ? (isVisible ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          max={max}
          aria-invalid={errorEnabled && !!error}
        />
        {password ? (
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls={id}
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        ) : (
          PreIcon && (
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <PreIcon size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          )
        )}
      </div>
      {errorEnabled && error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default InputField;
