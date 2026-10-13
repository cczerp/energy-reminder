package com.cczerp.mindcue;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import androidx.core.app.NotificationCompat;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingEvent;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;
import java.util.Calendar;
import org.json.JSONArray;
import org.json.JSONObject;

/** Receives "you left home" from the phone's geofencing and posts the reminders, even if the app is closed. */
public class LeaveFenceReceiver extends BroadcastReceiver {
    private static PendingIntent pending(Context c) {
        Intent i = new Intent(c, LeaveFenceReceiver.class);
        return PendingIntent.getBroadcast(c, 7, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
    }

    static void register(Context c) {
        SharedPreferences p = c.getSharedPreferences(LeaveFencePlugin.PREFS, Context.MODE_PRIVATE);
        String lat = p.getString("lat", null), lng = p.getString("lng", null);
        if (lat == null || lng == null) return;
        Geofence g = new Geofence.Builder()
            .setRequestId("home")
            .setCircularRegion(Double.parseDouble(lat), Double.parseDouble(lng), Math.max(100f, p.getFloat("radius", 150f)))
            .setExpirationDuration(Geofence.NEVER_EXPIRE)
            .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_EXIT | Geofence.GEOFENCE_TRANSITION_ENTER)
            .build();
        GeofencingRequest req = new GeofencingRequest.Builder().addGeofence(g).build();
        try {
            GeofencingClient client = LocationServices.getGeofencingClient(c);
            client.removeGeofences(pending(c));
            client.addGeofences(req, pending(c));
        } catch (SecurityException e) {
            // location permission not granted yet; the app registers again once it is
        }
    }

    static void unregister(Context c) {
        try { LocationServices.getGeofencingClient(c).removeGeofences(pending(c)); } catch (Exception e) { }
        cancelAlarms(c);
    }

    static final String ALARM = "com.cczerp.mindcue.LEAVE_ALARM";
    private static final int GAP_MIN = 45; // spacing of the extra reminders while you are out

    @Override
    public void onReceive(Context c, Intent intent) {
        String act = intent.getAction();
        SharedPreferences p = c.getSharedPreferences(LeaveFencePlugin.PREFS, Context.MODE_PRIVATE);
        if (Intent.ACTION_BOOT_COMPLETED.equals(act)) { register(c); return; }
        if (ALARM.equals(act)) { if (p.getBoolean("away", false)) fireNext(c, p); return; }
        GeofencingEvent ev = GeofencingEvent.fromIntent(intent);
        if (ev == null || ev.hasError()) return;
        int t = ev.getGeofenceTransition();
        if (t == Geofence.GEOFENCE_TRANSITION_ENTER) {
            p.edit().putBoolean("away", false).apply();
            cancelAlarms(c);
        } else if (t == Geofence.GEOFENCE_TRANSITION_EXIT) {
            p.edit().putBoolean("away", true).apply();
            cancelAlarms(c);
            fireNext(c, p);
            // the rest of today's reminders arrive while you are still out, spaced apart
            int left = Math.min(5, p.getInt("n", 2) - todayCount(p));
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            for (int k = 1; k <= left; k++) {
                Intent a = new Intent(c, LeaveFenceReceiver.class).setAction(ALARM);
                PendingIntent pi = PendingIntent.getBroadcast(c, 300 + k, a, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + k * GAP_MIN * 60000L, pi);
            }
        }
    }

    private static void cancelAlarms(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        for (int k = 1; k <= 5; k++) {
            Intent a = new Intent(c, LeaveFenceReceiver.class).setAction(ALARM);
            am.cancel(PendingIntent.getBroadcast(c, 300 + k, a, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        }
    }

    private static int todayCount(SharedPreferences p) {
        return todayIso(Calendar.getInstance()).equals(p.getString("cntDay", "")) ? p.getInt("cnt", 0) : 0;
    }

    /** Posts the next leave-home exercise (rotating through the ones switched on), if today's allowance and hours permit. */
    private static void fireNext(Context c, SharedPreferences p) {
        Calendar now = Calendar.getInstance();
        float h = now.get(Calendar.HOUR_OF_DAY) + now.get(Calendar.MINUTE) / 60f;
        if (h < p.getFloat("startH", 6f) || h > p.getFloat("endH", 24f)) return;
        String today = todayIso(now);
        int cnt = todayCount(p);
        if (cnt >= p.getInt("n", 2)) return;
        try {
            JSONArray items = new JSONArray(p.getString("items", "[]"));
            if (items.length() == 0) return;
            int idx = new java.util.Random().nextInt(items.length()); // several ticked leave-home exercises: pick one at random
            for (int tries = 0; tries < items.length(); tries++) {
                JSONObject it = items.getJSONObject((idx + tries) % items.length());
                if (it.optString("doneDay", "").equals(today)) continue;
                NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
                nm.createNotificationChannel(new NotificationChannel("leave", "Leaving home", NotificationManager.IMPORTANCE_DEFAULT));
                Intent open = new Intent(c, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                open.putExtra("mc_route", it.optString("route", "#today"));
                PendingIntent tap = PendingIntent.getActivity(c, 100 + cnt, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                nm.notify(9000 + cnt, new NotificationCompat.Builder(c, "leave")
                    .setSmallIcon(c.getApplicationInfo().icon)
                    .setContentTitle(it.getString("title"))
                    .setContentText(it.optString("body"))
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(it.optString("body")))
                    .setContentIntent(tap)
                    .setAutoCancel(true)
                    .build());
                p.edit().putString("cntDay", today).putInt("cnt", cnt + 1).apply();
                return;
            }
        } catch (Exception ex) {
            // malformed saved data: nothing to show
        }
    }

    private static String todayIso(Calendar n) {
        return String.format(java.util.Locale.US, "%04d-%02d-%02d", n.get(Calendar.YEAR), n.get(Calendar.MONTH) + 1, n.get(Calendar.DAY_OF_MONTH));
    }
}
