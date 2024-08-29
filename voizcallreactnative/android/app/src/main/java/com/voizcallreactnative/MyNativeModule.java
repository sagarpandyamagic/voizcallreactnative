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

@ReactModule(name = "MyNativeModule")
public class MyNativeModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1;
    private Promise mPromise;
    
    MyNativeModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(mActivityEventListener);
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
    public void openNativeLayout() {
        Intent intent = new Intent(reactContext, NativeActivity.class);
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

    // @ReactMethod
    // public void lockScreen(Callback errorCallback, Callback successCallback) {
    //     try {
    //         DevicePolicyManager devicePolicyManager = (DevicePolicyManager) reactContext
    //                 .getSystemService(Context.DEVICE_POLICY_SERVICE);
    //         ComponentName componentName = new ComponentName(reactContext, CustomDeviceAdminReceiver.class);

    //         if (devicePolicyManager == null) {
    //             Log.e("TAG", "DevicePolicyManager is null");
    //             errorCallback.invoke("DevicePolicyManager is null");
    //             return;
    //         }

    //         if (devicePolicyManager.isAdminActive(componentName)) {
    //             Log.d("TAG", "Attempting to lock screen");
    //             devicePolicyManager.lockNow();
    //             successCallback.invoke("Screen locked successfully");
    //         } else {
    //             Log.w("TAG", "Admin is not active, requesting admin privileges");
    //             Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
    //             intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
    //             intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
    //                     "We need this permission to lock the screen programmatically.");
    //             intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    //             reactContext.startActivity(intent);
    //             errorCallback.invoke("Admin privileges not granted");
    //         }
    //     } catch (Exception e) {
    //         Log.e("TAG", "Error locking screen", e);
    //         errorCallback.invoke("Error: " + e.getMessage());
    //     }
    // }

    @ReactMethod
    public void acceptCall() {
        // Call your JavaScript method from here
        WritableMap params = Arguments.createMap();
        params.putBoolean("accepted", true);
        sendEvent("onCallAccepted", params);
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void applyFlags() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
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
                    keyguardManager.requestDismissKeyguard(currentActivity, null);
                }
            } else {
                currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
            }
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

}
