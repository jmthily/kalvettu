import { cn } from "@/lib/cn";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, className, id, ...props }: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-stone-900",
          "placeholder:text-stone-400 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextAreaInput({ label, className, id, ...props }: TextAreaInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-stone-900",
          "placeholder:text-stone-400 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100",
          className
        )}
        {...props}
      />
    </div>
  );
}
