import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { proposalsApi, Proposal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Trash2, Loader2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPanel() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive'
      });
      navigate('/dashboard');
      return;
    }

    loadProposals();
  }, [user]);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await proposalsApi.getAll();
      setProposals(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load proposals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await proposalsApi.updateStatus(id, status);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      toast({
        title: 'Status updated',
        description: `Proposal ${status}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      await proposalsApi.delete(id);
      setProposals(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Proposal deleted',
        description: 'The proposal has been removed'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete proposal',
        variant: 'destructive'
      });
    }
  };

  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    approved: 'bg-success text-success-foreground',
    rejected: 'bg-destructive text-destructive-foreground'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-foreground">Admin Panel</h1>
          <p className="text-lg text-muted-foreground">
            Manage proposals and moderate community content
          </p>
        </motion.div>

        <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{proposal.title}</div>
                  </TableCell>
                  <TableCell>{proposal.creatorName}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[proposal.status]}>
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-success">{proposal.upvotes}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive">{proposal.downvotes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/proposal/${proposal.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {proposal.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(proposal.id, 'approved')}
                          className="hover:bg-success/10 hover:text-success"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {proposal.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(proposal.id, 'rejected')}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(proposal.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {proposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No proposals to manage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
