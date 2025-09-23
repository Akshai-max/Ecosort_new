"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";
import { Analytics } from "@/services/api";

export default function AdminZonesOverviewPage() {
	const [zoneId, setZoneId] = useState("North");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [weekly, setWeekly] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const [w, c] = await Promise.all([
					Analytics.weekly(zoneId),
					Analytics.categories(zoneId),
				]);
				if (ignore) return;
				setWeekly(w.weeklyData || []);
				setCategories(c.categories || []);
				setTotal(c.totalWaste || 0);
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load zone analytics');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, [zoneId]);

	return (
		<div className={styles.content}>
			<div className={styles.statsContainer}>
				<div className={styles.statCard}><div className={styles.statIcon}>🗺️</div><div className={styles.statInfo}><div className={styles.statTitle}>Zone</div><div className={styles.statValue}>{zoneId}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>🧰</div><div className={styles.statInfo}><div className={styles.statTitle}>Categories</div><div className={styles.statValue}>{categories.length}</div></div></div>
				<div className={styles.statCard}><div className={styles.statIcon}>🗑️</div><div className={styles.statInfo}><div className={styles.statTitle}>Total Waste</div><div className={styles.statValue}>{total} kg</div></div></div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Filters</div>
				<div style={{ display:'flex', gap: 12 }}>
					<select value={zoneId} onChange={e => setZoneId(e.target.value)}>
						<option>North</option>
						<option>South</option>
						<option>East</option>
						<option>West</option>
					</select>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Weekly Collection</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : error ? <div className={styles.error}>{error}</div> : (
					<div className={styles.recentActivity}>
						<div className={styles.activityList}>
							{weekly.map((d: any, idx: number) => (
								<div key={idx} className={styles.activityItem}>
									<div className={styles.activityIcon}>📦</div>
									<div className={styles.activityDetails}><div className={styles.activityText}>Week {d.week} - {d.total} kg</div></div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>By Category</div>
				<div className={styles.leaderboardPreview}>
					{categories.map((c: any) => (
						<div key={c.category} className={styles.leaderboardItem}>
							<div className={styles.name}>{c.category}</div>
							<div className={styles.points}>{c.total} kg</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
