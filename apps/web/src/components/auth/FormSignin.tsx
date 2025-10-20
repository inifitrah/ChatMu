import React from "react";
import { Form } from "@chatmu/ui";
import { FieldValues, UseFormReturn } from "react-hook-form";
import CustomFormField from "@/components/auth/CurstomFormField";

interface FormSignInProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

const FormSignIn = <T extends FieldValues>({ form }: FormSignInProps<T>) => {
  return (
    <Form {...form}>
      <form action="" className="space-y-3">
        <CustomFormField
          form={form}
          name="email"
          label="Email"
          placeholder="Email"
        />
        <CustomFormField
          form={form}
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          showPasswordToggle={true}
        />
      </form>
    </Form>
  );
};

export default FormSignIn;
