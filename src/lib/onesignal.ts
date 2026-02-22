import { Capacitor } from "@capacitor/core";
import type { User } from "@/types";

const ONE_SIGNAL_APP_ID =
  import.meta.env.VITE_ONESIGNAL_APP_ID ?? "2cd463cd-765d-4330-91a8-410897863242";

let initialized = false;

const getOneSignal = async () => {
  const module = await import("onesignal-cordova-plugin");
  return module.default;
};

export const initOneSignal = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || initialized) return;

  const OneSignal = await getOneSignal();
  OneSignal.initialize(ONE_SIGNAL_APP_ID);

  OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event: any) => {
    const source = event?.notification?.additionalData?.source;
    if (source === "internal") {
      event.preventDefault(true);
    }
  });

  initialized = true;
};

export const syncOneSignalUser = async (user: User | null): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !initialized || !user) return;

  const OneSignal = await getOneSignal();
  OneSignal.login(user.id);
  OneSignal.User.addTags({
    app: "mysys",
    handle: user.handle,
    role: user.role,
  });
};

export const clearOneSignalUser = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !initialized) return;

  const OneSignal = await getOneSignal();
  OneSignal.logout();
};

export const requestOneSignalPermission = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !initialized) return;

  const OneSignal = await getOneSignal();
  await OneSignal.Notifications.requestPermission(false);
};
