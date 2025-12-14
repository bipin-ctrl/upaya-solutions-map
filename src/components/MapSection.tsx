import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockIssues, categoryConfig, statusConfig, type Issue } from '@/data/issues';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Filter, Layers, ZoomIn, ZoomOut } from 'lucide-react';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for each category
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
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${colors[category] || '#6b7280'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">
          ${categoryConfig[category as keyof typeof categoryConfig]?.icon || '📍'}
        </span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Map Controls Component
const MapControls = () => {
  const map = useMap();

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-white/90 transition-colors"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-white/90 transition-colors"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
    </div>
  );
};

const MapSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
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

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-xl border border-border"
          style={{ height: '600px' }}
        >
          <MapContainer
            center={[27.7172, 85.3240]} // Kathmandu coordinates
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredIssues.map((issue) => (
              <Marker
                key={issue.id}
                position={issue.coordinates}
                icon={createCategoryIcon(issue.category)}
                eventHandlers={{
                  click: () => setSelectedIssue(issue),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-tight">{issue.title}</h3>
                      <Badge variant={issue.status} className="shrink-0 text-xs">
                        {statusConfig[issue.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={issue.category as any} className="text-xs">
                        {categoryConfig[issue.category].icon} {categoryConfig[issue.category].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      📍 {issue.location}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MapControls />
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] glass-card p-4 rounded-xl max-w-[200px]">
            <p className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Legend
            </p>
            <div className="space-y-1">
              {categories.slice(0, 3).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span>{config.icon}</span>
                  <span className="text-muted-foreground">{config.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Count Badge */}
          <div className="absolute top-4 left-4 z-[1000] glass-card px-4 py-2 rounded-full">
            <p className="text-sm font-medium">
              <span className="text-primary font-bold">{filteredIssues.length}</span> issues displayed
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
