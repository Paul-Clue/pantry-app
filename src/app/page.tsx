'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


export default function Home() {
  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/signin");
  //   },
  // });
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome</p>
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </main>
  );
}

// Home.requireAuth = true;
