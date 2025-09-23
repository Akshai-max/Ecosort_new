"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard/dashboard.module.css";
import { SupportApi } from "@/services/api";

export default function UserSupportPage() {
	const [faq, setFaq] = useState<Array<{ id: string; q: string; a: string; category?: string }>>([]);
	const [query, setQuery] = useState("");
	const [tickets, setTickets] = useState<any[]>([]);
	const [creating, setCreating] = useState(false);
	const [createdId, setCreatedId] = useState<string | null>(null);
	const [ticketForm, setTicketForm] = useState({ subject: '', category: 'scan', description: '', zone: '' });
	const [messageMap, setMessageMap] = useState<Record<string, any[]>>({});
	const [activeTicket, setActiveTicket] = useState<string | null>(null);
	const [chatInput, setChatInput] = useState("");

	useEffect(() => {
		let ignore = false;
		(async () => {
			const [{ faq }, { tickets }] = await Promise.all([SupportApi.faq(), SupportApi.tickets.list()]);
			if (ignore) return;
			setFaq(faq);
			setTickets(tickets);
		})();
		return () => { ignore = true; };
	}, []);

	const filteredFaq = faq.filter(item => (item.q + ' ' + item.a).toLowerCase().includes(query.toLowerCase()));

	async function createTicket() {
		setCreating(true);
		try {
			const res = await SupportApi.tickets.create(ticketForm as any);
			setCreatedId(res.ticketId);
			const list = await SupportApi.tickets.list();
			setTickets(list.tickets);
			setTicketForm({ subject: '', category: 'scan', description: '', zone: '' });
		} finally {
			setCreating(false);
		}
	}

	async function openChat(ticketId: string) {
		setActiveTicket(ticketId);
		const res = await SupportApi.messages.list(ticketId);
		setMessageMap(prev => ({ ...prev, [ticketId]: res.messages }));
	}

	async function sendMessage() {
		if (!activeTicket || !chatInput) return;
		await SupportApi.messages.send(activeTicket, { text: chatInput });
		setChatInput("");
		openChat(activeTicket);
	}

	return (
		<div className={styles.content}>
			<div className={styles.card}>
				<div className={styles.cardTitle}>FAQ</div>
				<input className={styles.input} placeholder="Search help..." value={query} onChange={e => setQuery(e.target.value)} />
				<div className={styles.leaderboardPreview}>
					{filteredFaq.map(item => (
						<div key={item.id} className={styles.rewardItem}>
							<div className={styles.rewardName}>{item.q}</div>
							<div>{item.a}</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Raise Ticket</div>
				<div className={styles.cardContent}>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Subject</div><input className={styles.input} value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Category</div>
						<select className={styles.select} value={ticketForm.category} onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}>
							<option value="scan">Scan</option>
							<option value="reward">Reward</option>
							<option value="account">Account</option>
							<option value="feedback">Feedback</option>
						</select>
					</div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Zone</div><input className={styles.input} value={ticketForm.zone} onChange={e => setTicketForm({ ...ticketForm, zone: e.target.value })} /></div>
					<div className={styles.infoRow}><div className={styles.infoLabel}>Description</div><textarea className={styles.input} rows={4} value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} />
					</div>
					<button className={styles.button} onClick={createTicket} disabled={creating}>{creating ? 'Submitting…' : 'Submit Ticket'}</button>
					{createdId ? <div className={styles.badge}>Ticket created: {createdId}</div> : null}
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>My Tickets</div>
				{tickets.length === 0 ? <div className={styles.emptyState}>No tickets yet.</div> : (
					<div className={styles.rewardsPreview}>
						{tickets.map(t => (
							<div key={t.id} className={styles.rewardItem}>
								<div className={styles.rewardName}>{t.subject} · {t.category}</div>
								<div>{t.status}</div>
								<button className={styles.button} onClick={() => openChat(t.id)}>Open</button>
							</div>
						))}
					</div>
				)}
			</div>

			{activeTicket ? (
				<div className={styles.card}>
					<div className={styles.cardTitle}>Ticket Chat</div>
					<div className={styles.rewardsPreview}>
						{(messageMap[activeTicket] || []).map(m => (
							<div key={m.id} className={styles.activityItem}>
								<div className={styles.activityDetails}>{m.text}</div>
								<div className={styles.activityTime}>{new Date(m.at).toLocaleString()}</div>
							</div>
						))}
						<div className={styles.controlsRow}>
							<input className={styles.input} style={{ flex: 1 }} value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message" />
							<button className={styles.button} onClick={sendMessage}>Send</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}