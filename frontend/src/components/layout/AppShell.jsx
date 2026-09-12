import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import { monitoringService, configService } from '../../services/api';

export default function AppShell() {
  const [dataMode, setDataMode] = useState('live');
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
    <div className="h-screen w-screen bg-[#07090E] text-slate-100 flex flex-col overflow-hidden">
      <TopBar
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <main className="flex-1 overflow-y-auto relative">
        <Outlet context={{ refreshTrigger, dataMode, handleRefresh }} />
      </main>
    </div>
  );
}
