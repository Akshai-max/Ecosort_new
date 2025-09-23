"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

type Role = 'superadmin' | 'admin' | 'manager' | 'employee' | 'user';

const PERMISSIONS: Record<Role, Record<string, boolean>> = {
	superadmin: { system: true, admins: true, managers: true, employees: true, analytics: true, auditEdit: true, branding: true, rewardsApprove: true },
	admin: { system: false, admins: false, managers: true, employees: true, analytics: true, auditEdit: false, branding: false, rewardsApprove: false },
	manager: { system: false, admins: false, managers: false, employees: false, analytics: true, auditEdit: false, branding: false, rewardsApprove: false },
	employee: { system: false, admins: false, managers: false, employees: false, analytics: false, auditEdit: false, branding: false, rewardsApprove: false },
	user: { system: false, admins: false, managers: false, employees: false, analytics: false, auditEdit: false, branding: false, rewardsApprove: false },
};

export default function RolePermissionsPage() {
	const [role, setRole] = useState<Role>('admin');
	const [matrix, setMatrix] = useState(PERMISSIONS);

	function toggle(key: string) {
		setMatrix(prev => ({ ...prev, [role]: { ...prev[role], [key]: !prev[role][key] } }));
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Role & Permissions</div>
				<select value={role} onChange={e => setRole(e.target.value as Role)}>
					<option value="superadmin">Superadmin</option>
					<option value="admin">Admin</option>
					<option value="manager">Manager</option>
					<option value="employee">Employee</option>
					<option value="user">User</option>
				</select>
			</div>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Permissions Matrix</div>
				<div className={styles.rewardsPreview}>
					{Object.keys(matrix[role]).map(k => (
						<div key={k} className={styles.rewardItem}>
							<div className={styles.rewardName}>{k}</div>
							<input type="checkbox" checked={matrix[role][k]} onChange={() => toggle(k)} />
						</div>
					))}
				</div>
				<button className={styles.button}>Save Matrix</button>
			</div>
		</div>
	);
}


