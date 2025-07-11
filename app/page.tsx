import React from "react";
import Image from "next/image";
import june from "./assets/homepage.png";
import Text from "@/components/Text/Text";

export default async function Home() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src={june} alt="June" width={300} height={300} priority />
      </div>
      <div style={{ margin: "20px 0" }}>
        <Text.Title>Welcome To PredictaScore</Text.Title>
        <Text>
          Welcome to our football predictions website - PredictaScore! Where
          fans can test their knowledge and intuition by forecasting the
          outcomes of upcoming matches! Whether you&apos;re a seasoned supporter
          or just love the excitement of the game, our platform lets you
          compete, track your scores, and join a vibrant community of fellow
          football enthusiasts. And in a special twist, we&apos;re thrilled to
          feature June Squibb—bringing her unique charm and passion for football
          to our prediction league. Dive in, make your picks, and see how you
          stack up against June and fans from around the world!
        </Text>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Text.Title>About June Squibb</Text.Title>
        <Text>
          We&apos;re delighted to welcome the legendary June Squibb to
          PredictaScore! Known for her wit and warmth, June is as passionate
          about football as she is about film. She&apos;s excited to join our
          community and share in the fun of match predictions. “I&apos;m
          absolutely thrilled to be partnering with PredictaScore this season -
          I&apos;m going to have to play down the chun! It&apos;s a fantastic
          way to bring fans together and celebrate the beautiful game. And
          don&apos;t forget to check out the Gantry Gab podcast—make sure you
          follow them on Spotify for all the latest football banter! Big up
          Reggie, you were a real one.” — June Squibb
        </Text>
        <br />
        <Text>
          Ready to play? Make your predictions and join June in the excitement!
        </Text>
      </div>
    </div>
  );
}
