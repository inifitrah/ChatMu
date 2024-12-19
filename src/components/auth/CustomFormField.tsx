import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  showPasswordToggle?: boolean;
}
const CustomFormField = ({
  name,
  label,
  placeholder,
  type = "text",
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPasswordToggle && showPassword ? "text" : type}
                className="py-6 border-2 w-full px-3 pr-12/70 border-black rounded-2xl h-10 disabled:cursor-not-allowed"
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
        />
  )
}


export default CustomFormField