import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function parseTimeTo24Hour(hourStr: string, minuteStr: string, period: 'AM' | 'PM') {
  let hour = parseInt(hourStr, 10) || 8;
  const minute = parseInt(minuteStr, 10) || 0;

  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
}

export async function scheduleDailyReminder(
  hourStr: string,
  minuteStr: string,
  period: 'AM' | 'PM'
): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Reminder',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const { hour, minute } = parseTimeTo24Hour(hourStr, minuteStr, period);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Memory Lane',
        body: 'You’ve done great work today, take a moment to recharge your brain!',
        data: { url: '/home' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to schedule daily reminder:', error);
    return false;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel daily reminder:', error);
  }
}