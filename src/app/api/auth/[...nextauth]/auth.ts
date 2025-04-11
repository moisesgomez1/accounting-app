// src/app/api/auth/[...nextauth]/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { postAuthenticate } from "@/utils/api-calls/auth/index"; // adjust the path if needed

export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          // Call your custom authentication service
          const response = await postAuthenticate({
            email: credentials.email,
            password: credentials.password,
          });

          // If the authentication service returns an error, return null to indicate failure
          if (response.error) {
            console.error("Authentication error:", response.message);
            return null;
          }

          // Return the user object required by NextAuth
          return {
            id: response.data.id, // Ensure your UserData includes an id field
            email: response.data.user_email, // Adjust according to your UserData properties
            username: response.data.loopita_initials, // Adjust as needed
            department: response.data.department,
            token: response.token,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      // Attach user information to the token when signing in
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      // Make the token available in the session object
      if (token && token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }: any) {
      // Basic sign-out logic: log a message when a user signs out
      console.log(`User signed out.`);
    },
  },
};
