"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Manager } from "@/services/api";

export default function AdminNotificationsPage() {
	const [managerId, setManagerId] = useState<string>("");
	const [type, setType] = useState<string>("");
	const [priority, setPriority] = useState<string>("");
	const [list, setList] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const res = await Manager.notifications(managerId || 'demo', { type: type || undefined, priority: priority || undefined });
				if (!ignore) setList(res.notifications || []);
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load notifications');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [managerId, type, priority]);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Send Notification</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>To</div><input placeholder="Manager ID" value={managerId} onChange={e => setManagerId(e.target.value)} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Type</div><input placeholder="type" value={type} onChange={e => setType(e.target.value)} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Priority</div><input placeholder="priority" value={priority} onChange={e => setPriority(e.target.value)} /></div>
					<button className={styles.button}>Send</button>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Recent Notifications</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : error ? <div className={styles.error}>{error}</div> : (
					<div className={styles.rewardsPreview}>
						{list.map(n => (
							<div key={n._id || n.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{n.title || n.type}</div>
								<div>{n.priority}</div>
								<div>{new Date(n.createdAt || Date.now()).toLocaleString()}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
