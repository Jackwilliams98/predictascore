import React from "react";

import { getUsers } from "@/lib/userAPI";

export default async function Home() {
  const users = await getUsers();

  return (
    <div>
      Home page
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
