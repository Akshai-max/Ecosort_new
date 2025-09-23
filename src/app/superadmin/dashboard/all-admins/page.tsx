"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

type Admin = { id: string; name: string; role: 'admin' | 'manager' | 'employee' };

export default function AllAdminsPage() {
	const [list, setList] = useState<Admin[]>([
		{ id: 'a1', name: 'Ravi', role: 'admin' },
		{ id: 'a2', name: 'Meera', role: 'admin' },
	]);
	const [name, setName] = useState("");
	const [role, setRole] = useState<Admin['role']>('admin');

	function add() {
		if (!name) return;
		setList(prev => [{ id: `a_${Date.now()}`, name, role }, ...prev]);
		setName("");
	}

	function remove(id: string) {
		setList(prev => prev.filter(a => a.id !== id));
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Create Admin</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Name</div><input value={name} onChange={e => setName(e.target.value)} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Role</div>
						<select value={role} onChange={e => setRole(e.target.value as any)}>
							<option value="admin">Admin</option>
							<option value="manager">Manager</option>
							<option value="employee">Employee</option>
						</select>
					</div>
					<button className={styles.button} onClick={add}>Add</button>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>All Admins</div>
				<div className={styles.rewardsPreview}>
					{list.map(a => (
						<div key={a.id} className={styles.rewardItem}>
							<div className={styles.rewardName}>{a.name}</div>
							<div>{a.role}</div>
							<button className={styles.button} onClick={() => remove(a.id)}>Remove</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


