"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Loading } from "@/components";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface CreateLeagueFormType {
  leagueName: string;
}

export default function CreateLeagueForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  if (!userId) {
    router.push("/api/auth/signin");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeagueFormType>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<CreateLeagueFormType> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const body = JSON.stringify({
      leagueName: data.leagueName,
      userId: userId,
    });

    let leagueId: string | null = null;

    try {
      const response = await fetch("/api/league/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create league");
      }

      const league = await response.json();
      setSuccess(`League "${league.name}" created successfully!`);
      leagueId = league.id;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      if (leagueId) {
        router.push(`/leagues/${leagueId}`);
      }
    }
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            left: "50%",
          }}
        >
          <Loading />
        </div>
      )}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              gap: "18px",
              display: "flex",
              flexDirection: "column",
              marginBottom: "18px",
            }}
          >
            <Text.Header>Name of your league</Text.Header>
            <input
              {...register("leagueName", {
                required: "League name is required",
              })}
              placeholder="Enter league name"
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #000",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            />
            {errors.leagueName && (
              <Text style={{ color: "red", marginTop: "5px" }}>
                {errors.leagueName.message}
              </Text>
            )}
          </div>
          <Button type="submit" fontSize={18}>
            Create League
          </Button>
        </form>
        {error && (
          <Text style={{ color: "red", marginTop: "10px" }}>{error}</Text>
        )}
        {success && (
          <Text style={{ color: "green", marginTop: "10px" }}>{success}</Text>
        )}
      </Card>
    </>
  );
}
