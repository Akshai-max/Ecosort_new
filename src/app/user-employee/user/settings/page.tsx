"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard/dashboard.module.css";
import { Profiles, SettingsApi } from "@/services/api";

export default function UserSettingsPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [form, setForm] = useState<any>({
		name: '', email: '', phone: '', avatar: '', zone: '', language: 'English',
		privacy: { leaderboardVisible: true },
		notifications: { push: true, email: true, promos: false, system: true },
		preferences: { autoTagging: true, units: 'metric', accessibility: false },
	});

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setLoading(true);
				const { user } = await Profiles.user();
				const res = await SettingsApi.get(user._id || user.id);
				if (ignore) return;
				setUserId(user._id || user.id);
				setForm({ ...form, ...(res.settings || {}) });
			} catch (e: any) {
				if (!ignore) setError(e.message || 'Failed to load settings');
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true; };
	}, []);

	async function save() {
		if (!userId) return;
		setSaving(true);
		setMessage(null);
		try {
			await SettingsApi.update(userId, form);
			setMessage('Saved successfully');
		} catch (e: any) {
			setError(e.message || 'Save failed');
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Profile</div>
				{loading ? <div className={styles.loading}><div className={styles.loader} /></div> : (
					<div className={styles.cardContent}>
						<div className={styles.infoRow}><div className={styles.infoLabel}>Name</div><input className={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
						<div className={styles.infoRow}><div className={styles.infoLabel}>Email</div><input className={styles.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
						<div className={styles.infoRow}><div className={styles.infoLabel}>Phone</div><input className={styles.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
						<div className={styles.infoRow}><div className={styles.infoLabel}>Zone</div><input className={styles.input} value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} /></div>
						<div className={styles.infoRow}><div className={styles.infoLabel}>Language</div>
							<select className={styles.select} value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
								<option>Tamil</option>
								<option>English</option>
							</select>
						</div>
					</div>
				)}
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Security</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>2FA</div><input type="checkbox" checked={!!form.twofa} onChange={e => setForm({ ...form, twofa: e.target.checked })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Sessions</div><div>Manage active sessions (coming soon)</div></div>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Privacy</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Leaderboard</div><label><input type="checkbox" checked={!!form.privacy?.leaderboardVisible} onChange={e => setForm({ ...form, privacy: { ...form.privacy, leaderboardVisible: e.target.checked } })} /> Visible</label></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Delete</div><button className={styles.button} disabled>Request account deletion</button></div>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Notifications</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Push</div><input type="checkbox" checked={!!form.notifications?.push} onChange={e => setForm({ ...form, notifications: { ...form.notifications, push: e.target.checked } })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Email</div><input type="checkbox" checked={!!form.notifications?.email} onChange={e => setForm({ ...form, notifications: { ...form.notifications, email: e.target.checked } })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Promos</div><input type="checkbox" checked={!!form.notifications?.promos} onChange={e => setForm({ ...form, notifications: { ...form.notifications, promos: e.target.checked } })} /></div>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>App Preferences</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Auto-tag</div><input type="checkbox" checked={!!form.preferences?.autoTagging} onChange={e => setForm({ ...form, preferences: { ...form.preferences, autoTagging: e.target.checked } })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Units</div>
						<select value={form.preferences?.units} onChange={e => setForm({ ...form, preferences: { ...form.preferences, units: e.target.value } })}>
							<option value="metric">Metric</option>
							<option value="imperial">Imperial</option>
						</select>
					</div>
				</div>
			</div>

			{error ? <div className={styles.error}>{error}</div> : null}
			<div className={styles.controlsRow}>
				<button className={styles.button} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
				{message ? <span className={styles.badge}>{message}</span> : null}
			</div>
		</div>
	);
}