### To give NextAuth access to a catch-all route in Next.js 13, you need to create a file inside the app/api/auth directory with the naming convention [...nextauth].ts or [...nextauth].js. This catch-all route will handle all authentication-related requests.

## Here are the steps to set up the catch-all route:

# Create the file app/api/auth/[...nextauth]/route.ts (or route.js if you prefer JavaScript).

# Install the next-auth package by running the following command:
# npm install next-auth
# Inside the route.ts file, import the NextAuth function from the next-auth package and create a handler:

    import NextAuth from "next-auth";

    const handler = NextAuth({
    // NextAuth configuration options go here
    });

    export { handler as GET, handler as POST };

# In this code snippet, we import the NextAuth function and create a handler by calling NextAuth with the desired configuration options. We then export the handler as both GET and POST handlers, as NextAuth requires access to both HTTP methods.

# By setting up the catch-all route and exporting the handler, you've given NextAuth access to handle authentication-related requests in your Next.js 13 application.
 
## Adding Authentication Providers
NextAuth supports three broad types of authentication providers:
# OAuth Providers: These providers allow users to sign in using their existing accounts from services like Google, Facebook, Twitter, GitHub, and more. This is commonly referred to as "social login."
# Email Provider: This provider enables passwordless email login, where users receive a one-time password (OTP) or a magic link via email to sign in.
# Credentials Provider: This provider allows you to implement your own custom authentication strategy, such as authenticating users against a username/password database or integrating with an existing authentication system.
# To add authentication providers, you need to import them and configure them within the NextAuth options object. Here's an example of how you might add a Google OAuth provider:
    import GoogleProvider from "next-auth/providers/google";

    const handler = NextAuth({
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Add other providers here
    ],
    // Other NextAuth configuration options
    });

    export { handler as GET, handler as POST };


## In this example, we import the GoogleProvider from next-auth/providers/google and configure it with the required clientId and clientSecret values, which should be stored as environment variables.
# You can add multiple providers by including them in the providers array within the NextAuth options object.
 
Credentials provider
This lets you create your own authentication strategy
For example
Email + Password
Phone number
Login with Metamask
Steps to follow
Add a credentials provider
import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {

            return {
                id: "user1"
            };
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }


## Add NEXTAUTH_URL to .env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=password_nextauth

## Update App.tsx to have a simple Appbar
"use client";
import { signIn, signOut } from "next-auth/react"

export const Appbar = () => {
    return <div>
    <button onClick={() => signIn()}>Signin</button>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
}

## Click
## Add providers.tsx
'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

## Wrap layout with Providers
import { Providers } from "./provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

## Get the user details in the top level page.tsx (client component)
"use client"

import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return (
    <div>
      {JSON.stringify(session.data?.user)}
    </div>
  );
}


## Get the user details on the server (server component)
import { getServerSession } from "next-auth"

async function getUser() {
  const session = await getServerSession();
  return session;
}

export default async function Home() {
  const session = await getUser();

  return (
    <div>
      {JSON.stringify(session?.user?.name)}
    </div>
  );
}


## Get user in an api route (/api/user)
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();

    return NextResponse.json({
        name: session?.user?.name
    })
}

# Persist more data (user id) (Ref https://next-auth.js.org/getting-started/example#using-nextauthjs-callbacks) (Ref https://next-auth.js.org/configuration/callbacks)
  callbacks: {
      jwt: async ({ user, token }: any) => {
	      if (user) {
	          token.uid = user.id;
	      }
	      return token;
      },
    session: ({ session, token, user }: any) => {
        if (session.user) {
            session.user.id = token.uid
        }
        return session
    }
  },

## Move auth config to lib/auth.tshttps://github.com/nextauthjs/next-auth/issues/7658#issuecomment-1683225019

import CredentialsProvider from 'next-auth/providers/credentials';

export const NEXT_AUTH_CONFIG = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: 'email', type: 'text', placeholder: '' },
            password: { label: 'password', type: 'password', placeholder: '' },
          },
          async authorize(credentials: any) {

              return {
                  id: "user1",
                  name: "asd",
                  userId: "asd",
                  email: "ramdomEmail"
              };
          },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
        if (user) {
            token.uid = user.id;
        }
        return token;
        },
      session: ({ session, token, user }: any) => {
          if (session.user) {
              session.user.id = token.uid
          }
          return session
      }
    },
  }