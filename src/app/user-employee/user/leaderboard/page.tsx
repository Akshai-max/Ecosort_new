"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "../dashboard/dashboard.module.css";
import { Leaderboard as LeaderboardApi, Profiles } from "@/services/api";
import Link from "next/link";
import { Medal, Trophy, Sparkles, TrendingUp } from "lucide-react";

type TopItem = { rank: number; id: string; name: string; avatar?: string; points: number };

const UserLeaderboardPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [top, setTop] = useState<TopItem[]>([]);
	const [total, setTotal] = useState(0);
	const [summary, setSummary] = useState<{ rank: number; points: number; weeklyGain: number } | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(20);
	const [zone, setZone] = useState<string>("");
	const [range, setRange] = useState<"week" | "month" | "all">("week");
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const [{ user }, lb] = await Promise.all([
					Profiles.user(),
					LeaderboardApi.top({ zone: zone || undefined, range, page, pageSize }),
				]);
				if (ignore) return;
				setUserId(user?._id || user?.id || null);
				setTop(lb.top);
				setTotal(lb.total);
				setSummary(lb.summary);
			} catch (e: any) {
				if (!ignore) setError(e.message || "Failed to load leaderboard");
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		load();
		return () => { ignore = true; };
	}, [page, pageSize, zone, range]);

	const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

	return (
		<div className={styles.content}>
			<div className={styles.statsContainer}>
				<div className={styles.statCard}>
					<div className={styles.statIcon}><Trophy size={24} /></div>
					<div className={styles.statInfo}>
						<div className={styles.statTitle}>Your Rank</div>
						<div className={styles.statValue}>{summary?.rank ?? "-"}</div>
					</div>
				</div>
				<div className={styles.statCard}>
					<div className={styles.statIcon}><Sparkles size={24} /></div>
					<div className={styles.statInfo}>
						<div className={styles.statTitle}>Points</div>
						<div className={styles.statValue}>{summary?.points ?? "-"}</div>
					</div>
				</div>
				<div className={styles.statCard}>
					<div className={styles.statIcon}><TrendingUp size={24} /></div>
					<div className={styles.statInfo}>
						<div className={styles.statTitle}>Weekly Gain</div>
						<div className={styles.statValue}>{summary?.weeklyGain ?? 0}</div>
					</div>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Top Contributors</div>
				<div className={styles.controlsRow}>
					<select className={styles.select} value={range} onChange={e => { setPage(1); setRange(e.target.value as any); }}>
						<option value="week">This week</option>
						<option value="month">This month</option>
						<option value="all">All time</option>
					</select>
					<input className={styles.input} placeholder="Filter by zone" value={zone} onChange={e => { setPage(1); setZone(e.target.value); }} />
				</div>
				{loading ? (
					<div className={styles.loading}><div className={styles.loader} /></div>
				) : error ? (
					<div className={styles.error}>{error}</div>
				) : (
					<div className={styles.leaderboardPreview}>
						{top.map(item => (
							<div key={item.id} className={styles.leaderboardItem} style={{ alignItems: 'center', gap: 12 }}>
								<div className={styles.rank}>{item.rank}</div>
								<Medal size={20} color="#16a34a" />
								<div className={styles.name}>{item.name}</div>
								<div className={styles.points}>{item.points} pts</div>
							</div>
						))}
					</div>
				)}
				<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
					<button className={styles.button} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
					<div>Page {page} / {totalPages}</div>
					<button className={styles.button} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Keep Climbing</div>
				<p>Earn more points by scanning items and completing challenges.</p>
				<Link className={styles.cardLink} href="/user-employee/user/scan-waste">Go to Scan Waste →</Link>
			</div>
		</div>
	);
}

export default UserLeaderboardPage;
