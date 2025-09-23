"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function SystemOverviewPage() {
	const [stats, setStats] = useState({ zones: 4, managers: 12, employees: 120, users: 5400, uptime: '99.98%' });
	useEffect(() => {
		// hook real-time feed later
		const id = setInterval(() => setStats(s => ({ ...s })), 5000);
		return () => clearInterval(id);
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.statsContainer}>
				<div className={styles.statCard}><div className={styles.statIcon}>🗺️</div><div className={styles.statInfo}><div className={styles.statTitle}>Zones</div><div className={styles.statValue}>{stats.zones}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>👨‍💼</div><div className={styles.statInfo}><div className={styles.statTitle}>Managers</div><div className={styles.statValue}>{stats.managers}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>👷</div><div className={styles.statInfo}><div className={styles.statTitle}>Employees</div><div className={styles.statValue}>{stats.employees}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>🧑‍🤝‍🧑</div><div className={styles.statInfo}><div className={styles.statTitle}>Users</div><div className={styles.statValue}>{stats.users}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>🟢</div><div className={styles.statInfo}><div className={styles.statTitle}>Uptime</div><div className={styles.statValue}>{stats.uptime}</div></div></div>
			</div>
			<div className={styles.card}><div className={styles.cardTitle}>Real-time Feed</div><div className={styles.emptyState}>Live events stream will appear here.</div></div>
		</div>
	);
}

