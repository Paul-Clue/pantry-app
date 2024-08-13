import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from "../../../src/app/firebase";


export const authOptions = {
  pages: {
    signIn: "/signin",
    signup: '/signup'
  },

  // providers: [
  //   CredentialsProvider({
  //     name: "Credentials",
  //     credentials: {},
  //     async authorize(credentials): Promise<any> {
  //       return await signInWithEmailAndPassword(auth, (credentials as any).email, (credentials as any).password || '').then((userCredential) => {
  //         if (userCredential.user) {
  //         return userCredential.user;
  //       }
  //       return null;
  //       }).catch((error: any) => {
  //         console.log(error);
  //       });
  //     },
  //   }),
  // ],
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        const { email, password, isSignUp } = credentials as {
          email: string;
          password: string;
          isSignUp?: boolean;
        };

        if (isSignUp) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            };
          } catch (error) {
            console.error('Error signing up:', error);
            return null;
          }
        } else {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            };
          } catch (error) {
            console.error('Error signing in:', error);
            return null;
          }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);