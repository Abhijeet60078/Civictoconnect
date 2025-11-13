import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    if (!email.includes('admin')) {
      toast({
        title: 'Access Denied',
        description: 'This login is for administrators only',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: 'Welcome to Admin Panel'
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-destructive/10 via-background to-destructive/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-elegant border-destructive/20">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive">
                <Shield className="h-8 w-8 text-destructive-foreground" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Sign in with administrator credentials</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@civic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Regular user? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                User login
              </Link>
            </div>

            <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-xs text-muted-foreground border border-destructive/20">
              <p className="font-semibold mb-1 text-destructive">Admin Demo Login:</p>
              <p>Email: admin@civic.com</p>
              <p>Password: any</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
