'use client';

import React from 'react';
import { useNotification } from '@/app/context/NotificationContext';
import NotificationToast from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
