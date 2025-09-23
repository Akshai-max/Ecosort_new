"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function AdminSystemSettingsPage() {
	const [tab, setTab] = useState<'users' | 'managers' | 'employees' | 'taskRules'>('users');

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>System Settings (Limited)</div>
				<div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
					<button className={styles.button} onClick={() => setTab('users')}>Users</button>
					<button className={styles.button} onClick={() => setTab('employees')}>Employees</button>
					<button className={styles.button} onClick={() => setTab('managers')}>Managers</button>
					<button className={styles.button} onClick={() => setTab('taskRules')}>Task Rules</button>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>{tab === 'taskRules' ? 'Task Rules' : tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
				<div className={styles.cardContent}>
					{tab === 'taskRules' ? (
						<div>
							<div className={styles.infoRow}><div className={styles.infoLabel}>Max tasks/employee</div><input type="number" defaultValue={10} /></div>
							<div className={styles.infoRow}><div className={styles.infoLabel}>SLA hours</div><input type="number" defaultValue={48} /></div>
							<button className={styles.button}>Save</button>
						</div>
					) : (
						<div className={styles.emptyState}>CRUD for {tab} coming soon</div>
					)}
				</div>
			</div>
		</div>
	);
}