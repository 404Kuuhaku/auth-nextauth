// import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();
		const salt = 10;
		const hashedPassword = bcrypt.hashSync(password, salt);
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		return Response.json({
			message: "create user successful",
			data: { newUser },
		});
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
