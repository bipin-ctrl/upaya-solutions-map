import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockIssues, categoryConfig, statusConfig } from '@/data/issues';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Layers, ExternalLink } from 'lucide-react';

const MapSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredIssues = selectedCategory
    ? mockIssues.filter(issue => issue.category === selectedCategory)
    : mockIssues;

  const categories = Object.entries(categoryConfig);

  // Kathmandu center for the map
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=85.2500%2C27.6500%2C85.4000%2C27.7800&layer=mapnik&marker=27.7172%2C85.3240";

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
            Explore reported issues across Kathmandu Valley. View locations and track resolution progress.
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

        {/* Map and Issues Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* OpenStreetMap Embed */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl border border-border">
            {/* Issue Count Badge */}
            <div className="absolute top-4 left-4 z-10 glass-card px-4 py-2 rounded-full">
              <p className="text-sm font-medium">
                <span className="text-primary font-bold">{filteredIssues.length}</span> issues in Kathmandu Valley
              </p>
            </div>

            <iframe
              title="Kathmandu Map"
              src={mapUrl}
              style={{ border: 0, width: '100%', height: '500px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* View Full Map Link */}
            <a
              href="https://www.openstreetmap.org/#map=13/27.7172/85.3240"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 glass-card px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-background/90 transition-colors"
            >
              View Full Map
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Issue List Sidebar */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            <h3 className="font-semibold text-lg sticky top-0 bg-secondary/30 py-2 backdrop-blur-sm">
              Issue Locations
            </h3>
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover-lift cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                        issue.category === 'road' ? 'bg-orange-500/20' :
                        issue.category === 'garbage' ? 'bg-emerald-500/20' :
                        issue.category === 'water' ? 'bg-blue-500/20' :
                        issue.category === 'electricity' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        {categoryConfig[issue.category].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {issue.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {issue.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-muted-foreground">
                            {issue.coordinates[0].toFixed(4)}°N, {issue.coordinates[1].toFixed(4)}°E
                          </span>
                          <Badge variant={issue.status} className="text-xs">
                            {statusConfig[issue.status].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
