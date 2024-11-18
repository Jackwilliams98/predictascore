"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { Input, Button, Link } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Card } from "@/components/Card";

type FormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data, event) => {
    console.log(data);
  });

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <Field label="Email" errorText="Email is required">
          <Input
            {...register("email", {
              required: "Email is required",
              validate: (value) => value.includes("@") || "Email is invalid",
            })}
          />
        </Field>
        <Field label="Password" errorText="Password is required">
          <Input
            {...register("password", {
              required: "Password is required",
            })}
          />
        </Field>
        <Button type="submit">Submit</Button>
      </form>
      <div>
        Don&apos;t have an account? <Link href="/register">Register here!</Link>
      </div>
    </Card>
  );
};
