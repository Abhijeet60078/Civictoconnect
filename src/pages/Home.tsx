import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StatsDisplay } from '@/components/StatsDisplay';
import { statsApi, Stats } from '@/services/api';
import { Sparkles, Users, Vote, MessageSquare } from 'lucide-react';
import heroCivic from '@/assets/hero-civic.jpg';

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalProposals: 0, totalVotes: 0, totalUsers: 0 });

  useEffect(() => {
    statsApi.get().then(setStats);
  }, []);

  const features = [
    {
      icon: Vote,
      title: 'Vote on Issues',
      description: 'Support proposals you care about with upvotes and downvotes'
    },
    {
      icon: MessageSquare,
      title: 'Join Discussions',
      description: 'Engage in meaningful conversations about community initiatives'
    },
    {
      icon: Sparkles,
      title: 'Create Proposals',
      description: 'Share your ideas and watch them gain community support'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Connect with neighbors who share your vision for change'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <img src={heroCivic} alt="" className="h-full w-full object-cover" />
        </div>
        
        <div className="container relative mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-5xl md:text-6xl font-bold text-primary-foreground">
              Empower Voices. Shape Decisions.
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-primary-foreground/90">
              Vote for Change.
            </p>
            <p className="mb-10 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join your community in participatory decision-making. Propose initiatives, vote on ideas, and create real impact together.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  View Proposals
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto flex justify-center">
          <StatsDisplay {...stats} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CivicConnect makes participatory democracy simple and accessible for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of citizens already shaping their community's future
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-10">
                Join CivicConnect Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
