package com.cczerp.mindcue;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * "Leaving home" detection done by the phone's own geofencing (Google Play services), so the app does not
 * keep location switched on. The phone wakes MindCue only when you cross the edge of home.
 */
@CapacitorPlugin(name = "LeaveFence")
public class LeaveFencePlugin extends Plugin {
    static final String PREFS = "leavefence";
    private String pendingRoute = null;

    @Override
    public void load() {
        readRoute(getActivity() != null ? getActivity().getIntent() : null);
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (readRoute(intent)) {
            JSObject o = new JSObject();
            o.put("route", pendingRoute);
            notifyListeners("route", o);
        }
    }

    private boolean readRoute(Intent intent) {
        if (intent == null) return false;
        String r = intent.getStringExtra("mc_route");
        if (r == null) return false;
        pendingRoute = r;
        intent.removeExtra("mc_route");
        return true;
    }

    /** {lat, lng, radius, startH, endH, items:[{id,title,body,route,doneDay}]} -- an empty/absent home turns it off. */
    @PluginMethod
    public void set(PluginCall call) {
        Context c = getContext();
        SharedPreferences.Editor e = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit();
        JSArray items = call.getArray("items");
        if (call.getDouble("lat") == null || call.getDouble("lng") == null || items == null || items.length() == 0) {
            e.clear().apply();
            LeaveFenceReceiver.unregister(c);
            call.resolve();
            return;
        }
        e.putString("lat", String.valueOf(call.getDouble("lat")));
        e.putString("lng", String.valueOf(call.getDouble("lng")));
        e.putFloat("radius", call.getFloat("radius", 150f));
        e.putFloat("startH", call.getFloat("startH", 6f));
        e.putFloat("endH", call.getFloat("endH", 24f));
        e.putInt("n", call.getInt("n", 2));
        e.putString("items", items.toString());
        e.apply();
        LeaveFenceReceiver.register(c);
        call.resolve();
    }

    /** The exercise page to open because a "leaving home" notification was tapped (once). */
    @PluginMethod
    public void takeRoute(PluginCall call) {
        JSObject o = new JSObject();
        o.put("route", pendingRoute);
        pendingRoute = null;
        call.resolve(o);
    }
}
