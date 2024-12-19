import React from "react";

import { Form } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import CustomFormField from "@/components/auth/CurstomFormField";

interface FormSignUpProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

const FormSignUp = <T extends FieldValues>({ form }: FormSignUpProps<T>) => {
  return (
    <Form {...form}>
      <form action="" className="space-y-3">
        <CustomFormField
          form={form}
          name={"name"}
          label="Fullname"
          placeholder="Fullname"
        />
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

export default FormSignUp;
