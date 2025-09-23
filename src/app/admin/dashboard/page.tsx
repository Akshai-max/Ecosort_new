import Link from "next/link";

export default function AdminDashboardHomePage() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Admin Dashboard</h1>
			<ul style={{ marginTop: 16, lineHeight: 1.9 }}>
				<li><Link href="/admin/dashboard/zones-overview">Zones Overview</Link></li>
				<li><Link href="/admin/dashboard/employee-monitoring">Employee Monitoring</Link></li>
				<li><Link href="/admin/dashboard/manager-monitoring">Manager Monitoring</Link></li>
				<li><Link href="/admin/dashboard/tasks-control">Tasks Control</Link></li>
				<li><Link href="/admin/dashboard/analytics">Analytics</Link></li>
				<li><Link href="/admin/dashboard/issues">Issues & Complaints</Link></li>
				<li><Link href="/admin/dashboard/notifications">Notifications</Link></li>
				<li><Link href="/admin/dashboard/reports">Reports</Link></li>
				<li><Link href="/admin/dashboard/reward-approval">Reward Approval</Link></li>
				<li><Link href="/admin/dashboard/system-settings">System Settings (Limited)</Link></li>
			</ul>
		</main>
	);
}

