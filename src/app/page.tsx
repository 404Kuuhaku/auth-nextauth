"use client";

import { signIn } from "next-auth/react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const data = new FormData(event.currentTarget);
			const email = data.get("email");
			const password = data.get("password");

			console.log({
				email,
				password,
			});

			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				console.error(result.error);
				return false;
			}

			router.push("/profile");
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<>
			<Typography
				variant="h2"
				component="h2"
				sx={{ textAlign: "center" }}
			>
				Login Page
			</Typography>
			<Box
				sx={{
					width: { xs: "80vw", md: "50vw", lg: "20vw" },
					height: "100vh",
					mx: "auto",
					my: "auto",
				}}
			>
				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
						gap: 2,
					}}
				>
					<FormControl>
						<FormLabel htmlFor="email">Email</FormLabel>
						<TextField
							id="email"
							type="email"
							name="email"
							placeholder="your@email.com"
							autoComplete="email"
							autoFocus
							required
							fullWidth
							variant="outlined"
							sx={{ ariaLabel: "email" }}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor="password">Password</FormLabel>
						<TextField
							name="password"
							placeholder="••••••"
							type="password"
							id="password"
							autoComplete="current-password"
							autoFocus
							required
							fullWidth
							variant="outlined"
						/>
					</FormControl>
					<Button
						type="submit"
						fullWidth
						variant="contained"
					>
						Sign in
					</Button>
					<Button
						fullWidth
						variant="contained"
						onClick={() => signIn("google")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 488 512"
							width="20"
							height="20"
						>
							<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
						</svg>
						Sign in with Google
					</Button>
					{/* <Typography sx={{ textAlign: "center" }}>
						Don&apos;t have an account?{" "}
						<span>
							<Link
								href="/sign-up/"
								variant="body2"
								sx={{ alignSelf: "center" }}
							>
								Sign up
							</Link>
						</span>
					</Typography> */}
				</Box>
			</Box>
		</>
	);
}
