"use client";
import { useId, useState } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

type FieldType =
  | "text"
  | "password"
  | "number"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select";

type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement>,
  "type" | "value" | "onChange" | "className"
>;

interface FieldProps extends NativeProps {
  label?: string;
  type?: FieldType;
  value: string | number;
  onValueChange: (value: string) => void;
  options?: SelectOption[];
  error?: string;
  hint?: string;
  className?: string;
  /** Applied to the outer wrapper (label + control + hint/error). */
  wrapperClassName?: string;
  rows?: number;
  placeholder?: string;
}

const lbl = "text-caption text-slate-600 block mb-1.5";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

export default function Field({
  label,
  type = "text",
  value,
  onValueChange,
  options,
  error,
  hint,
  className = "",
  wrapperClassName = "",
  id,
  rows = 4,
  required,
  placeholder,
  ...rest
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [revealPassword, setRevealPassword] = useState(false);
  const isPassword = type === "password";

  const controlClass = `w-full bg-white border rounded-lg px-6 text-sm font-normal focus:outline-none transition-all placeholder:text-slate-300 ${
    error
      ? "border-red-300 focus:border-red-500"
      : "border-slate-200 focus:border-emerald-500"
  } ${type === "textarea" ? "py-3.5 resize-none" : "h-12"} ${isPassword ? "pr-12" : ""} ${className}`;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={fieldId} className={lbl}>
          {label}
          {required ? " *" : ""}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={controlClass}
          rows={rows}
          required={required}
          placeholder={placeholder}
          {...rest}
        />
      ) : type === "select" ? (
        <div className="relative">
          <select
            id={fieldId}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className={`${controlClass} appearance-none pr-10`}
            required={required}
            {...(rest as Record<string, unknown>)}
          >
            {placeholder && !options?.some((opt) => opt.value === "") && (
              <option value="">{placeholder}</option>
            )}
            {(options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      ) : isPassword ? (
        <div className="relative">
          <input
            id={fieldId}
            type={revealPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className={controlClass}
            required={required}
            placeholder={placeholder}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setRevealPassword((v) => !v)}
            aria-label={revealPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <EyeIcon open={revealPassword} />
          </button>
        </div>
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={controlClass}
          required={required}
          placeholder={placeholder}
          {...rest}
        />
      )}

      {error ? (
        <p
          className="text-caption text-red-500 ml-5"
          style={{ fontSize: "10px" }}
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs font-normal text-slate-400 ml-5">{hint}</p>
      ) : null}
    </div>
  );
}
