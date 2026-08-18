import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { useToast } from './ToastContext';

const NotificationContext = createContext();

const LOCAL_STORAGE_KEY = 'krasola_local_notifications_v1';
const MAX_NOTIFICATIONS = 50;

// Initial starter notifications for new creators
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'starter-welcome',
    title: 'Welcome to Krasola Workspace',
    message: 'Explore Palette Lab, Pattern Studio, and Image Search Hub with real-time cloud sync.',
    type: 'system',
    category: 'general',
    action_tab: 'palette',
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'starter-cloud',
    title: 'Cloud Vault Ready',
    message: 'Your personal 50MB storage quota is active with end-to-end Row Level Security.',
    type: 'security',
    category: 'account',
    action_tab: 'account',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

export const NotificationProvider = ({ children }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Load from local storage
  const loadLocalNotifications = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(0, MAX_NOTIFICATIONS) : DEFAULT_NOTIFICATIONS;
      }
    } catch (e) {
      console.error('Failed to load local notifications', e);
    }
    return DEFAULT_NOTIFICATIONS;
  };

  // Save to local storage
  const saveLocalNotifications = (items) => {
    try {
      const capped = items.slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(capped));
    } catch (e) {
      console.error('Failed to save local notifications', e);
    }
  };

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Fetch notifications from Supabase or fallback to LocalStorage
  const fetchNotifications = useCallback(async (user) => {
    setLoading(true);
    if (!user || !supabase) {
      const local = loadLocalNotifications();
      setNotifications(local);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(MAX_NOTIFICATIONS);

      if (error) throw error;

      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        // First-time sync default starter notification into DB
        const starter = {
          user_id: user.id,
          title: 'Welcome to Krasola Cloud',
          message: 'Your personal workspace and notifications are synchronized across all your devices.',
          type: 'system',
          category: 'general',
          action_tab: 'palette',
          is_read: false
        };
        const { data: inserted } = await supabase
          .from('user_notifications')
          .insert([starter])
          .select();
        setNotifications(inserted || [starter]);
      }
    } catch (err) {
      console.warn('Falling back to local notifications:', err.message);
      const local = loadLocalNotifications();
      setNotifications(local);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync auth state
  useEffect(() => {
    if (!supabase) {
      setNotifications(loadLocalNotifications());
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setCurrentUser(user);
      fetchNotifications(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      fetchNotifications(user);
    });

    return () => subscription?.unsubscribe();
  }, [fetchNotifications]);

  // Add a new notification
  const addNotification = async ({
    title,
    message,
    type = 'info',
    category = 'general',
    actionTab = null,
    actionPayload = null
  }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      category,
      action_tab: actionTab,
      action_payload: actionPayload,
      is_read: false,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update (capped at 50)
    setNotifications(prev => [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS));

    if (currentUser && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_notifications')
          .insert([{
            user_id: currentUser.id,
            title,
            message,
            type,
            category,
            action_tab: actionTab,
            action_payload: actionPayload,
            is_read: false
          }])
          .select()
          .single();

        if (!error && data) {
          setNotifications(prev => [data, ...prev.filter(n => n.id !== newNotif.id)].slice(0, MAX_NOTIFICATIONS));
        }
      } catch (err) {
        console.warn('Failed to insert cloud notification:', err.message);
      }
    } else {
      setNotifications(prev => {
        const updated = [newNotif, ...prev.filter(n => n.id !== newNotif.id)].slice(0, MAX_NOTIFICATIONS);
        saveLocalNotifications(updated);
        return updated;
      });
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
    );

    if (currentUser && supabase && typeof id === 'string' && id.includes('-') && id.length > 20) {
      try {
        await supabase
          .from('user_notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to mark read in cloud:', err.message);
      }
    } else {
      const updated = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
      saveLocalNotifications(updated);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const now = new Date().toISOString();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: now })));
    toast.success('All notifications marked as read');

    if (currentUser && supabase) {
      try {
        await supabase
          .from('user_notifications')
          .update({ is_read: true, read_at: now })
          .eq('user_id', currentUser.id)
          .eq('is_read', false);
      } catch (err) {
        console.error('Failed to mark all read in cloud:', err.message);
      }
    } else {
      const updated = notifications.map(n => ({ ...n, is_read: true, read_at: now }));
      saveLocalNotifications(updated);
    }
  };

  // Clear all read notifications
  const clearReadNotifications = async () => {
    const remaining = notifications.filter(n => !n.is_read);
    setNotifications(remaining);
    toast.success('Cleared read notifications');

    if (currentUser && supabase) {
      try {
        await supabase
          .from('user_notifications')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('is_read', true);
      } catch (err) {
        console.error('Failed to clear read in cloud:', err.message);
      }
    } else {
      saveLocalNotifications(remaining);
    }
  };

  // Delete a single notification
  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    if (currentUser && supabase && typeof id === 'string' && id.includes('-') && id.length > 20) {
      try {
        await supabase
          .from('user_notifications')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Failed to delete notification:', err.message);
      }
    } else {
      const remaining = notifications.filter(n => n.id !== id);
      saveLocalNotifications(remaining);
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        loading,
        currentUser,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearReadNotifications,
        deleteNotification,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        fetchNotifications: () => fetchNotifications(currentUser)
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
