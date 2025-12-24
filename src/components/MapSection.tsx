import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockIssues, categoryConfig, statusConfig } from '@/data/issues';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Layers } from 'lucide-react';

// Lazy load the map component to avoid SSR issues
const LeafletMap = ({ issues }: { issues: typeof mockIssues }) => {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of react-leaflet components
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([reactLeaflet, L]) => {
      // Fix for default marker icons
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      
      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        L: L.default
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="h-[500px] w-full bg-secondary/50 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = MapComponents;
  const kathmanduCenter: [number, number] = [27.7172, 85.3240];

  // Create custom marker icon
  const createCategoryIcon = (category: string) => {
    const colors: Record<string, string> = {
      road: '#f97316',
      garbage: '#10b981',
      water: '#3b82f6',
      electricity: '#eab308',
      safety: '#ef4444',
    };
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${colors[category] || '#3b82f6'};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  return (
    <MapContainer
      center={kathmanduCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
      className="z-0 rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={issue.coordinates}
          icon={createCategoryIcon(issue.category)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryConfig[issue.category].icon}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
                  {categoryConfig[issue.category].label}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{issue.title}</h4>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {issue.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  📍 {issue.location.split(',')[0]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-600' :
                  issue.status === 'review' ? 'bg-blue-100 text-blue-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {statusConfig[issue.status].label}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const MapSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredIssues = selectedCategory
    ? mockIssues.filter(issue => issue.category === selectedCategory)
    : mockIssues;

  const categories = Object.entries(categoryConfig);

  return (
    <section id="map" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            Live Issue Map
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visualize Urban Problems
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore reported issues across Kathmandu Valley. Click on markers to view details 
            and track resolution progress.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="gap-2"
          >
            <Layers className="w-4 h-4" />
            All Issues
          </Button>
          {categories.map(([key, config]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="gap-2"
            >
              <span>{config.icon}</span>
              {config.label}
            </Button>
          ))}
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-xl border border-border"
        >
          {/* Issue Count Badge */}
          <div className="absolute top-4 left-4 z-[1000] glass-card px-4 py-2 rounded-full">
            <p className="text-sm font-medium">
              <span className="text-primary font-bold">{filteredIssues.length}</span> issues in Kathmandu Valley
            </p>
          </div>

          {/* Leaflet Map */}
          <LeafletMap issues={filteredIssues} />

          {/* Coordinates Label */}
          <div className="absolute bottom-4 right-4 z-[1000] text-xs text-muted-foreground font-mono bg-background/80 px-2 py-1 rounded">
            27.7172°N, 85.3240°E
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
