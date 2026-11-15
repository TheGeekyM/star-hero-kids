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
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;

/** Adhan reminders. The page (prayers.js) calculates the next week of prayer times; we show a notification at each. */
public class Prayers extends BroadcastReceiver {
    static final String FIRE = "com.starhero.app.PRAYER";
    static final int BASE = 100, MAX = 40; // request codes 100..139: one per scheduled adhan

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("prayers", Context.MODE_PRIVATE);
    }

    /** json: [{t: epoch ms, title, text}, ...] (empty = reminders off). */
    static void save(Context c, String json) {
        prefs(c).edit().putString("list", json).apply();
        schedule(c);
    }

    static PendingIntent intent(Context c, int i, String title, String text) {
        Intent in = new Intent(c, Prayers.class).setAction(FIRE).putExtra("title", title).putExtra("text", text);
        return PendingIntent.getBroadcast(c, BASE + i, in, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    static void schedule(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        for (int i = 0; i < MAX; i++) am.cancel(intent(c, i, "", ""));
        try {
            JSONArray list = new JSONArray(prefs(c).getString("list", "[]"));
            long now = System.currentTimeMillis();
            boolean exact = Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms();
            for (int i = 0, n = 0; i < list.length() && n < MAX; i++) {
                JSONObject x = list.getJSONObject(i);
                long t = x.getLong("t");
                if (t <= now) continue;
                PendingIntent pi = intent(c, n++, x.optString("title"), x.optString("text"));
                // On time when the phone allows exact alarms; otherwise Android may deliver it a few minutes late.
                if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
                else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
            }
        } catch (Exception e) {
            // bad list: nothing scheduled
        }
    }

    @Override
    public void onReceive(Context c, Intent i) {
        if (!FIRE.equals(i.getAction())) { schedule(c); return; } // after a reboot
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        nm.createNotificationChannel(new NotificationChannel("prayers", c.getString(R.string.app_name) + " · 🕌", NotificationManager.IMPORTANCE_HIGH));
        PendingIntent open = PendingIntent.getActivity(c, 0,
                new Intent(c, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP),
                PendingIntent.FLAG_IMMUTABLE);
        String text = i.getStringExtra("text");
        nm.notify(2, new Notification.Builder(c, "prayers")
                .setSmallIcon(R.drawable.ic_notify)
                .setColor(0xFF12AFA0)
                .setContentTitle(i.getStringExtra("title"))
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setContentIntent(open)
                .setAutoCancel(true)
                .build());
    }
}
