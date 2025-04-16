import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface CustomFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  showPasswordToggle?: boolean;
}

const CustomFormField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text", // default to text
  showPasswordToggle = false,
  form,
}: CustomFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPasswordToggle && showPassword ? "text" : type}
                className="py-6 border-2 w-full px-3 pr-12/70 rounded-[20] h-10 disabled:cursor-not-allowed"
                placeholder={placeholder}
                {...field}
              />
              {showPasswordToggle && (
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
