"use client";

import { FormEventHandler } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { Input } from "@chakra-ui/react";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
};

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      // lastName: "",
      email: "",
      // confirmEmail: "",
      // password: "",
    },
  });

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: data.firstName, email: data.email }),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const user = await response.json();
      console.log("User created:", user);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <Field label="First Name" errorText="First name is required">
          <Input
            {...register("firstName", {
              required: "First name is required",
              validate: (value) =>
                value.length > 2 || "First name is too short",
            })}
          />
          {errors.firstName && <div>{errors.firstName.message}</div>}
        </Field>
        {/* <Field label="Last Name" errorText="Last name is required">
          <Input
            {...register("lastName", {
              required: "Last name is required",
              validate: (value) => value.length > 2 || "Last name is too short",
            })}
          />
        </Field> */}
        <Field label="Email" errorText="Email is required">
          <Input {...register("email")} />
        </Field>
        {/* <Field label="Confirm Email" errorText="Email is required">
          <Input {...register("confirmEmail")} />
        </Field>
        <Field label="Password" errorText="Password is required">
          <Input {...register("password")} />
        </Field> */}
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
};
