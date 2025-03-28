"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { Input, Link } from "@chakra-ui/react";
import { Button, Field, PasswordInput } from "@/components";
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
        <Field label="Email">
          <Input
            {...register("email", {
              required: "Email is required",
              validate: (value) => value.includes("@") || "Email is invalid",
            })}
          />
          {errors.email && (
            <div style={{ color: "red" }}>{errors.email.message}</div>
          )}
        </Field>
        <Field label="Password" errorText="Password is required">
          <PasswordInput
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password.message}</div>
          )}
        </Field>
        <Button type="submit">Submit</Button>
      </form>
      <div>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "green" }}>
          Register here!
        </Link>
      </div>
    </Card>
  );
};
