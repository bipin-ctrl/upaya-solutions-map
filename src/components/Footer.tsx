import { motion } from 'framer-motion';
import { MapPin, Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  const team = [
    { name: 'Bipin Gaire', role: 'Lead Developer' },
    { name: 'Nehal', role: 'Frontend' },
    { name: 'Gaurab', role: 'Backend' },
    { name: 'Prithak', role: 'UI/UX' },
    { name: 'Ansuman', role: 'Research' },
  ];

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Upaya</h3>
                <p className="text-sm opacity-70">उपाय</p>
              </div>
            </div>
            <p className="text-lg font-medium mb-2 opacity-90">
              Mapping Problems. Creating Solutions.
            </p>
            <p className="text-sm opacity-70 max-w-md leading-relaxed">
              Empowering citizens to report, track, and resolve urban infrastructure problems. 
              Together, we're building smarter cities for Nepal.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-lg">Platform</h4>
            <ul className="space-y-2">
              {['Report Issue', 'View Map', 'Statistics', 'How it Works', 'API Access'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-lg">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@upaya.np" className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2">
                  <Mail className="w-4 h-4" /> contact@upaya.np
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Repository
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-8 border-t border-background/10"
        >
          <p className="text-center text-sm opacity-70 mb-4">Developed with passion by</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <p className="font-medium text-sm">{member.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-60">
            © 2024 NSS Computer Project.
          </p>
          <p className="text-xs opacity-60 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in Nepal 🇳🇵
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
