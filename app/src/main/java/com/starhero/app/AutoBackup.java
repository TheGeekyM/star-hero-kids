package com.starhero.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** Weekly automatic backup: the parent picks a file once (Google Drive works), we keep write access and overwrite it. */
final class AutoBackup {
    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("autobackup", Context.MODE_PRIVATE);
    }

    /** Remember the picked file and keep permission to write it after restarts. Returns a name to show the parent. */
    static String keep(Context c, Uri uri) {
        c.getContentResolver().takePersistableUriPermission(uri, android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION | android.content.Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        prefs(c).edit().putString("uri", uri.toString()).apply();
        String name = uri.getLastPathSegment();
        try (Cursor q = c.getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (q != null && q.moveToFirst()) name = q.getString(0);
        } catch (Exception e) {
            // keep the path segment
        }
        String auth = uri.getAuthority() == null ? "" : uri.getAuthority();
        return (auth.contains("google.android.apps.docs") ? "Google Drive · " : "") + name;
    }

    static boolean write(Context c, String json) {
        String u = prefs(c).getString("uri", null);
        if (u == null) return false;
        try (OutputStream out = c.getContentResolver().openOutputStream(Uri.parse(u), "wt")) {
            out.write(json.getBytes(StandardCharsets.UTF_8));
            return true;
        } catch (Exception e) {
            return false; // file deleted or access lost: the page asks the parent to pick again
        }
    }
}
