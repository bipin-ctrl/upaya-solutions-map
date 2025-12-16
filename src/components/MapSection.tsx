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
            Explore reported issues across Kathmandu Valley. Click on locations to view details 
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

        {/* Map Placeholder with Issue Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Map Background */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border bg-gradient-to-br from-primary/5 via-secondary to-accent/5" style={{ minHeight: '500px' }}>
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }} />
            </div>

            {/* Header Badge */}
            <div className="absolute top-4 left-4 z-10 glass-card px-4 py-2 rounded-full">
              <p className="text-sm font-medium">
                <span className="text-primary font-bold">{filteredIssues.length}</span> issues in Kathmandu Valley
              </p>
            </div>

            {/* Issue Cards Grid */}
            <div className="relative z-10 p-6 pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.slice(0, 6).map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card glass className="hover-lift cursor-pointer group">
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
                            <Badge variant={issue.status} className="shrink-0 text-xs">
                              {statusConfig[issue.status].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {issue.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Interactive Map Link */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <Button variant="hero" size="lg" className="gap-2 shadow-xl">
                <MapPin className="w-5 h-5" />
                View Interactive Map
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Kathmandu Coordinates Label */}
            <div className="absolute bottom-4 right-4 z-10 text-xs text-muted-foreground font-mono">
              27.7172°N, 85.3240°E
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
