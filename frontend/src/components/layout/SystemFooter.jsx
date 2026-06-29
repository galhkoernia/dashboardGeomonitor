/*
 * Created on Sun Dec 28 2025
 *
 * Copyright (c) 2025 Your Company
 */

import React from 'react';

const SystemFooter = ({ isDemoMode, dataSource }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 pt-6 border-t border-gray-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        
        <div className="mb-4 md:mb-0">
          <div className="text-sm text-gray-600 font-sans">
            © {currentYear} Structure Tilt Monitoring System
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Geometric evaluation and monitoring of slope and stability of structures • Version 1.0.0
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div className={`w-2 h-2 rounded-full mr-2 ${isDemoMode ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <div className="text-sm text-gray-700 font-medium">
              Date : <span className="font-normal">{dataSource}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            <span className="font-mono">{new Date().toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>Update : 1Hz</span>
          </div>
        </div>
        
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          This system is specifically designed for engineering monitoring purposes. 
          Always verify critical measurements through physical inspection. In an emergency, 
          follow applicable safety procedures.
        </div>
      </div>
    </footer>
  );
};

export default SystemFooter;