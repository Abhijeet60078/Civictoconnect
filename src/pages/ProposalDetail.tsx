import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { proposalsApi, Proposal, Comment } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, ArrowLeft, Loader2, Send, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadProposal();
    }
  }, [id]);

  const loadProposal = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await proposalsApi.getById(id);
      if (data) {
        setProposal(data);
      } else {
        toast({
          title: 'Error',
          description: 'Proposal not found',
          variant: 'destructive'
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load proposal',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!proposal || !id) return;

    try {
      const updated = await proposalsApi.vote(id, type);
      setProposal(updated);
      toast({
        title: 'Vote recorded',
        description: `You voted ${type === 'up' ? '👍' : '👎'} on this proposal`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !proposal || !id || !user) return;

    setSubmittingComment(true);
    try {
      const newComment = await proposalsApi.addComment(id, {
        proposalId: id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: commentText
      });

      setProposal({
        ...proposal,
        comments: [...(proposal.comments || []), newComment]
      });

      setCommentText('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Proposal not found</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    approved: 'bg-success text-success-foreground',
    rejected: 'bg-destructive text-destructive-foreground'
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-card mb-6">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-foreground flex-1">
                  {proposal.title}
                </h1>
                <Badge className={statusColors[proposal.status]}>
                  {proposal.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{proposal.creatorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
                </div>
                <Badge variant="outline">{proposal.category}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-foreground">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {proposal.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  onClick={() => handleVote('up')}
                  variant="outline"
                  className="gap-2 hover:bg-success/10 hover:text-success hover:border-success"
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span className="font-semibold">{proposal.upvotes}</span>
                </Button>

                <Button
                  onClick={() => handleVote('down')}
                  variant="outline"
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  <ThumbsDown className="h-5 w-5" />
                  <span className="font-semibold">{proposal.downvotes}</span>
                </Button>

                <div className="ml-auto text-sm text-muted-foreground">
                  Net Score: <span className="font-semibold text-foreground">{proposal.votes}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="shadow-card">
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">
                Discussion ({proposal.comments?.length || 0})
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts on this proposal..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {commentText.length}/500 characters
                    </p>
                    <Button type="submit" disabled={!commentText.trim() || submittingComment}>
                      {submittingComment ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Post Comment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
                  <Button onClick={() => navigate('/login')}>Sign In</Button>
                </div>
              )}

              <div className="space-y-4">
                {proposal.comments && proposal.comments.length > 0 ? (
                  proposal.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <Avatar>
                        <AvatarImage src={comment.userAvatar} />
                        <AvatarFallback>{comment.userName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-foreground">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
