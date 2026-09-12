import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { monitoringService, configService } from '../../services/api';

export default function AppShell() {
  const [dataMode, setDataMode] = useState('demo');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    configService.getConfig()
      .then(res => {
        if (res.data?.data?.dataMode) {
          setDataMode(res.data.data.dataMode);
        }
      })
      .catch(console.warn);
  }, []);

  const handleToggleMode = async (newMode) => {
    try {
      setDataMode(newMode);
      await configService.updateConfig({ dataMode: newMode });
      handleRefresh();
    } catch (err) {
      console.error('Failed to switch data mode:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await monitoringService.triggerIngestion();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.warn('Manual refresh failed:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col">
      <TopBar
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        dataMode={dataMode}
        onToggleMode={handleToggleMode}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#07090E]">
          <Outlet context={{ refreshTrigger, dataMode, handleRefresh }} />
        </main>
      </div>
    </div>
  );
}
