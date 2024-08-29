package com.voizcallreactnative;

import android.app.KeyguardManager;
import android.content.Context;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class DeviceLockModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public DeviceLockModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "DeviceLock";
    }

    @ReactMethod
    public void isDeviceLocked(Callback callback) {
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
        boolean isLocked = keyguardManager.isDeviceLocked();
        callback.invoke(isLocked);
    }
}
