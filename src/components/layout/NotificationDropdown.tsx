import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, FileCheck, Info, X } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import type { UserRole } from '../../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'success' | 'info';
  read: boolean;
}

const DEMO_NOTIFICATIONS: Record<UserRole, NotificationItem[]> = {
  farmer: [
    {
      id: 'f-1',
      title: 'Expert Advisory Published',
      message: 'Dr. Venkatesh issued spray protocol for Yellow Rust in Field Parcel A.',
      time: '15 mins ago',
      type: 'success',
      read: false,
    },
    {
      id: 'f-2',
      title: 'Field Visit Scheduled',
      message: 'Officer Dr. Sharma scheduled farm inspection for tomorrow at 10:30 AM.',
      time: '2 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: 'f-3',
      title: 'Weather Warning: Unseasonal Rain',
      message: 'Heavy rain predicted in Ludhiana sub-district. Delay nitrogen application.',
      time: 'Yesterday',
      type: 'urgent',
      read: true,
    },
  ],
  officer: [
    {
      id: 'o-1',
      title: 'Emergency Pest Alert',
      message: 'Whitefly infestation reported by 4 adjacent farmers in Village Sahnewal.',
      time: '10 mins ago',
      type: 'urgent',
      read: false,
    },
    {
      id: 'o-2',
      title: 'New Case Assigned',
      message: 'Case #CC-9412 (Wheat Blight) assigned to your extension queue.',
      time: '1 hour ago',
      type: 'info',
      read: false,
    },
    {
      id: 'o-3',
      title: 'Advisory Signed by Expert',
      message: 'Case #CC-9380 is ready to be delivered to farmer Gurdip Singh.',
      time: '3 hours ago',
      type: 'success',
      read: true,
    },
  ],
  expert: [
    {
      id: 'e-1',
      title: 'Critical Diagnosis Escalation',
      message: 'Officer Dr. Sharma forwarded unknown leaf curl sample with high severity.',
      time: '25 mins ago',
      type: 'urgent',
      read: false,
    },
    {
      id: 'e-2',
      title: 'AI Confidence Score: 94%',
      message: 'Computer Vision pipeline detected Paddy Sheath Blight on Case #CC-9399.',
      time: '3 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: 'e-3',
      title: 'Epidemiological Bulletin Due',
      message: 'State Agricultural Directorate requested bi-weekly fungal forecast.',
      time: '1 day ago',
      type: 'info',
      read: true,
    },
  ],
  admin: [
    {
      id: 'a-1',
      title: 'SLA Alert: Pending Cases > 48h',
      message: '3 cases in Ludhiana East exceeded initial triage SLA window.',
      time: '30 mins ago',
      type: 'urgent',
      read: false,
    },
    {
      id: 'a-2',
      title: 'New Extension Officers Onboarded',
      message: '2 field officer profiles verified and provisioned for Zone North.',
      time: '4 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: 'a-3',
      title: 'Automated Database Backup Complete',
      message: 'Nightly case management snapshot archived successfully.',
      time: '6 hours ago',
      type: 'info',
      read: true,
    },
  ],
};

export const NotificationDropdown: React.FC = () => {
  const { currentRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return currentRole ? DEMO_NOTIFICATIONS[currentRole] : [];
  });

  // Keep notifications refreshed on role change
  useEffect(() => {
    if (currentRole) {
      setNotifications(DEMO_NOTIFICATIONS[currentRole]);
    }
  }, [currentRole]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'success':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3 ${
                    !item.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`text-xs font-semibold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                  </div>
                  {!item.read && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 self-center"></span>}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">Demo Notification Feed (Role-Specific)</span>
          </div>
        </div>
      )}
    </div>
  );
};
