import { create } from "zustand";

interface NotificationStore {
  hasNewNotification: boolean;
	setHasNewNotification: (hasNewNotification: boolean) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
	hasNewNotification: false,
	setHasNewNotification: (hasNewNotification) => set({ hasNewNotification }),
}));

export default useNotificationStore;
