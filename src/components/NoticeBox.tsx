"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

export default function NoticeBox() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the notice was already dismissed in this session
    const hasSeenNotice = sessionStorage.getItem('noticeDismissed');
    
    if (!hasSeenNotice) {
      // Delay the notice box appearance a bit for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('noticeDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4 flex items-start gap-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/80" />
            
            <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
              <Info size={20} />
            </div>
            
            <div className="flex-1 right-2 pr-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Announcement <span className="text-xs px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">Important Update</span>
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Due to recent personal circumstances, I have decided to take a step back and will not be attending any shows or events for the time being.
                </p>
                <p>
                  This decision has been made to give myself time to focus on mental well-being and to process recent events. I truly appreciate the understanding and support from everyone during this period.
                </p>
                <p>
                  Updates regarding future appearances and events will be shared via Instagram once things return to normal.
                </p>
                <p className="font-medium text-foreground pt-1">
                  Thank you for your continued support.<br />
                  <span className="italic">With Love, Res</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 p-1.5 rounded-full transition-colors absolute top-2 right-2 shrink-0"
              aria-label="Close notice"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
