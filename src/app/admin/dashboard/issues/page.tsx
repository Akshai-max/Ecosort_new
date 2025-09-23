"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Issues } from "@/services/api";

export default function AdminIssuesPage() {
	const [zoneId, setZoneId] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const [list, setList] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const res = await Issues.list({ zoneId: zoneId || undefined, status: status || undefined });
				if (!ignore) setList(res.issues);
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load issues');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [zoneId, status]);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Filters</div>
				<div style={{ display:'flex', gap: 12 }}>
					<input placeholder="Zone" value={zoneId} onChange={e => setZoneId(e.target.value)} />
					<select value={status} onChange={e => setStatus(e.target.value)}>
						<option value="">All</option>
						<option>open</option>
						<option>in_progress</option>
						<option>resolved</option>
					</select>
				</div>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Issues & Complaints</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : error ? <div className={styles.error}>{error}</div> : list.length === 0 ? <div className={styles.emptyState}>No issues</div> : (
					<div className={styles.rewardsPreview}>
						{list.map(i => (
							<div key={i._id || i.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{i.title || i.category}</div>
								<div>{i.priority || 'normal'}</div>
								<div>{i.status}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
