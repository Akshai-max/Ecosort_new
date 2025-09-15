'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin
} from 'lucide-react';
import styles from './ZoneManagement.module.css';

interface Zone {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'mixed';
  employeesAssigned: number;
  totalCapacity: number;
  currentWaste: number;
  status: 'active' | 'inactive' | 'maintenance';
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  lastUpdated: string;
}

interface ZoneManagementProps {
  managerId?: string;
}

export default function ZoneManagement({ managerId }: ZoneManagementProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'residential' as Zone['type'],
    totalCapacity: 0,
    coordinates: { lat: 0, lng: 0 }
  });

  useEffect(() => {
    fetchZones();
  }, [managerId]);

  const fetchZones = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/zones/${managerId}`);
      // const data = await response.json();
      
      // Mock data
      setZones([
        {
          id: 'Z001',
          name: 'Downtown Residential',
          type: 'residential',
          employeesAssigned: 5,
          totalCapacity: 1000,
          currentWaste: 750,
          status: 'active',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          createdAt: '2024-01-01',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'Z002',
          name: 'Business District',
          type: 'commercial',
          employeesAssigned: 8,
          totalCapacity: 2000,
          currentWaste: 1200,
          status: 'active',
          coordinates: { lat: 40.7589, lng: -73.9851 },
          createdAt: '2024-01-02',
          lastUpdated: '2024-01-14'
        },
        {
          id: 'Z003',
          name: 'Industrial Park',
          type: 'industrial',
          employeesAssigned: 12,
          totalCapacity: 5000,
          currentWaste: 3200,
          status: 'active',
          coordinates: { lat: 40.6782, lng: -73.9442 },
          createdAt: '2024-01-03',
          lastUpdated: '2024-01-13'
        },
        {
          id: 'Z004',
          name: 'Mixed Use Area',
          type: 'mixed',
          employeesAssigned: 6,
          totalCapacity: 1500,
          currentWaste: 900,
          status: 'maintenance',
          coordinates: { lat: 40.7505, lng: -73.9934 },
          createdAt: '2024-01-04',
          lastUpdated: '2024-01-12'
        }
      ]);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/zones', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, managerId })
      // });
      
      const newZone: Zone = {
        id: `Z${String(zones.length + 1).padStart(3, '0')}`,
        name: formData.name,
        type: formData.type,
        employeesAssigned: 0,
        totalCapacity: formData.totalCapacity,
        currentWaste: 0,
        status: 'active',
        coordinates: formData.coordinates,
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setZones([...zones, newZone]);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating zone:', error);
    }
  };

  const handleEditZone = async (zone: Zone) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/zones/${zone.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setZones(zones.map(z => 
        z.id === zone.id 
          ? { ...z, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : z
      ));
      setEditingZone(null);
      resetForm();
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return;
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/zones/${zoneId}`, {
      //   method: 'DELETE'
      // });
      
      setZones(zones.filter(z => z.id !== zoneId));
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'residential',
      totalCapacity: 0,
      coordinates: { lat: 0, lng: 0 }
    });
  };

  const getStatusColor = (status: Zone['status']) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'maintenance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getTypeColor = (type: Zone['type']) => {
    switch (type) {
      case 'residential':
        return '#3b82f6';
      case 'commercial':
        return '#8b5cf6';
      case 'industrial':
        return '#f59e0b';
      case 'mixed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading zones...</p>
      </div>
    );
  }

  return (
    <div className={styles.zoneManagement}>
      <div className={styles.header}>
        <h2 className={styles.title}>Zone & Location Management</h2>
        <button 
          className={styles.createButton}
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className={styles.buttonIcon} />
          Create New Zone
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingZone) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingZone ? 'Edit Zone' : 'Create New Zone'}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingZone(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={editingZone ? () => handleEditZone(editingZone) : handleCreateZone}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Zone Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Zone Type</label>
                  <select
                    className={styles.select}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Zone['type'] })}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Total Capacity (kg)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className={styles.input}
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordinates: { ...formData.coordinates, lat: Number(e.target.value) }
                    })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className={styles.input}
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordinates: { ...formData.coordinates, lng: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingZone(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingZone ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zones Table */}
      <div className={styles.zonesTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Zone ID</div>
          <div className={styles.tableCell}>Name</div>
          <div className={styles.tableCell}>Type</div>
          <div className={styles.tableCell}>Employees</div>
          <div className={styles.tableCell}>Capacity</div>
          <div className={styles.tableCell}>Status</div>
          <div className={styles.tableCell}>Actions</div>
        </div>

        {zones.map((zone) => (
          <div key={zone.id} className={styles.tableRow}>
            <div className={styles.tableCell}>{zone.id}</div>
            <div className={styles.tableCell}>
              <div className={styles.zoneName}>{zone.name}</div>
              {zone.coordinates && (
                <div className={styles.coordinates}>
                  {zone.coordinates.lat.toFixed(4)}, {zone.coordinates.lng.toFixed(4)}
                </div>
              )}
            </div>
            <div className={styles.tableCell}>
              <span 
                className={styles.typeBadge}
                style={{ backgroundColor: getTypeColor(zone.type) }}
              >
                {zone.type}
              </span>
            </div>
            <div className={styles.tableCell}>{zone.employeesAssigned}</div>
            <div className={styles.tableCell}>
              <div className={styles.capacityInfo}>
                <div className={styles.capacityBar}>
                  <div 
                    className={styles.capacityFill}
                    style={{ width: `${(zone.currentWaste / zone.totalCapacity) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.capacityText}>
                  {zone.currentWaste} / {zone.totalCapacity} kg
                </div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(zone.status) }}
              >
                {zone.status}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                <button 
                  className={styles.editButton}
                  onClick={() => {
                    setEditingZone(zone);
                    setFormData({
                      name: zone.name,
                      type: zone.type,
                      totalCapacity: zone.totalCapacity,
                      coordinates: zone.coordinates || { lat: 0, lng: 0 }
                    });
                  }}
                >
                  <Edit className={styles.buttonIcon} />
                  Edit
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteZone(zone.id)}
                >
                  <Trash2 className={styles.buttonIcon} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Map Placeholder */}
      <div className={styles.mapSection}>
        <h3 className={styles.mapTitle}>Zone Locations</h3>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapIcon}>
            <MapPin className={styles.mapIconSvg} />
          </div>
          <p>Interactive map showing zone locations</p>
          <p className={styles.mapNote}>
            {zones.length} zones configured
          </p>
        </div>
      </div>
    </div>
  );
}
