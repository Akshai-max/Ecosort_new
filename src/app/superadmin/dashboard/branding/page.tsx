"use client";

import { useState } from "react";
import styles from "@/app/user-employee/user/dashboard/dashboard.module.css";

export default function BrandingPage() {
	const [theme, setTheme] = useState({ primary: '#16a34a', background: '#f9fafb', logo: '/public/ecosort-logo.png' });

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>Branding</div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>Primary</div><input type="color" value={theme.primary} onChange={e => setTheme({ ...theme, primary: e.target.value })} /></div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>Background</div><input type="color" value={theme.background} onChange={e => setTheme({ ...theme, background: e.target.value })} /></div>
				<div className={styles.infoRow}><div className={styles.infoLabel}>Logo</div><input value={theme.logo} onChange={e => setTheme({ ...theme, logo: e.target.value })} /></div>
				<button className={styles.button}>Apply</button>
			</div>
		</div>
	);
}


