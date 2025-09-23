"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Performance, Employee } from "@/services/api";

export default function AdminEmployeeMonitoringPage() {
	const [employeeId, setEmployeeId] = useState<string>("");
	const [attendance, setAttendance] = useState<any[]>([]);
	const [metrics, setMetrics] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const [perf] = await Promise.all([
					Performance.forEmployee(employeeId || 'demo'),
				]);
				if (ignore) return;
				setMetrics(perf.performance || {});
				setAttendance([{ day: 'Mon', status: 'present' }, { day: 'Tue', status: 'present' }, { day: 'Wed', status: 'absent' }]);
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [employeeId]);

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Filters</div>
				<input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
			</div>

			<div className={styles.statsContainer}>
				<div className={styles.statCard}><div className={styles.statIcon}>✅</div><div className={styles.statInfo}><div className={styles.statTitle}>Tasks Completed</div><div className={styles.statValue}>{metrics?.completed || 0}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>🗑️</div><div className={styles.statInfo}><div className={styles.statTitle}>Waste Collected</div><div className={styles.statValue}>{metrics?.wasteCollected || 0} kg</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>⚠️</div><div className={styles.statInfo}><div className={styles.statTitle}>Safety Alerts</div><div className={styles.statValue}>{metrics?.alerts || 0}</div></div></div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Attendance</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : (
					<div className={styles.rewardsPreview}>
						{attendance.map(a => (
							<div key={a.day} className={styles.rewardItem}>
								<div className={styles.rewardName}>{a.day}</div>
								<div>{a.status}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
