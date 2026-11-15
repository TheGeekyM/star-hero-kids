package com.starhero.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import org.json.JSONObject;

/** Home-screen widget: the child's stars, streak and today's progress. The page sends the numbers (Bridge.widget). */
public class StarWidget extends AppWidgetProvider {
    static void save(Context c, String json) {
        c.getSharedPreferences("widget", Context.MODE_PRIVATE).edit().putString("data", json).apply();
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, StarWidget.class));
        if (ids.length > 0) draw(c, m, ids);
    }

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        draw(c, m, ids);
    }

    static void draw(Context c, AppWidgetManager m, int[] ids) {
        String name = "Star Hero", stars = "⭐", line = "";
        try {
            JSONObject o = new JSONObject(c.getSharedPreferences("widget", Context.MODE_PRIVATE).getString("data", "{}"));
            name = o.optString("name", name);
            stars = o.has("stars") ? String.valueOf(o.getInt("stars")) : stars;
            line = o.optString("line", "");
        } catch (Exception e) {
            // nothing saved yet: show the app name
        }
        PendingIntent open = PendingIntent.getActivity(c, 0, new Intent(c, MainActivity.class), PendingIntent.FLAG_IMMUTABLE);
        for (int id : ids) {
            RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_stars);
            v.setTextViewText(R.id.w_name, name);
            v.setTextViewText(R.id.w_stars, stars);
            v.setTextViewText(R.id.w_line, line);
            v.setOnClickPendingIntent(R.id.w_root, open);
            m.updateAppWidget(id, v);
        }
    }
}
