"use client";

import { useForm } from "react-hook-form";
import { Input, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data, event) => {
    event?.preventDefault();
    console.log(data);
  });

  console.log(errors);

  return (
    <form onSubmit={onSubmit}>
      <Field label="First Name" errorText="First name is required">
        <Input
          {...register("firstName", {
            required: "First name is required",
            validate: (value) => value.length > 2 || "First name is too short",
          })}
        />
        {errors.firstName && <div>{errors.firstName.message}</div>}
      </Field>
      <Field label="Last Name" errorText="Last name is required">
        <Input
          {...register("lastName", {
            required: "Last name is required",
            validate: (value) => value.length > 2 || "Last name is too short",
          })}
        />
      </Field>
      <Field label="Email" errorText="Email is required">
        <Input {...register("email")} />
      </Field>
      <Field label="Confirm Email" errorText="Email is required">
        <Input {...register("confirmEmail")} />
      </Field>
      <Field label="Password" errorText="Password is required">
        <Input {...register("password")} />
      </Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
