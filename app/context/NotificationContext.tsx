'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { 
  NotificationContextType, 
  NotificationType,
  Notification 
} from '@/app/types/notification.types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ✅ FIX 1: Added proper type annotation for state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ✅ FIX 2: Properly typed callback
  const addNotification = useCallback(
    (message: string, type: NotificationType, duration = 5000) => {
      const id = uuidv4();
      
      // ✅ FIX 3: Create notification object with proper typing
      const notification: Notification = {
        id,
        message,
        type,
        duration,
      };

      setNotifications(prev => [...prev, notification]);

      // Auto-remove notification after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ✅ FIX 4: Properly typed context value
  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
