package com.starhero.app;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;

/** The whole app is the web page in assets/. This hosts it and gives it the few phone features it needs. */
public class MainActivity extends Activity {
    private static final int SAVE = 1, OPEN = 2, NOTIFY = 3, MEDIA = 4, AUTO = 5;
    // The page is served from this https address (out of assets/) instead of file://, because the offline
    // Quran model is loaded with fetch() and a web worker, which file:// pages are not allowed to use.
    private static final String HOST = "https://appassets.androidplatform.net/";
    private WebView web;
    private String pendingBackup;
    private PermissionRequest pendingMedia;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true); // localStorage holds all progress
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.getSettings().setTextZoom(100); // system font scaling would break the layout
        web.setWebChromeClient(new WebChromeClient() { // also needed for confirm()/prompt() dialogs
            @Override
            public void onPermissionRequest(PermissionRequest req) { // Focus Guard asks for the camera and mic
                pendingMedia = req;
                if (has(Manifest.permission.CAMERA) && has(Manifest.permission.RECORD_AUDIO)) grantMedia();
                else requestPermissions(new String[]{Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO}, MEDIA);
            }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                String url = r.getUrl().toString();
                if (!url.startsWith("http")) return null;
                if (!url.startsWith(HOST)) { // nothing leaves the phone, except YouTube for the parent-chosen videos (videos.js)
                    return youtube(r.getUrl().getHost()) ? null : new WebResourceResponse("text/plain", "utf-8", 404, "Offline", null, null);
                }
                String path = r.getUrl().getPath().substring(1);
                Map<String, String> h = new HashMap<>(); // lets the speech model use several CPU cores if the WebView supports it
                if (!path.equals("videos.html")) { // ...but these headers would block the YouTube player, so the videos page goes without
                    h.put("Cross-Origin-Opener-Policy", "same-origin");
                    h.put("Cross-Origin-Embedder-Policy", "require-corp");
                }
                try {
                    return new WebResourceResponse(mime(path), null, 200, "OK", h, getAssets().open(path.isEmpty() ? "index.html" : path));
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "utf-8", 404, "Not found", h, null);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                // Only the app's own pages open in the app window: a tap can never take the child out to YouTube or the web.
                String url = r.getUrl().toString();
                return !(url.startsWith(HOST) || url.startsWith("file:///android_asset/")) && r.isForMainFrame();
            }

            @Override
            public void onPageFinished(WebView v, String url) {
                // move.html has carried localStorage over from the old file:// address; never do it again.
                if (url.startsWith(HOST)) getSharedPreferences("app", MODE_PRIVATE).edit().putBoolean("moved", true).apply();
            }
        });
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setBackgroundColor(Color.parseColor("#6E0A17")); // curtain red: no blue flash before the splash (splash.js) paints

        // Android 15+ draws under the status/navigation bars; pad the page out of them (and the keyboard).
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#2F9BFF"));
        root.addView(web);
        root.setOnApplyWindowInsetsListener((v, in) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets i = in.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                v.setPadding(i.left, i.top, i.right, i.bottom);
            } else {
                v.setPadding(in.getSystemWindowInsetLeft(), in.getSystemWindowInsetTop(), in.getSystemWindowInsetRight(), in.getSystemWindowInsetBottom());
            }
            return in;
        });
        setContentView(root);
        // All state is in localStorage. Versions up to 1.1 kept it under file://, so the first start goes through move.html once.
        web.loadUrl(getSharedPreferences("app", MODE_PRIVATE).getBoolean("moved", false) ? HOST + "index.html" : "file:///android_asset/move.html");
    }

    @Override
    protected void onResume() {
        super.onResume();
        // A new day may have started while the app sat in the background: let the page close the missed days.
        web.evaluateJavascript("window.wake && wake()", null);
    }

    @Override
    public void onBackPressed() {
        // The page closes its own dialogs/tabs first; it answers "true" when it handled the press.
        web.evaluateJavascript("window.onBack ? onBack() : false", r -> { if (!"true".equals(r)) finish(); });
    }

    private boolean has(String perm) { return checkSelfPermission(perm) == PackageManager.PERMISSION_GRANTED; }

    private void grantMedia() {
        List<String> ok = new ArrayList<>();
        for (String r : pendingMedia.getResources()) {
            if (r.equals(PermissionRequest.RESOURCE_VIDEO_CAPTURE) && has(Manifest.permission.CAMERA)) ok.add(r);
            if (r.equals(PermissionRequest.RESOURCE_AUDIO_CAPTURE) && has(Manifest.permission.RECORD_AUDIO)) ok.add(r);
        }
        if (ok.size() == pendingMedia.getResources().length) pendingMedia.grant(ok.toArray(new String[0]));
        else pendingMedia.deny(); // the page then retries with the mic only
        pendingMedia = null;
    }

    private static String mime(String path) {
        String ext = path.substring(path.lastIndexOf('.') + 1);
        switch (ext) {
            case "html": return "text/html";
            case "js": case "mjs": return "text/javascript";
            case "css": return "text/css";
            case "json": return "application/json";
            case "wasm": return "application/wasm";
            case "webp": return "image/webp";
            case "png": return "image/png";
            case "ttf": return "font/ttf";
            case "mp3": return "audio/mpeg";
            case "txt": return "text/plain; charset=utf-8";
            default: return "application/octet-stream";
        }
    }

    /** Called from JavaScript as window.Android.* (on a background thread). */
    /** Hosts the YouTube player needs. Ads and trackers (doubleclick, googlesyndication…) stay blocked. */
    private static boolean youtube(String host) {
        if (host == null) return false;
        for (String d : new String[]{"youtube.com", "youtube-nocookie.com", "ytimg.com", "googlevideo.com", "ggpht.com", "gstatic.com", "googleapis.com", "google.com"})
            if (host.equals(d) || host.endsWith("." + d)) return true;
        return false;
    }

    private android.speech.tts.TextToSpeech tts;
    private boolean ttsReady;

    private void say(String text, String lang) {
        try {
            tts.setLanguage("ar".equals(lang) ? new java.util.Locale("ar") : java.util.Locale.US);
            tts.setSpeechRate("ar".equals(lang) ? 0.9f : 0.95f);
            tts.speak(text, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, "starhero");
        } catch (Exception e) {
            // no voice for this language: nothing is read
        }
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }

    class Bridge {
        /** Home-screen widget numbers (extras.js). */
        @JavascriptInterface
        public void widget(String json) {
            StarWidget.save(MainActivity.this, json);
        }

        /** Weekly automatic backup (extras.js): pick the file once... */
        @JavascriptInterface
        public void autoBackupPick(String fileName) {
            runOnUiThread(() -> startActivityForResult(new Intent(Intent.ACTION_CREATE_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE).setType("application/json")
                    .putExtra(Intent.EXTRA_TITLE, fileName)
                    .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION), AUTO));
        }

        /** ...then overwrite it every week. */
        @JavascriptInterface
        public boolean autoBackupWrite(String json) {
            return AutoBackup.write(MainActivity.this, json);
        }

        /** Next week's adhan times from prayers.js: [{t, title, text}] ("[]" turns the reminders off). */
        @JavascriptInterface
        public void prayers(String json) {
            Prayers.save(MainActivity.this, json);
        }

        /** Share a picture the page drew (PNG as base64) through the phone's share menu, e.g. to WhatsApp. */
        @JavascriptInterface
        public void shareImage(String base64, String name, String text) {
            try {
                if (!name.matches("[a-z0-9-]+\\.png")) return;
                java.io.File f = new java.io.File(ShareProvider.dir(MainActivity.this), name);
                try (java.io.FileOutputStream out = new java.io.FileOutputStream(f)) { out.write(android.util.Base64.decode(base64, android.util.Base64.DEFAULT)); }
                Uri uri = Uri.parse("content://" + ShareProvider.AUTH + "/" + name);
                Intent send = new Intent(Intent.ACTION_SEND).setType("image/png").putExtra(Intent.EXTRA_STREAM, uri).putExtra(Intent.EXTRA_TEXT, text)
                        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                runOnUiThread(() -> startActivity(Intent.createChooser(send, null).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)));
            } catch (Exception e) {
                // nothing shared; the page keeps working
            }
        }

        /** Read-aloud (plus.js): the phone's own text-to-speech voice. lang = "ar" or "en". */
        @JavascriptInterface
        public void speak(String text, String lang) {
            runOnUiThread(() -> {
                if (tts == null) {
                    tts = new android.speech.tts.TextToSpeech(MainActivity.this, ok -> { ttsReady = ok == android.speech.tts.TextToSpeech.SUCCESS; if (ttsReady) say(text, lang); });
                } else if (ttsReady) say(text, lang);
            });
        }

        @JavascriptInterface
        public void stopSpeaking() {
            runOnUiThread(() -> { if (tts != null) tts.stop(); });
        }

        /** Celebration buzz. pattern = "on,off,on,..." in milliseconds. */
        @JavascriptInterface
        public void vibrate(String pattern) {
            try {
                String[] parts = pattern.split(",");
                long[] t = new long[parts.length + 1]; // waveform starts with an "off" delay of 0
                for (int i = 0; i < parts.length; i++) t[i + 1] = Math.max(0, Math.min(1000, Long.parseLong(parts[i].trim())));
                android.os.Vibrator v = Build.VERSION.SDK_INT >= 31
                        ? getSystemService(android.os.VibratorManager.class).getDefaultVibrator()
                        : (android.os.Vibrator) getSystemService(VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) v.vibrate(android.os.VibrationEffect.createWaveform(t, -1));
            } catch (Exception e) {
                // no buzz is fine
            }
        }

        /** Focus Guard keeps the screen on while it watches. */
        @JavascriptInterface
        public void keepAwake(boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }

        @JavascriptInterface
        public void backup(String json, String fileName) {
            pendingBackup = json;
            runOnUiThread(() -> startActivityForResult(new Intent(Intent.ACTION_CREATE_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE).setType("application/json")
                    .putExtra(Intent.EXTRA_TITLE, fileName), SAVE));
        }

        @JavascriptInterface
        public void restore() {
            runOnUiThread(() -> startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE).setType("*/*"), OPEN));
        }

        @JavascriptInterface
        public void reminder(boolean on, int hour, int minute, String title, String text) {
            Reminders.save(MainActivity.this, on, hour, minute, title, text);
        }

        /** The day on which every child has already ticked everything ("" if not today): skips the reminder. */
        @JavascriptInterface
        public void status(String doneDay) {
            Reminders.prefs(MainActivity.this).edit().putString("doneDay", doneDay).apply();
        }

        @JavascriptInterface
        public boolean canNotify() {
            return getSystemService(NotificationManager.class).areNotificationsEnabled();
        }

        @JavascriptInterface
        public void askNotify() {
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
                runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFY));
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        if (code == MEDIA) { if (pendingMedia != null) grantMedia(); return; }
        web.evaluateJavascript("render()", null); // show or hide the "notifications blocked" note
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (uri == null) return; // picker cancelled
        if (code == AUTO) {
            String place = "";
            boolean ok = true;
            try { place = AutoBackup.keep(this, uri); } catch (Exception e) { ok = false; }
            web.evaluateJavascript("window.onAutoBackupPicked && onAutoBackupPicked(" + ok + "," + JSONObject.quote(place) + ")", null);
            return;
        }
        if (code == SAVE) {
            boolean ok = false;
            try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                out.write(pendingBackup.getBytes(StandardCharsets.UTF_8));
                ok = true;
            } catch (Exception e) {
                // reported to the page below
            }
            pendingBackup = null;
            web.evaluateJavascript("onBackupDone(" + ok + ")", null);
        } else if (code == OPEN) {
            String text = "";
            try (InputStream in = getContentResolver().openInputStream(uri)) {
                ByteArrayOutputStream buf = new ByteArrayOutputStream();
                byte[] b = new byte[8192];
                for (int n; (n = in.read(b)) > 0; ) {
                    buf.write(b, 0, n);
                    if (buf.size() > 5_000_000) throw new Exception("not a backup, too big");
                }
                text = buf.toString("UTF-8");
            } catch (Exception e) {
                // empty text -> the page says "not a backup"
            }
            web.evaluateJavascript("onRestoreFile(" + JSONObject.quote(text) + ")", null);
        }
    }
}
