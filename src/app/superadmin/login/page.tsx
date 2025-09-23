import Link from "next/link";

export default function SuperadminLoginPage() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Superadmin Login</h1>
			<p>Placeholder for superadmin login screen.</p>
			<nav style={{ marginTop: 16 }}>
				<Link href="/superadmin/dashboard">Go to Superadmin Dashboard</Link>
			</nav>
		</main>
	);
}

