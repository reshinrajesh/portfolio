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

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('noticeDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={handleDismiss}
          />
          
          {/* Dialog content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-background border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/30">
              <h3 className="font-semibold text-foreground flex items-center gap-3 m-0 text-lg">
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                  <Info size={20} />
                </div>
                Announcement 
                <span className="text-xs px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary uppercase tracking-wider font-bold">Important</span>
              </h3>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 p-2 rounded-full transition-colors flex-shrink-0"
                aria-label="Close notice"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <div className="text-base text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Due to recent personal circumstances, I have decided to take a step back and will not be attending any shows or events for the time being.
                </p>
                <p>
                  This decision has been made to give myself time to focus on mental well-being and to process recent events. I truly appreciate the understanding and support from everyone during this period.
                </p>
                <p>
                  Updates regarding future appearances and events will be shared via Instagram once things return to normal.
                </p>
                <div className="pt-2 mt-2">
                  <p className="font-medium text-foreground text-lg">
                    Thank you for your continued support.<br />
                    <span className="italic">With Love, Res</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-border/50 bg-secondary/10 flex justify-end">
              <button
                onClick={handleDismiss}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
