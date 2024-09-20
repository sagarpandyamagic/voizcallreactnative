// MyNativeModule.java
package com.voizcallreactnative;

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.voizcallreactnative.NotificationService;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.annotation.Nullable;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.module.annotations.ReactModule;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.view.WindowManager;
import android.app.KeyguardManager;
import android.os.Build;
import android.app.Activity;
import com.voizcallreactnative.MainActivity;
import com.voizcallreactnative.NativeActivity;
import android.net.Uri;
import android.provider.Settings;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import android.os.PowerManager;
import android.os.Bundle; // here
import android.os.PowerManager;
import android.view.WindowManager;
import android.app.KeyguardManager;
import android.app.Activity;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.LiveData;

@ReactModule(name = "MyNativeModule")
public class MyNativeModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1;
    public static  boolean IS_CALL_DECLINED = false;
    public static  boolean IS_CALL_DECLINED_NATIVEACTIVITY = false;


    private Promise mPromise;
    private PowerManager.WakeLock wakeLock;
    private static MutableLiveData<String> liveData = new MutableLiveData<>();

    MyNativeModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    // Method to get LiveData
    public static MutableLiveData<String> getLiveData() {
        return liveData;
    }

    // Method to update LiveData
    public void updateData(String data) {
        Log.d("NativeActivity", "liveDatapostValue " + data);
        liveData.postValue(data); // This will trigger observers
    }

    // For example: Use this method to trigger updates
    @ReactMethod
    public void triggerUpdateFromJS(String data) {
        updateData(data); // Updating LiveData which will notify observers
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(int requestCode, int resultCode, Intent data) {
            if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (Settings.canDrawOverlays(getReactApplicationContext())) {
                        mPromise.resolve(true);
                    } else {
                        mPromise.resolve(false);
                    }
                }
            }
        }
    };

    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        mPromise = promise;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(getReactApplicationContext())) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                getCurrentActivity().startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            } else {
                promise.resolve(true);
            }
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void hasOverlayPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(getReactApplicationContext()));
        } else {
            promise.resolve(true);
        }
    }

    @Override
    public String getName() {
        return "MyNativeModule";
    }

    @ReactMethod
    public void openNativeLayout(String name, String number, String themeColor) {
        Log.d("openNativeLayout", "Create event name: " + name
                + " and Number: " + number);
        Intent intent = new Intent(reactContext, NativeActivity.class);
        intent.putExtra("name", name);
        intent.putExtra("number", number);
        intent.putExtra("themecolor", themeColor);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void notificationService() {
        Intent serviceIntent = new Intent(reactContext, NotificationService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // For Android 8 and later, use startForegroundService
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
        Log.e("notificationService", "notificationService");

    }

    @ReactMethod
    public void wakeUpDevice() {
        PowerManager powerManager = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(
                PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                "MyApp::MyWakelockTag");
        wakeLock.acquire(10 * 60 * 1000L /* 10 minutes */);

        releaseWakeLock();
    }

    @ReactMethod
    public void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
    }

    @ReactMethod
    public void acceptCall() {
        // Call your JavaScript method from here
        Log.d("NativeActivity", "onCallAccepted");

        WritableMap params = Arguments.createMap();
        params.putBoolean("accepted", true);
        sendEvent("onCallAccepted", null);
    }

    @ReactMethod
    public void declineCall() {
        WritableMap params = Arguments.createMap();
        params.putBoolean("declined", true);
        sendEvent("onCallDeclined", null);
    }

    private void sendEvent(String eventName, WritableMap params) {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(eventName, params);
            } else {
                Log.e("NativeActivity", "ReactContext is null or CatalystInstance is not active");
            }
        }, 100);
    }

    @ReactMethod
    public void applyFlags() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (isSamsungDevice()) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                            currentActivity.setShowWhenLocked(true);
                            currentActivity.setTurnScreenOn(true);
                        } else {
                            currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
                        }
                        KeyguardManager keyguardManager = (KeyguardManager) currentActivity
                                .getSystemService(Context.KEYGUARD_SERVICE);
                        if (keyguardManager != null) {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                keyguardManager.requestDismissKeyguard(currentActivity, null);
                            } else {
                                keyguardManager.newKeyguardLock("VoizCall").disableKeyguard();
                            }
                        }
                    } else {
                        currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
                    }
                }
            });
        }
    }

    @ReactMethod
    public void removeFlags() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            try {
                if (isSamsungDevice()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                        currentActivity.setShowWhenLocked(false);
                        currentActivity.setTurnScreenOn(false);
                    } else {
                        currentActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
                    }

                } else {
                    removeFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
                }

            } catch (Exception e) {
                Log.e("MyNativeModule", "Error clearing window flags", e);
            }
        }
    }

    private boolean isSamsungDevice() {
        String manufacturer = Build.MANUFACTURER;
        return manufacturer != null && manufacturer.toLowerCase().contains("samsung");
    }

    public void removeFlags(final int flags) {
        final Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        activity.getWindow().clearFlags(flags);
                    } catch (Exception e) {
                        Log.e("MyNativeModule", "Error clearing window flags", e);
                    }
                }
            });
        }
    }

    @ReactMethod
    public void isDeviceLocked(Promise promise) {
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
        if (keyguardManager != null) {
            boolean isLocked = keyguardManager.isKeyguardLocked();
            promise.resolve(isLocked);
        } else {
            promise.reject("ERROR", "KeyguardManager is null");
        }
    }

    @ReactMethod
    public void showSplashScreen() {
        wakeUpDevice();
        Intent intent = new Intent(reactContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    // @ReactMethod
    // public void RemoveIncomingScreen() {
    // Log.d("RemoveIncomingScreen", "RemoveIncomingScreen");
    // NativeActivity.activity.onBackPressed();
    // // NativeActivity.activity.finish();
    // }

    @ReactMethod
    public void RemoveIncomingScreen() {
        Log.d("RemoveIncomingScreen", "triggerUpdateFromJS");
        if(IS_CALL_DECLINED_NATIVEACTIVITY){
            IS_CALL_DECLINED_NATIVEACTIVITY = false;
        }else{
            IS_CALL_DECLINED = true;
            triggerUpdateFromJS("dismiss");
        }
    }
}
