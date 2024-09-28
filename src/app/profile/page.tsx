"use client";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ProfilePage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleLogout = useCallback(() => {
		signOut({ callbackUrl: "/" });
	}, []);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [router, status]);

	return (
		<>
			{status === "authenticated" && session.user && (
				<>
					<Typography
						variant="h2"
						component="h2"
						sx={{ textAlign: "center" }}
					>
						Profile Page
					</Typography>
					<Box
						sx={{
							width: { xs: "80vw", md: "50vw", lg: "20vw" },
							height: "100vh",
							mx: "auto",
							my: "auto",
						}}
					>
						<Typography>Welcome!, {session.user.name}</Typography>
						<Typography>Email : {session.user.email}</Typography>
						<Typography>Role : {session.user.role}</Typography>
						{/* <Typography>Role : {session.user.role}</Typography> */}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="error"
							onClick={handleLogout}
						>
							Log Out
						</Button>
					</Box>
				</>
			)}
		</>
	);
};

export default ProfilePage;
