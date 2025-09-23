"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function SecurityControlsPage() {
	const [apiKeys, setApiKeys] = useState<string[]>(['sk_live_********']);
	const [newKey, setNewKey] = useState("");

	function addKey() {
		if (!newKey) return;
		setApiKeys(prev => [newKey, ...prev]);
		setNewKey("");
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>API Keys</div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>New Key</div><input value={newKey} onChange={e => setNewKey(e.target.value)} /></div>
				<button className={styles.button} onClick={addKey}>Add</button>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Existing Keys</div>
				<div className={styles.rewardsPreview}>
					{apiKeys.map((k, idx) => (
						<div key={idx} className={styles.rewardItem}>
							<div className={styles.rewardName}>{k}</div>
							<button className={styles.button} onClick={() => setApiKeys(prev => prev.filter(x => x !== k))}>Revoke</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


