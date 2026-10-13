package com.cczerp.mindful;

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
            .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_EXIT)
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
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) { register(c); return; }
        GeofencingEvent ev = GeofencingEvent.fromIntent(intent);
        if (ev == null || ev.hasError() || ev.getGeofenceTransition() != Geofence.GEOFENCE_TRANSITION_EXIT) return;
        SharedPreferences p = c.getSharedPreferences(LeaveFencePlugin.PREFS, Context.MODE_PRIVATE);
        Calendar now = Calendar.getInstance();
        float h = now.get(Calendar.HOUR_OF_DAY) + now.get(Calendar.MINUTE) / 60f;
        if (h < p.getFloat("startH", 6f) || h > p.getFloat("endH", 24f)) return;
        String today = todayIso(now);
        try {
            JSONArray items = new JSONArray(p.getString("items", "[]"));
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            nm.createNotificationChannel(new NotificationChannel("leave", "Leaving home", NotificationManager.IMPORTANCE_DEFAULT));
            SharedPreferences.Editor e = p.edit();
            for (int k = 0; k < items.length(); k++) {
                JSONObject it = items.getJSONObject(k);
                String id = it.getString("id");
                if (today.equals(p.getString("fired_" + id, "")) || it.optString("doneDay", "").equals(today)) continue;
                e.putString("fired_" + id, today);
                Intent open = new Intent(c, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                open.putExtra("mc_route", it.optString("route", "#today"));
                PendingIntent tap = PendingIntent.getActivity(c, 100 + k, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                nm.notify(9000 + k, new NotificationCompat.Builder(c, "leave")
                    .setSmallIcon(c.getApplicationInfo().icon)
                    .setContentTitle(it.getString("title"))
                    .setContentText(it.optString("body"))
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(it.optString("body")))
                    .setContentIntent(tap)
                    .setAutoCancel(true)
                    .build());
            }
            e.apply();
        } catch (Exception ex) {
            // malformed saved data: nothing to show
        }
    }

    private static String todayIso(Calendar n) {
        return String.format(java.util.Locale.US, "%04d-%02d-%02d", n.get(Calendar.YEAR), n.get(Calendar.MONTH) + 1, n.get(Calendar.DAY_OF_MONTH));
    }
}
