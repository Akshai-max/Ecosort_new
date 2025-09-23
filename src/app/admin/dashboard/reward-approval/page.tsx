"use client";

import { useEffect, useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

type PendingReward = { id: string; userName: string; rewardTitle: string; points: number; requestedAt: string };

export default function AdminRewardApprovalPage() {
	const [list, setList] = useState<PendingReward[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		// Mock queue; integrate with backend when available
		setTimeout(() => {
			setList([
				{ id: 'p1', userName: 'Priya', rewardTitle: 'Eco Tote Bag', points: 500, requestedAt: new Date().toISOString() },
				{ id: 'p2', userName: 'Arun', rewardTitle: 'Coffee Voucher', points: 300, requestedAt: new Date().toISOString() },
			]);
			setLoading(false);
		}, 300);
	}, []);

	function approve(id: string) {
		setList(prev => prev.filter(x => x.id !== id));
	}

	function reject(id: string) {
		setList(prev => prev.filter(x => x.id !== id));
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Reward Approval Queue</div>
				{loading ? <div className={styles.loading}><div className={styles.loader}/></div> : list.length === 0 ? <div className={styles.emptyState}>No pending rewards</div> : (
					<div className={styles.rewardsPreview}>
						{list.map(item => (
							<div key={item.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{item.userName} → {item.rewardTitle}</div>
								<div className={styles.rewardPoints}>{item.points} pts</div>
								<button className={styles.button} onClick={() => approve(item.id)}>Approve</button>
								<button className={styles.button} onClick={() => reject(item.id)} style={{ background:'#dc2626' }}>Reject</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
