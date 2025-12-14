import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronRight, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockIssues, categoryConfig, statusConfig, type Issue, type IssueStatus } from '@/data/issues';
import { formatDistanceToNow } from 'date-fns';

const IssuesFeed = () => {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = mockIssues
    .filter(issue => statusFilter === 'all' || issue.status === statusFilter)
    .filter(issue => 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section id="issues" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Clock className="w-3 h-3 mr-1" />
            Live Feed
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recent Issue Reports
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track the latest reported issues and their resolution status in real-time.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search issues by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="gap-1"
            >
              <Filter className="w-4 h-4" />
              All
            </Button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={statusFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(key as IssueStatus)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Issues List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredIssues.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}

        {/* Load More */}
        {filteredIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button variant="outline" size="lg" className="gap-2">
              Load More Issues
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const IssueCard = ({ issue }: { issue: Issue }) => {
  const categoryData = categoryConfig[issue.category];

  return (
    <Card glass className="hover-lift group cursor-pointer overflow-hidden">
      <CardContent className="p-0">
        {/* Category Header */}
        <div className={`p-4 bg-gradient-to-r ${
          issue.category === 'road' ? 'from-orange-500/10 to-orange-500/5' :
          issue.category === 'garbage' ? 'from-emerald-500/10 to-emerald-500/5' :
          issue.category === 'water' ? 'from-blue-500/10 to-blue-500/5' :
          issue.category === 'electricity' ? 'from-yellow-500/10 to-yellow-500/5' :
          'from-red-500/10 to-red-500/5'
        } border-b border-border/50`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{categoryData.icon}</span>
              <span className="text-sm font-medium">{categoryData.label}</span>
            </div>
            <Badge variant={issue.status}>
              {statusConfig[issue.status].label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {issue.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {issue.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 px-2">
              View Details
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssuesFeed;
