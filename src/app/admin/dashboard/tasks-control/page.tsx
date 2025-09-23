"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Tasks } from "@/services/api";

export default function AdminTasksControlPage() {
	const [zoneId, setZoneId] = useState<string>("");
	const [tasks, setTasks] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await Tasks.list(zoneId ? { zoneId } : undefined);
				if (!ignore) setTasks(res.tasks);
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load tasks');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [zoneId]);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Assign & Track Tasks</div>
				<div style={{ display:'flex', gap: 12 }}>
					<input placeholder="Filter by zone" value={zoneId} onChange={e => setZoneId(e.target.value)} />
					<button className={styles.button}>New Task</button>
				</div>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Tasks</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : error ? <div className={styles.error}>{error}</div> : tasks.length === 0 ? <div className={styles.emptyState}>No tasks</div> : (
					<div className={styles.rewardsPreview}>
						{tasks.map(t => (
							<div key={t._id || t.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{t.title || t.taskName}</div>
								<div>{t.status}</div>
								<div className={styles.rewardPoints}>{t.points ? `${t.points} pts` : ''}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

