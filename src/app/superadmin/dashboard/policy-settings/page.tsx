"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

type Category = { id: string; name: string; multiplier: number };

export default function PolicySettingsPage() {
	const [categories, setCategories] = useState<Category[]>([
		{ id: 'c1', name: 'Plastic', multiplier: 1.0 },
		{ id: 'c2', name: 'Paper', multiplier: 0.8 },
		{ id: 'c3', name: 'Metal', multiplier: 1.2 },
	]);
	const [name, setName] = useState("");
	const [multiplier, setMultiplier] = useState(1);

	function add() {
		if (!name) return;
		setCategories(prev => [{ id: `c_${Date.now()}`, name, multiplier }, ...prev]);
		setName("");
		setMultiplier(1);
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Waste Categories & Multipliers</div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>Name</div><input value={name} onChange={e => setName(e.target.value)} /></div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>Multiplier</div><input type="number" step="0.1" value={multiplier} onChange={e => setMultiplier(Number(e.target.value))} /></div>
				<button className={styles.button} onClick={add}>Add</button>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Current Policies</div>
				<div className={styles.rewardsPreview}>
					{categories.map(c => (
						<div key={c.id} className={styles.rewardItem}>
							<div className={styles.rewardName}>{c.name}</div>
							<div>×{c.multiplier.toFixed(1)}</div>
							<button className={styles.button}>Edit</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


