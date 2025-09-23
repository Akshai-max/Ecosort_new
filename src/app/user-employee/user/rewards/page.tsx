"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard/dashboard.module.css";
import { Profiles, RewardsApi } from "@/services/api";

type Reward = { id: string; title: string; description: string; points: number; stock: number; image?: string; category: string };

export default function UserRewardsPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rewards, setRewards] = useState<Reward[]>([]);
	const [category, setCategory] = useState<string>("");
	const [user, setUser] = useState<any>(null);
	const [history, setHistory] = useState<any[]>([]);
	const [redeeming, setRedeeming] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	useEffect(() => {
		let ignore = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const [{ user }, rs] = await Promise.all([
					Profiles.user(),
					RewardsApi.list(category ? { category } : undefined),
				]);
				if (ignore) return;
				setUser(user);
				setRewards(rs.rewards);
				const h = await RewardsApi.history(user._id || user.id);
				if (!ignore) setHistory(h.history || []);
			} catch (e: any) {
				if (!ignore) setError(e.message || "Failed to load rewards");
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		load();
		return () => { ignore = true; };
	}, [category]);

	async function redeem(reward: Reward) {
		if (!user) return;
		if ((user.points ?? 0) < reward.points) {
			setInfo("Insufficient points");
			return;
		}
		setRedeeming(reward.id);
		try {
			const res = await RewardsApi.redeem({ userId: user._id || user.id, rewardId: reward.id, quantity: 1, deliveryOption: reward.category === 'Physical' ? 'delivery' : undefined });
			setInfo(`Redeemed successfully. Order: ${res.orderId}`);
			// Optimistic update
			setHistory(prev => [{ id: res.orderId, rewardTitle: reward.title, points: reward.points, status: 'processing', date: new Date().toISOString() }, ...prev]);
		} catch (e: any) {
			setInfo(e.message || 'Redeem failed');
		} finally {
			setRedeeming(null);
		}
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Available Rewards</div>
				<div className={styles.controlsRow}>
					<select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
						<option value="">All</option>
						<option value="Physical">Physical</option>
						<option value="Vouchers">Vouchers</option>
						<option value="Donations">Donations</option>
					</select>
				</div>
				{loading ? (
					<div className={styles.loading}><div className={styles.loader} /></div>
				) : error ? (
					<div className={styles.error}>{error}</div>
				) : (
					<div className={styles.dashboardGrid}>
						{rewards.map(r => (
							<div key={r.id} className={styles.card}>
								<div className={styles.cardTitle}>{r.title}</div>
								<p>{r.description}</p>
								<p className={styles.rewardPoints}>{r.points} pts · Stock {r.stock}</p>
								<button className={styles.button} disabled={!!redeeming} onClick={() => redeem(r)}>{redeeming === r.id ? 'Processing...' : 'Redeem'}</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>My Redemptions</div>
				{history.length === 0 ? (
					<div className={styles.emptyState}>No redemptions yet.</div>
				) : (
					<div className={styles.rewardsPreview}>
						{history.map(h => (
							<div key={h.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{h.rewardTitle}</div>
								<div className={styles.rewardPoints}>{h.points} pts</div>
								<div>{h.status}</div>
							</div>
						))}
					</div>
				)}
			</div>

			{info ? <div className={styles.card}><div>{info}</div></div> : null}
		</div>
	);
}
