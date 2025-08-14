import React from "react";
import Text from "@/components/Text/Text";

export default async function Home() {
  return (
    <div>
      <div style={{ margin: "20px 0" }}>
        <Text.Title>Welcome To PredictaScore</Text.Title>
        <Text>
          Welcome to our football predictions website - PredictaScore! Where
          fans can test their knowledge and intuition by forecasting the
          outcomes of upcoming matches! Whether you&apos;re a seasoned supporter
          or just love the excitement of the game, our platform lets you
          compete, track your scores, and join a vibrant community of fellow
          football enthusiasts. Dive in, make your picks, and see how you stack
          up against your friends or rivals from around the world!
        </Text>
      </div>
    </div>
  );
}
