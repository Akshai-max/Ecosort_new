"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function BackupRestorePage() {
	const [snapshots, setSnapshots] = useState<any[]>([{ id: 's1', createdAt: new Date().toISOString() }]);

	function createSnapshot() {
		setSnapshots(prev => [{ id: `s_${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Backup & Restore</div>
				<button className={styles.button} onClick={createSnapshot}>Create Snapshot</button>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Snapshots</div>
				<div className={styles.rewardsPreview}>
					{snapshots.map(s => (
						<div key={s.id} className={styles.rewardItem}>
							<div className={styles.rewardName}>{s.id}</div>
							<div>{new Date(s.createdAt).toLocaleString()}</div>
							<button className={styles.button}>Restore</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


