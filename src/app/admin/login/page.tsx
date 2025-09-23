import Link from "next/link";

export default function AdminLoginPage() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Admin Login</h1>
			<p>This is a placeholder for the admin login screen.</p>
			<nav style={{ marginTop: 16 }}>
				<Link href="/admin/dashboard">Go to Admin Dashboard</Link>
			</nav>
		</main>
	);
}

