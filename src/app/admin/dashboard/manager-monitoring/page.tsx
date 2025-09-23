"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Manager } from "@/services/api";

export default function AdminManagerMonitoringPage() {
	const [managerId, setManagerId] = useState<string>("");
	const [employees, setEmployees] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const res = await Manager.employees(managerId || 'demo');
				if (!ignore) setEmployees(res.employees || []);
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [managerId]);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Filters</div>
				<input placeholder="Manager ID" value={managerId} onChange={e => setManagerId(e.target.value)} />
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Manager Team</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : employees.length === 0 ? <div className={styles.emptyState}>No data</div> : (
					<div className={styles.leaderboardPreview}>
						{employees.map(e => (
							<div key={e._id || e.id} className={styles.leaderboardItem}>
								<div className={styles.name}>{e.name || e.fullName || 'Employee'}</div>
								<div className={styles.points}>{e.performance?.score ?? 0}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
