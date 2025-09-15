'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  User,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import styles from './support.module.css';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'schedule' | 'equipment' | 'general' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  sender: string;
  senderType: 'employee' | 'manager' | 'support';
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export default function EmployeeSupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockTickets: SupportTicket[] = [
        {
          id: 'T001',
          title: 'Equipment malfunction at Station A',
          description: 'The sorting machine at Station A is not working properly. It keeps jamming and making strange noises.',
          category: 'equipment',
          priority: 'high',
          status: 'in_progress',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          assignedTo: 'Technical Support',
          messages: [
            {
              id: 'M001',
              sender: 'John Doe',
              senderType: 'employee',
              message: 'The sorting machine at Station A is not working properly. It keeps jamming and making strange noises.',
              timestamp: '2024-01-15T10:30:00Z'
            },
            {
              id: 'M002',
              sender: 'Technical Support',
              senderType: 'support',
              message: 'Thank you for reporting this issue. We have assigned a technician to investigate. Expected resolution time: 2-4 hours.',
              timestamp: '2024-01-15T11:15:00Z'
            }
          ]
        },
        {
          id: 'T002',
          title: 'Schedule change request',
          description: 'I need to change my collection schedule for next week due to a personal appointment.',
          category: 'schedule',
          priority: 'medium',
          status: 'open',
          createdAt: '2024-01-14T16:00:00Z',
          updatedAt: '2024-01-14T16:00:00Z',
          assignedTo: 'Manager Smith',
          messages: [
            {
              id: 'M003',
              sender: 'John Doe',
              senderType: 'employee',
              message: 'I need to change my collection schedule for next week due to a personal appointment.',
              timestamp: '2024-01-14T16:00:00Z'
            }
          ]
        },
        {
          id: 'T003',
          title: 'App login issues',
          description: 'I am unable to log into the mobile app. It keeps showing an error message.',
          category: 'technical',
          priority: 'medium',
          status: 'resolved',
          createdAt: '2024-01-13T09:20:00Z',
          updatedAt: '2024-01-13T15:45:00Z',
          assignedTo: 'IT Support',
          messages: [
            {
              id: 'M004',
              sender: 'John Doe',
              senderType: 'employee',
              message: 'I am unable to log into the mobile app. It keeps showing an error message.',
              timestamp: '2024-01-13T09:20:00Z'
            },
            {
              id: 'M005',
              sender: 'IT Support',
              senderType: 'support',
              message: 'The issue has been resolved. Please try logging in again. If you continue to experience problems, please contact us.',
              timestamp: '2024-01-13T15:45:00Z'
            }
          ]
        }
      ];

      const mockChatMessages: ChatMessage[] = [
        {
          id: 'C001',
          sender: 'Manager Smith',
          message: 'Good morning! How is your day going?',
          timestamp: '2024-01-15T08:00:00Z',
          isOwn: false
        },
        {
          id: 'C002',
          sender: 'You',
          message: 'Good morning! Everything is going well. Just completed the Main Street route.',
          timestamp: '2024-01-15T08:05:00Z',
          isOwn: true
        },
        {
          id: 'C003',
          sender: 'Manager Smith',
          message: 'Excellent work! I noticed you completed it ahead of schedule.',
          timestamp: '2024-01-15T08:10:00Z',
          isOwn: false
        },
        {
          id: 'C004',
          sender: 'You',
          message: 'Thank you! The route was clear today, which helped a lot.',
          timestamp: '2024-01-15T08:12:00Z',
          isOwn: true
        }
      ];

      setTickets(mockTickets);
      setChatMessages(mockChatMessages);
    } catch (err) {
      setError('Failed to load support data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message: ChatMessage = {
        id: `C${Date.now()}`,
        sender: 'You',
        message: newMessage,
        timestamp: new Date().toISOString(),
        isOwn: true
      };

      setChatMessages(prev => [...prev, message]);
      setNewMessage('');

      // TODO: Send message to backend
      console.log('Message sent:', message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const createTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;

    try {
      const ticket: SupportTicket = {
        id: `T${Date.now()}`,
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `M${Date.now()}`,
            sender: 'John Doe',
            senderType: 'employee',
            message: newTicket.description,
            timestamp: new Date().toISOString()
          }
        ]
      };

      setTickets(prev => [ticket, ...prev]);
      setNewTicket({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });

      // TODO: Create ticket in backend
      console.log('Ticket created:', ticket);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <HelpCircle className={styles.categoryIcon} />;
      case 'schedule':
        return <Calendar className={styles.categoryIcon} />;
      case 'equipment':
        return <AlertTriangle className={styles.categoryIcon} />;
      case 'general':
        return <FileText className={styles.categoryIcon} />;
      case 'urgent':
        return <AlertTriangle className={styles.categoryIcon} />;
      default:
        return <FileText className={styles.categoryIcon} />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    
    return { total, open, inProgress, resolved };
  };

  const stats = getTicketStats();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading support data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <MessageCircle className={styles.titleIcon} />
            Support & Communication
          </h1>
          <p className={styles.subtitle}>Get help and communicate with your team</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <span>support@ecosort.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle className={styles.tabIcon} />
          Live Chat
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'tickets' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <FileText className={styles.tabIcon} />
          Support Tickets
          {stats.open > 0 && (
            <span className={styles.tabBadge}>{stats.open}</span>
          )}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'faq' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle className={styles.tabIcon} />
          FAQ
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'chat' && (
          <div className={styles.chatSection}>
            <div className={styles.chatHeader}>
              <h2 className={styles.chatTitle}>Live Chat with Manager</h2>
              <div className={styles.chatStatus}>
                <div className={styles.statusIndicator}></div>
                <span>Online</span>
              </div>
            </div>
            
            <div className={styles.chatMessages}>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.isOwn ? styles.ownMessage : styles.otherMessage}`}
                >
                  <div className={styles.messageContent}>
                    <p className={styles.messageText}>{message.message}</p>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.chatInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className={styles.messageInput}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className={styles.sendButton}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className={styles.sendIcon} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className={styles.ticketsSection}>
            <div className={styles.ticketsHeader}>
              <div className={styles.ticketsStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.total}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.open}</span>
                  <span className={styles.statLabel}>Open</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.inProgress}</span>
                  <span className={styles.statLabel}>In Progress</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.resolved}</span>
                  <span className={styles.statLabel}>Resolved</span>
                </div>
              </div>
              
              <button
                className={styles.createTicketButton}
                onClick={() => setActiveTab('tickets')}
              >
                <Plus className={styles.plusIcon} />
                Create Ticket
              </button>
            </div>

            {/* Create Ticket Form */}
            <div className={styles.createTicketForm}>
              <h3 className={styles.formTitle}>Create Support Ticket</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title *</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className={styles.formInput}
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value as any})}
                    className={styles.formSelect}
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="schedule">Schedule</option>
                    <option value="equipment">Equipment</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                    className={styles.formSelect}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className={styles.formTextarea}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                />
              </div>
              
              <div className={styles.formActions}>
                <button
                  className={styles.submitButton}
                  onClick={createTicket}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                >
                  Create Ticket
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setNewTicket({
                    title: '',
                    description: '',
                    category: 'general',
                    priority: 'medium'
                  })}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Tickets List */}
            <div className={styles.ticketsList}>
              {tickets.map((ticket) => (
                <div key={ticket.id} className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketInfo}>
                      <h3 className={styles.ticketTitle}>{ticket.title}</h3>
                      <div className={styles.ticketMeta}>
                        <span className={styles.ticketId}>#{ticket.id}</span>
                        <span className={styles.ticketDate}>{formatDate(ticket.createdAt)}</span>
                        {ticket.assignedTo && (
                          <span className={styles.ticketAssigned}>Assigned to: {ticket.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.ticketBadges}>
                      <span 
                        className={styles.priorityBadge}
                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                      >
                        {ticket.priority}
                      </span>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.ticketBody}>
                    <div className={styles.ticketCategory}>
                      {getCategoryIcon(ticket.category)}
                      <span>{ticket.category}</span>
                    </div>
                    <p className={styles.ticketDescription}>{ticket.description}</p>
                  </div>
                  
                  <div className={styles.ticketFooter}>
                    <div className={styles.ticketMessages}>
                      <span>{ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className={styles.ticketActions}>
                      <button className={styles.viewButton}>View Details</button>
                      <button className={styles.editButton}>
                        <Edit className={styles.actionIcon} />
                      </button>
                      <button className={styles.deleteButton}>
                        <Trash2 className={styles.actionIcon} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className={styles.faqSection}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            
            <div className={styles.faqCategories}>
              <div className={styles.faqCategory}>
                <h3 className={styles.categoryTitle}>General Questions</h3>
                <div className={styles.faqItems}>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>How do I report a broken equipment?</h4>
                    <p className={styles.faqAnswer}>You can report broken equipment through the Scan & Report section or by creating a support ticket with category "Equipment".</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>How do I request a schedule change?</h4>
                    <p className={styles.faqAnswer">Contact your manager through the live chat or create a support ticket with category "Schedule".</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.faqCategory}>
                <h3 className={styles.categoryTitle}>Technical Issues</h3>
                <div className={styles.faqItems}>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>The app is not loading properly</h4>
                    <p className={styles.faqAnswer">Try refreshing the page or clearing your browser cache. If the problem persists, create a technical support ticket.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>I can't scan waste items</h4>
                    <p className={styles.faqAnswer">Make sure your camera permissions are enabled and you have a stable internet connection. Check the troubleshooting guide in the app.</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.faqCategory}>
                <h3 className={styles.categoryTitle}>Performance & Rewards</h3>
                <div className={styles.faqItems}>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>How are points calculated?</h4>
                    <p className={styles.faqAnswer">Points are awarded based on task completion, waste scanning, and issue reporting. Different activities have different point values.</p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>When do I receive rewards?</h4>
                    <p className={styles.faqAnswer">Rewards are processed monthly. You can redeem them through the Performance section once you have enough points.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
