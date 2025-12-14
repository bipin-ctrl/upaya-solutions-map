import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStats, categoryConfig, mockIssues } from '@/data/issues';

const StatsSection = () => {
  const stats = getStats();

  const overviewCards = [
    {
      title: 'Total Reported',
      value: stats.total * 125, // Multiplied for demo
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Resolved Issues',
      value: stats.resolved * 50,
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'In Progress',
      value: stats.inReview * 75,
      change: '-3%',
      trend: 'down',
      icon: Activity,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Resolution Rate',
      value: Math.round((stats.resolved / stats.total) * 100),
      suffix: '%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const categoryStats = Object.entries(stats.byCategory).map(([category, count]) => ({
    category,
    config: categoryConfig[category as keyof typeof categoryConfig],
    count: count * 30, // Multiplied for demo
    percentage: Math.round((count / stats.total) * 100),
  }));

  return (
    <section id="stats" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <PieChart className="w-3 h-3 mr-1" />
            Analytics Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Data-Driven Insights
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time analytics helping authorities prioritize and address urban challenges effectively.
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass className="hover-lift h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <Badge
                      variant={card.trend === 'up' ? 'resolved' : 'pending'}
                      className="text-xs"
                    >
                      {card.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {card.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {card.value.toLocaleString()}{card.suffix || ''}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Issues by Category
              </CardTitle>
              <CardDescription>
                Distribution of reported issues across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 w-40">
                      <span className="text-2xl">{item.config.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.config.label}</p>
                        <p className="text-xs text-muted-foreground">{item.config.labelNp}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full rounded-full ${
                            item.category === 'road' ? 'bg-orange-500' :
                            item.category === 'garbage' ? 'bg-emerald-500' :
                            item.category === 'water' ? 'bg-blue-500' :
                            item.category === 'electricity' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <p className="font-bold">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Most Affected Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="text-lg">Most Affected Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Balkhu', 'Thamel', 'New Baneshwor', 'Koteshwor', 'Kalanki'].map((area, index) => (
                  <div key={area} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{area}</span>
                    </div>
                    <Badge variant="outline">{Math.floor(Math.random() * 50 + 20)} issues</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <span className="text-lg">{categoryConfig[issue.category].icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.location}</p>
                    </div>
                    <Badge variant={issue.status} className="shrink-0 text-xs">
                      {issue.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
