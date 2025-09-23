"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Reports } from "@/services/api";

export default function AdminReportsPage() {
	const [reports, setReports] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const res = await Reports.list();
				if (!ignore) setReports(res.reports || []);
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load reports');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Reports</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : error ? <div className={styles.error}>{error}</div> : reports.length === 0 ? <div className={styles.emptyState}>No reports</div> : (
					<div className={styles.rewardsPreview}>
						{reports.map(r => (
							<div key={r._id || r.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{r.title}</div>
								<div>{r.period}</div>
								<button className={styles.button}>Download</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}