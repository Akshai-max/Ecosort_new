import Link from "next/link";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function SuperadminDashboardHomePage() {
	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Superadmin Dashboard</div>
				<ul className={styles.leaderboardPreview}>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/system-overview">System Overview</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/all-admins">All Admins</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/role-permissions">Role & Permissions</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/audit-logs">Audit Logs</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/backup-restore">Backup & Restore</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/branding">Branding</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/policy-settings">Policy Settings</Link></li>
					<li className={styles.leaderboardItem}><Link className={styles.cardLink} href="/superadmin/dashboard/security">Security Controls</Link></li>
				</ul>
			</div>
		</div>
	);
}
