package com.starhero.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/** Daily reminder. The page tells us the time and text; the alarm re-arms itself every day and after a reboot. */
public class Reminders extends BroadcastReceiver {
    static final String FIRE = "com.starhero.app.REMIND";

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("reminder", Context.MODE_PRIVATE);
    }

    static void save(Context c, boolean on, int hour, int minute, String title, String text) {
        prefs(c).edit().putBoolean("on", on).putInt("h", hour).putInt("m", minute)
                .putString("title", title).putString("text", text).apply();
        schedule(c);
    }

    static void schedule(Context c) {
        SharedPreferences p = prefs(c);
        AlarmManager am = c.getSystemService(AlarmManager.class);
        PendingIntent pi = PendingIntent.getBroadcast(c, 0, new Intent(c, Reminders.class).setAction(FIRE),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        am.cancel(pi);
        if (!p.getBoolean("on", false)) return;
        Calendar at = Calendar.getInstance();
        at.set(Calendar.HOUR_OF_DAY, p.getInt("h", 17));
        at.set(Calendar.MINUTE, p.getInt("m", 0));
        at.set(Calendar.SECOND, 0);
        at.set(Calendar.MILLISECOND, 0);
        if (at.getTimeInMillis() <= System.currentTimeMillis()) at.add(Calendar.DAY_OF_MONTH, 1);
        // ponytail: inexact alarm, can arrive a few minutes late; exact alarms need an extra permission on Android 12+.
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at.getTimeInMillis(), pi);
    }

    @Override
    public void onReceive(Context c, Intent i) {
        if (FIRE.equals(i.getAction())) notifyIfNeeded(c);
        schedule(c); // next day, or re-arm after boot
    }

    static void notifyIfNeeded(Context c) {
        SharedPreferences p = prefs(c);
        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        if (today.equals(p.getString("doneDay", ""))) return; // everything already ticked today
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        nm.createNotificationChannel(new NotificationChannel("reminder", c.getString(R.string.app_name), NotificationManager.IMPORTANCE_DEFAULT));
        PendingIntent open = PendingIntent.getActivity(c, 0,
                new Intent(c, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP),
                PendingIntent.FLAG_IMMUTABLE);
        String text = p.getString("text", "");
        nm.notify(1, new Notification.Builder(c, "reminder")
                .setSmallIcon(R.drawable.ic_notify)
                .setColor(0xFF7B3FE4)
                .setContentTitle(p.getString("title", ""))
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setContentIntent(open)
                .setAutoCancel(true)
                .build());
    }
}
