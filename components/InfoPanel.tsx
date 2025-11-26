import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ContentNode } from '../types';

interface InfoPanelProps {
  node: ContentNode | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ node, onClose }) => {
  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-[90%] max-w-[500px] bg-black/90 border-2 border-holo-cyan rounded-2xl p-6 text-white shadow-[0_0_50px_rgba(0,243,255,0.3)] z-50 overflow-hidden"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-holo-cyan hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-display font-bold text-holo-cyan mb-4 drop-shadow-[0_0_10px_#00f3ff]">
              {node.title}
            </h2>

            {node.shortDescription && (
              <p className="text-gray-300 italic mb-4 border-l-2 border-holo-pink pl-3">
                {node.shortDescription}
              </p>
            )}

            <div 
              className="prose prose-invert prose-sm max-w-none font-body text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: node.fullContent }} 
            />

            <div className="mt-6 p-4 bg-holo-cyan/10 rounded border border-holo-cyan/30">
              <strong className="text-holo-cyan block mb-1 text-xs uppercase tracking-widest">Interactive Data</strong>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-holo-cyan to-holo-pink"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Additional multimedia content would load here in a production environment.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
