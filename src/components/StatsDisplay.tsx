import { motion } from 'framer-motion';
import { FileText, ThumbsUp, Users } from 'lucide-react';

interface StatsDisplayProps {
  totalProposals: number;
  totalVotes: number;
  totalUsers: number;
}

export function StatsDisplay({ totalProposals, totalVotes, totalUsers }: StatsDisplayProps) {
  const stats = [
    { label: 'Proposals', value: totalProposals, icon: FileText, color: 'text-primary' },
    { label: 'Votes', value: totalVotes.toLocaleString(), icon: ThumbsUp, color: 'text-secondary' },
    { label: 'Users', value: totalUsers, icon: Users, color: 'text-accent' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className={`${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
