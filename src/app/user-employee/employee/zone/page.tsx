'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Route,
  Target,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Filter
} from 'lucide-react';
import styles from './zone.module.css';

interface ZoneData {
  id: string;
  name: string;
  description: string;
  area: number; // in square km
  population: number;
  wasteCollectionPoints: number;
  routes: Route[];
  hotspots: Hotspot[];
  collectionSchedule: Schedule[];
  status: 'active' | 'maintenance' | 'inactive';
}

interface Route {
  id: string;
  name: string;
  description: string;
  waypoints: Waypoint[];
  distance: number; // in km
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'maintenance' | 'closed';
  color: string;
}

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'collection_point' | 'landmark' | 'checkpoint';
  description?: string;
}

interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'high_waste' | 'problem_area' | 'equipment' | 'landmark';
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved';
}

interface Schedule {
  day: string;
  time: string;
  route: string;
  assignedEmployee: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export default function EmployeeZonePage() {
  const router = useRouter();
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchZoneData();
  }, []);

  const fetchZoneData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockZoneData: ZoneData = {
        id: 'ZONE_A',
        name: 'Downtown Zone',
        description: 'Central business district with high-density commercial and residential areas',
        area: 2.5,
        population: 15000,
        wasteCollectionPoints: 45,
        routes: [
          {
            id: 'R001',
            name: 'Main Street Route',
            description: 'Primary collection route covering Main Street and surrounding areas',
            waypoints: [
              { id: 'W001', name: 'City Hall', lat: 40.7128, lng: -74.0060, type: 'landmark', description: 'Starting point' },
              { id: 'W002', name: 'Collection Point A', lat: 40.7138, lng: -74.0070, type: 'collection_point', description: 'High-volume collection point' },
              { id: 'W003', name: 'Collection Point B', lat: 40.7148, lng: -74.0080, type: 'collection_point', description: 'Residential collection point' },
              { id: 'W004', name: 'Checkpoint 1', lat: 40.7158, lng: -74.0090, type: 'checkpoint', description: 'Progress checkpoint' },
              { id: 'W005', name: 'Collection Point C', lat: 40.7168, lng: -74.0100, type: 'collection_point', description: 'Commercial collection point' }
            ],
            distance: 3.2,
            estimatedTime: 120,
            difficulty: 'medium',
            status: 'active',
            color: '#3b82f6'
          },
          {
            id: 'R002',
            name: 'Residential Circuit',
            description: 'Residential area collection route',
            waypoints: [
              { id: 'W006', name: 'Residential Start', lat: 40.7178, lng: -74.0110, type: 'landmark', description: 'Residential area entrance' },
              { id: 'W007', name: 'Collection Point D', lat: 40.7188, lng: -74.0120, type: 'collection_point', description: 'Apartment complex collection' },
              { id: 'W008', name: 'Collection Point E', lat: 40.7198, lng: -74.0130, type: 'collection_point', description: 'Single-family homes' }
            ],
            distance: 2.1,
            estimatedTime: 90,
            difficulty: 'easy',
            status: 'active',
            color: '#10b981'
          },
          {
            id: 'R003',
            name: 'Commercial District',
            description: 'High-density commercial area route',
            waypoints: [
              { id: 'W009', name: 'Commercial Start', lat: 40.7208, lng: -74.0140, type: 'landmark', description: 'Commercial district entrance' },
              { id: 'W010', name: 'Collection Point F', lat: 40.7218, lng: -74.0150, type: 'collection_point', description: 'Shopping center collection' },
              { id: 'W011', name: 'Collection Point G', lat: 40.7228, lng: -74.0160, type: 'collection_point', description: 'Office building collection' }
            ],
            distance: 1.8,
            estimatedTime: 75,
            difficulty: 'hard',
            status: 'maintenance',
            color: '#f59e0b'
          }
        ],
        hotspots: [
          {
            id: 'H001',
            name: 'High Waste Area - Main Square',
            lat: 40.7138,
            lng: -74.0070,
            type: 'high_waste',
            description: 'Frequently overflowing collection point requiring extra attention',
            priority: 'high',
            status: 'active'
          },
          {
            id: 'H002',
            name: 'Equipment Issue - Sorting Station',
            lat: 40.7148,
            lng: -74.0080,
            type: 'equipment',
            description: 'Sorting machine requires maintenance',
            priority: 'medium',
            status: 'active'
          },
          {
            id: 'H003',
            name: 'Problem Area - Narrow Street',
            lat: 40.7158,
            lng: -74.0090,
            type: 'problem_area',
            description: 'Difficult access for collection vehicles',
            priority: 'low',
            status: 'active'
          }
        ],
        collectionSchedule: [
          { day: 'Monday', time: '08:00', route: 'Main Street Route', assignedEmployee: 'John Doe', status: 'completed' },
          { day: 'Monday', time: '10:00', route: 'Residential Circuit', assignedEmployee: 'Jane Smith', status: 'completed' },
          { day: 'Tuesday', time: '08:00', route: 'Commercial District', assignedEmployee: 'Mike Johnson', status: 'scheduled' },
          { day: 'Tuesday', time: '14:00', route: 'Main Street Route', assignedEmployee: 'Sarah Wilson', status: 'scheduled' },
          { day: 'Wednesday', time: '08:00', route: 'Residential Circuit', assignedEmployee: 'Tom Brown', status: 'scheduled' }
        ],
        status: 'active'
      };
      
      setZoneData(mockZoneData);
    } catch (err) {
      setError('Failed to load zone data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'maintenance':
        return '#f59e0b';
      case 'closed':
      case 'inactive':
        return '#ef4444';
      case 'scheduled':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getHotspotIcon = (type: string) => {
    switch (type) {
      case 'high_waste':
        return '🗑️';
      case 'problem_area':
        return '⚠️';
      case 'equipment':
        return '🔧';
      case 'landmark':
        return '📍';
      default:
        return '📍';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading zone data...</p>
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

  if (!zoneData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>No zone data available</div>
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
            <MapPin className={styles.titleIcon} />
            My Zone: {zoneData.name}
          </h1>
          <p className={styles.subtitle}>{zoneData.description}</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.zoneStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{zoneData.area}</span>
              <span className={styles.statLabel}>km²</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{zoneData.population.toLocaleString()}</span>
              <span className={styles.statLabel}>Population</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{zoneData.wasteCollectionPoints}</span>
              <span className={styles.statLabel}>Collection Points</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{zoneData.routes.length}</span>
              <span className={styles.statLabel}>Routes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className={styles.mapControls}>
        <div className={styles.controlGroup}>
          <h3 className={styles.controlTitle}>Map View</h3>
          <div className={styles.viewButtons}>
            <button
              className={`${styles.viewButton} ${mapView === 'street' ? styles.activeView : ''}`}
              onClick={() => setMapView('street')}
            >
              Street
            </button>
            <button
              className={`${styles.viewButton} ${mapView === 'satellite' ? styles.activeView : ''}`}
              onClick={() => setMapView('satellite')}
            >
              Satellite
            </button>
            <button
              className={`${styles.viewButton} ${mapView === 'hybrid' ? styles.activeView : ''}`}
              onClick={() => setMapView('hybrid')}
            >
              Hybrid
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <h3 className={styles.controlTitle}>Layers</h3>
          <div className={styles.layerControls}>
            <label className={styles.layerToggle}>
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={(e) => setShowRoutes(e.target.checked)}
              />
              <span className={styles.toggleLabel}>Routes</span>
            </label>
            <label className={styles.layerToggle}>
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
              />
              <span className={styles.toggleLabel}>Hotspots</span>
            </label>
            <label className={styles.layerToggle}>
              <input
                type="checkbox"
                checked={showSchedule}
                onChange={(e) => setShowSchedule(e.target.checked)}
              />
              <span className={styles.toggleLabel}>Schedule</span>
            </label>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <h3 className={styles.controlTitle}>Map Tools</h3>
          <div className={styles.toolButtons}>
            <button className={styles.toolButton}>
              <ZoomIn className={styles.toolIcon} />
            </button>
            <button className={styles.toolButton}>
              <ZoomOut className={styles.toolIcon} />
            </button>
            <button className={styles.toolButton}>
              <RotateCcw className={styles.toolIcon} />
            </button>
            <button className={styles.toolButton}>
              <Layers className={styles.toolIcon} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.mapContainer}>
            <div className={styles.mapPlaceholder}>
              <MapPin className={styles.mapIcon} />
              <h3>Interactive Map</h3>
              <p>Map integration would be implemented here using Google Maps, Mapbox, or similar service</p>
              <div className={styles.mapInfo}>
                <div className={styles.mapInfoItem}>
                  <strong>Current View:</strong> {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
                </div>
                <div className={styles.mapInfoItem}>
                  <strong>Routes Visible:</strong> {showRoutes ? 'Yes' : 'No'}
                </div>
                <div className={styles.mapInfoItem}>
                  <strong>Hotspots Visible:</strong> {showHotspots ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Routes */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Route className={styles.sectionIcon} />
                Collection Routes
              </h2>
              <span className={styles.sectionCount}>{zoneData.routes.length}</span>
            </div>
            
            <div className={styles.routesList}>
              {zoneData.routes.map((route) => (
                <div
                  key={route.id}
                  className={`${styles.routeCard} ${selectedRoute?.id === route.id ? styles.selectedRoute : ''}`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className={styles.routeHeader}>
                    <h3 className={styles.routeName}>{route.name}</h3>
                    <div className={styles.routeBadges}>
                      <span 
                        className={styles.difficultyBadge}
                        style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
                      >
                        {route.difficulty}
                      </span>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(route.status) }}
                      >
                        {route.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className={styles.routeDescription}>{route.description}</p>
                  
                  <div className={styles.routeStats}>
                    <div className={styles.routeStat}>
                      <Navigation className={styles.statIcon} />
                      <span>{route.distance} km</span>
                    </div>
                    <div className={styles.routeStat}>
                      <Clock className={styles.statIcon} />
                      <span>{route.estimatedTime} min</span>
                    </div>
                    <div className={styles.routeStat}>
                      <Target className={styles.statIcon} />
                      <span>{route.waypoints.length} stops</span>
                    </div>
                  </div>
                  
                  <div className={styles.routeColor} style={{ backgroundColor: route.color }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspots */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <AlertTriangle className={styles.sectionIcon} />
                Hotspots
              </h2>
              <span className={styles.sectionCount}>{zoneData.hotspots.length}</span>
            </div>
            
            <div className={styles.hotspotsList}>
              {zoneData.hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className={`${styles.hotspotCard} ${selectedHotspot?.id === hotspot.id ? styles.selectedHotspot : ''}`}
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  <div className={styles.hotspotHeader}>
                    <div className={styles.hotspotIcon}>
                      {getHotspotIcon(hotspot.type)}
                    </div>
                    <div className={styles.hotspotInfo}>
                      <h3 className={styles.hotspotName}>{hotspot.name}</h3>
                      <span 
                        className={styles.priorityBadge}
                        style={{ backgroundColor: getPriorityColor(hotspot.priority) }}
                      >
                        {hotspot.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className={styles.hotspotDescription}>{hotspot.description}</p>
                  
                  <div className={styles.hotspotType}>
                    <strong>Type:</strong> {hotspot.type.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collection Schedule */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Clock className={styles.sectionIcon} />
                Collection Schedule
              </h2>
            </div>
            
            <div className={styles.scheduleList}>
              {zoneData.collectionSchedule.map((schedule, index) => (
                <div key={index} className={styles.scheduleItem}>
                  <div className={styles.scheduleHeader}>
                    <div className={styles.scheduleDay}>{schedule.day}</div>
                    <div className={styles.scheduleTime}>{schedule.time}</div>
                    <span 
                      className={styles.scheduleStatus}
                      style={{ backgroundColor: getStatusColor(schedule.status) }}
                    >
                      {schedule.status}
                    </span>
                  </div>
                  
                  <div className={styles.scheduleDetails}>
                    <div className={styles.scheduleRoute}>
                      <Route className={styles.scheduleIcon} />
                      <span>{schedule.route}</span>
                    </div>
                    <div className={styles.scheduleEmployee}>
                      <Users className={styles.scheduleIcon} />
                      <span>{schedule.assignedEmployee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRoute(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedRoute.name}</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setSelectedRoute(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>Route Information</h3>
                <p>{selectedRoute.description}</p>
                <div className={styles.routeDetails}>
                  <div className={styles.detailItem}>
                    <strong>Distance:</strong> {selectedRoute.distance} km
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Estimated Time:</strong> {selectedRoute.estimatedTime} minutes
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Difficulty:</strong> 
                    <span style={{ color: getDifficultyColor(selectedRoute.difficulty) }}>
                      {selectedRoute.difficulty}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(selectedRoute.status) }}>
                      {selectedRoute.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.modalSection}>
                <h3>Waypoints ({selectedRoute.waypoints.length})</h3>
                <div className={styles.waypointsList}>
                  {selectedRoute.waypoints.map((waypoint, index) => (
                    <div key={waypoint.id} className={styles.waypointItem}>
                      <div className={styles.waypointNumber}>{index + 1}</div>
                      <div className={styles.waypointInfo}>
                        <h4 className={styles.waypointName}>{waypoint.name}</h4>
                        <p className={styles.waypointType}>{waypoint.type.replace('_', ' ')}</p>
                        {waypoint.description && (
                          <p className={styles.waypointDescription}>{waypoint.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalButton}
                onClick={() => setSelectedRoute(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotspot Details Modal */}
      {selectedHotspot && (
        <div className={styles.modalOverlay} onClick={() => setSelectedHotspot(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedHotspot.name}</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setSelectedHotspot(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>Hotspot Information</h3>
                <p>{selectedHotspot.description}</p>
                <div className={styles.hotspotDetails}>
                  <div className={styles.detailItem}>
                    <strong>Type:</strong> {selectedHotspot.type.replace('_', ' ')}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Priority:</strong> 
                    <span style={{ color: getPriorityColor(selectedHotspot.priority) }}>
                      {selectedHotspot.priority}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(selectedHotspot.status) }}>
                      {selectedHotspot.status}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Coordinates:</strong> {selectedHotspot.lat.toFixed(4)}, {selectedHotspot.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalButton}
                onClick={() => setSelectedHotspot(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
