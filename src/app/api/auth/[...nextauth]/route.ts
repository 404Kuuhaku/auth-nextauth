import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextApiHandler } from "next";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const getRequiredEnv = (key: string): string => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
};

const googleClientId = getRequiredEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = getRequiredEnv("GOOGLE_CLIENT_SECRET");

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "john@doe.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (
					user &&
					user.password &&
					(await bcrypt.compare(credentials.password, user.password))
				) {
					return {
						id: user.id.toString(),
						name: user.name || "Unknown User",
						email: user.email,
						role: user.role,
					};
				} else {
					throw new Error("Invalid email or password");
				}
			},
		}),
		GoogleProvider({
			clientId: googleClientId,
			clientSecret: googleClientSecret,
			profile(profile) {
				return {
					id: profile.sub,
					name: `${profile.given_name} ${profile.family_name}`,
					email: profile.email,
					image: profile.picture,
					role: "member",
				};
			},
		}),
	],
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.image = token.picture;
			}
			return session;
		},
		async redirect({ baseUrl }) {
			return `${baseUrl}/profile`;
		},
	},
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export const GET = handler;
export const POST = handler;

declare module "next-auth" {
	interface User {
		id: string;
		name: string;
		email: string;
		image?: string;
		role: string;
	}

	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role: string;
			image: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
