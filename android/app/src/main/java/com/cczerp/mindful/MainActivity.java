package com.cczerp.mindful;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LeaveFencePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
