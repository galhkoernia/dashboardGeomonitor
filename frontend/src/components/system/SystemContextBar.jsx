/*
 * Created on Sun Dec 28 2025
 *
 * Copyright (c) 2025 Your Company
 */

import React from 'react';
import logoIcon from '../../assets/g-logo.png';

const SystemContextBar = ({ 
  systemName = "Geometry Tilt Monitoring System",
  mode = "live",
  lastUpdate,
  alertCount = 0
}) => {
  const isLive = mode === 'live';
  
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        
        <div className="flex items-center">

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
            {logoIcon ? (
              <img 
                src={logoIcon} 
                alt="System Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center rounded-lg">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 font-sans tracking-tight">
              {systemName}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 font-sans">
              Geometric Evaluation and Monitoring Of Engineering Tilt & StabiLity
            </p>
          </div>
        </div>
      
        <div className="flex items-center mt-3 md:mt-0 space-x-4">
          
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isLive ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700 font-sans">
              {isLive ? 'Live Sensors' : 'Simulation'}
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="h-6 w-px bg-gray-300"></div>
          </div>
          
          {alertCount > 0 && (
            <div className="flex items-center">
              <div className="relative">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {alertCount}
                </div>
              </div>
              <span className="text-sm font-medium text-red-600 ml-2 font-sans">
                Alert{alertCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <div className="text-right">
            <div className="text-xs text-gray-500 font-sans uppercase tracking-wider">
              Updated
            </div>
            <div className="text-sm font-mono text-gray-900 font-medium">
              {lastUpdate || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SystemContextBar;