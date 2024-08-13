'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Pantry() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  return (
    <main>
      <h1>Pantry</h1>
      <p>Welcome {session?.data?.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  )
}

Pantry.requireAuth = true;
