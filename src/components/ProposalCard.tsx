import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, User } from 'lucide-react';
import { Proposal } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardProps {
  proposal: Proposal;
  onVote?: (id: string, type: 'up' | 'down') => void;
}

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    approved: 'bg-success text-success-foreground',
    rejected: 'bg-destructive text-destructive-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden shadow-card hover:shadow-hover transition-shadow">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/proposal/${proposal.id}`} className="flex-1">
              <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                {proposal.title}
              </h3>
            </Link>
            <Badge className={statusColors[proposal.status]}>
              {proposal.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{proposal.creatorName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-3">
            {proposal.description}
          </p>
          <Badge variant="outline" className="text-xs">
            {proposal.category}
          </Badge>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onVote?.(proposal.id, 'up')}
              className="gap-1 hover:bg-success/10 hover:text-success"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="font-semibold">{proposal.upvotes}</span>
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onVote?.(proposal.id, 'down')}
              className="gap-1 hover:bg-destructive/10 hover:text-destructive"
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="font-semibold">{proposal.downvotes}</span>
            </Button>
          </div>

          <Link to={`/proposal/${proposal.id}`}>
            <Button size="sm" variant="ghost" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{proposal.comments?.length || 0}</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
