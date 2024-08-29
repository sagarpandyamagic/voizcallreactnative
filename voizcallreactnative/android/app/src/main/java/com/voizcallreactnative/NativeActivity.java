package com.voizcallreactnative;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Build;
import android.content.Intent;


import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.annotation.Nullable;
import android.util.Log;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import androidx.core.app.NotificationCompat;
import com.voizcallreactnative.NativeActivity;
import android.app.PendingIntent;
import android.os.Bundle;
import android.view.WindowManager;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.Button;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.ReactInstanceManager;
import com.voizcallreactnative.MyNativeModule;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import android.view.WindowManager;
import android.app.KeyguardManager;
import android.os.Build;
import android.app.KeyguardManager;
import android.os.Handler;

public class NativeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (isSamsungDevice()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                setShowWhenLocked(true);
                setTurnScreenOn(true);
            } else {
                getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                     WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
            }
            KeyguardManager keyguardManager = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if (keyguardManager != null) {
                keyguardManager.requestDismissKeyguard(this, null);
            }
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                                 WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                                 WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                                 WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }
        
        setContentView(R.layout.activity_native);

        LinearLayout button = findViewById(R.id.ll_incoming_call_name);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                callReactNativeMethod();
                Log.i("NativeActivity", "Button Click->");
            }
        });

        // new Handler().postDelayed(new Runnable() {
        //     @Override
        //     public void run() {
        //         callReactNativeMethod();
        //     }
        // }, 2000);

        wakeUpScreen();
    }

    private boolean isSamsungDevice() {
        String manufacturer = Build.MANUFACTURER;
        return manufacturer != null && manufacturer.toLowerCase().contains("samsung");
    }


    private void callReactNativeMethod() {
        try {
            ReactInstanceManager reactInstanceManager = ((MainApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
            if (reactContext != null) {
                MyNativeModule nativeCallModule = reactContext.getNativeModule(MyNativeModule.class);
                if (nativeCallModule != null) {
                    nativeCallModule.acceptCall();
                    finish();
                } else {
                    Log.e("NativeActivity", "MyNativeModule is null");
                }
            } else {
                Log.e("NativeActivity", "ReactContext is null");
                // Optionally, you can try to initialize the React context here
                reactInstanceManager.createReactContextInBackground();
            }
        } catch (Exception e) {
            Log.e("NativeActivity", "Error calling React Native method", e);
        }
    }
    

    private void wakeUpScreen() {
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
            PowerManager.FULL_WAKE_LOCK |
            PowerManager.ACQUIRE_CAUSES_WAKEUP |
            PowerManager.ON_AFTER_RELEASE, "MyApp::NotificationWakeLock");

         wakeLock.acquire(3000); // Wake up the screen for 3 seconds

        // Optionally release the wake lock immediately after waking up
        wakeLock.release();
    }
}
