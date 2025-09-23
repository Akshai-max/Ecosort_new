"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function AuditLogsPage() {
	const [logs, setLogs] = useState<any[]>([]);

	useEffect(() => {
		setLogs([
			{ id: 'l1', actor: 'admin:a1', action: 'created manager m15', at: new Date().toISOString() },
			{ id: 'l2', actor: 'superadmin', action: 'changed policy', at: new Date().toISOString() },
		]);
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Audit Logs</div>
				<div className={styles.rewardsPreview}>
					{logs.map(l => (
						<div key={l.id} className={styles.rewardItem}>
							<div className={styles.rewardName}>{l.actor}</div>
							<div>{l.action}</div>
							<div>{new Date(l.at).toLocaleString()}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


