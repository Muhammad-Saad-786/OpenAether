// src/components/home/Hero.jsx
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aether-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aether-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-aether-500/10 border border-aether-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-aether-500" />
            <span className="text-sm font-medium">Open Source AI Platform</span>
            <span className="text-xs bg-aether-500/20 text-aether-400 px-2 py-0.5 rounded-full">
              v0.1.0
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Democratize</span> AI
            <br />
            <span className="text-foreground">Access for Everyone</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Access multiple AI models through a single, beautiful interface. Free, open source, and
            privacy-focused.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="gradient" size="xl" className="group">
              Start Chatting Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              View Models
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl glass">
              <Zap className="w-8 h-8 text-aether-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">5+ Providers</h3>
              <p className="text-sm text-muted-foreground">Groq, Gemini, OpenRouter, and more</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl glass">
              <Shield className="w-8 h-8 text-aether-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Your data never leaves your control</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl glass">
              <Globe className="w-8 h-8 text-aether-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground">Community-driven and transparent</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-2 bg-muted-foreground rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
