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
import android.os.Bundle;
import android.view.WindowManager;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.Button;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.bridge.CatalystInstance;

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
import com.voizcallreactnative.MainApplication;
import android.widget.TextView;
import android.app.Activity;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.Observer;
import com.voizcallreactnative.MyNativeModule;
import androidx.lifecycle.Observer;
import androidx.appcompat.app.AppCompatActivity;
import android.media.AudioManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.VibrationEffect;
import android.os.Vibrator;


public class NativeActivity extends AppCompatActivity {

    private MyNativeModule nativeCallModule;
    private Observer<String> dataObserver = null;
    private Ringtone ringtone;
    private Vibrator vibrator;

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
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    keyguardManager.requestDismissKeyguard(this, null);
                } else {
                    keyguardManager.newKeyguardLock("VoizCall").disableKeyguard();
                }
            }
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }

        setContentView(R.layout.activity_native);

        String name = String.valueOf(getIntent().getStringExtra("name"));
        String number = String.valueOf(getIntent().getStringExtra("number"));

        TextView txtIncomingCallName = findViewById(R.id.txt_incoming_call_name);
        TextView txtIncomingCallNumber = findViewById(R.id.txt_incoming_call_number);

        txtIncomingCallName.setText(name);
        txtIncomingCallNumber.setText(number);

        LinearLayout llIncomingAccept = findViewById(R.id.ll_incoming_accept);
        llIncomingAccept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                callReactNativeMethodForCall(true);
                Log.i("NativeActivity", "Button Click->");
            }
        });

        LinearLayout llIncomingDecline = findViewById(R.id.ll_incoming_decline);
        llIncomingDecline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                callReactNativeMethodForCall(false);
                Log.i("NativeActivity", "Button Click->");
            }
        });

        observeData();
    }

    
    public void dismissScreen() {
        finish();
    }
    private boolean isSamsungDevice() {
        String manufacturer = Build.MANUFACTURER;
        return manufacturer != null && manufacturer.toLowerCase().contains("samsung");
    }

    private void observeData() {
        if (dataObserver == null) {
            dataObserver = new Observer<String>() {
                @Override
                public void onChanged(String data) {
                    Log.d("NativeActivity", "LiveData changed: " + data);
                    // Perform operations based on updated data
                    if(MyNativeModule.IS_CALL_DECLINED){
                        dismissScreen();
                        Log.d("NativeActivity", "dismissScreen" + data);
                        MyNativeModule.IS_CALL_DECLINED = false;
                    }
                }
            };
        }
        MyNativeModule.getLiveData().observe(this, dataObserver);
    }

    @Override
    protected void onResume() {
        super.onResume();
        handleIncomingCall();
        Log.d("NativeActivity", "onResume Observer");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopVibration();
        stopRingtone();
        if (dataObserver != null) {
            Log.d("NativeActivity", "onDestroy Observer");
            MyNativeModule.getLiveData().removeObserver(dataObserver);
            dataObserver = null;
        }
    }

    public void handleIncomingCall() {
        AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        int ringerMode = audioManager.getRingerMode();

        // Handle based on the ringer mode
        switch (ringerMode) {
            case AudioManager.RINGER_MODE_SILENT:
                Log.d("RingerMode", "Device is in Silent mode.");
                // Optionally, vibrate or notify the user some other way
                break;
                
            case AudioManager.RINGER_MODE_VIBRATE:
                Log.d("RingerMode", "Device is in Vibrate mode.");
                long[] vibrationPattern = new long[]{0, 1000, 500, 1000};
                startVibration(vibrationPattern);
                break;

            case AudioManager.RINGER_MODE_NORMAL:
                Log.d("RingerMode", "Device is in Normal (Ringing) mode.");
                playRingtone();
                break;

            default:
                Log.d("RingerMode", "Unknown ringer mode.");
        }
    }

    
    private void startVibration(long[] pattern) {
        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (vibrator != null) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1)); // -1 means no repeat
            }
        } else {
            if (vibrator != null) {
                vibrator.vibrate(pattern, -1); // -1 means no repeat for older versions
            }
        }
    }

    private void stopVibration() {
        if (vibrator != null) {
            vibrator.cancel(); // Stop the vibration
        }
    }

    private void playRingtone() {
        Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        ringtone = RingtoneManager.getRingtone(getApplicationContext(), notification);
        if (ringtone != null) {
            ringtone.play();
        }
    }

    private void stopRingtone() {
        if (ringtone != null) {
            ringtone.stop(); // Stop the ringtone
        }
    }



    private void callReactNativeMethodForCall(boolean isAcceptCall) {
        try {

            ReactInstanceManager reactInstanceManager = ((MainApplication) getApplication()).getReactNativeHost()
                    .getReactInstanceManager();
            if (reactInstanceManager.hasStartedCreatingInitialContext()) {
                Log.i("NativeActivity", "hasStartedCreatingInitialContext");

                ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
                if (reactContext != null) {
                    nativeCallModule = reactContext.getNativeModule(MyNativeModule.class);
                    if (nativeCallModule != null) {
                        if(isAcceptCall){
                            nativeCallModule.acceptCall();
                        }else{
                            nativeCallModule.declineCall();
                        }
                        finish();
                        MyNativeModule.IS_CALL_DECLINED = false;
                        MyNativeModule.IS_CALL_DECLINED_NATIVEACTIVITY = true;
                        Log.d("NativeActivity", "MyNativeModule initialized successfully");
                    } else {
                        Log.e("NativeActivity", "Failed to initialize MyNativeModule");
                    }
                } else {
                    reactInstanceManager.createReactContextInBackground();
                    Log.e("NativeActivity", "React context is null");
                }
            } else {
                Log.i("NativeActivity", "React started creating initial context");
                reactInstanceManager
                        .addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                            @Override
                            public void onReactContextInitialized(ReactContext context) {
                                Log.i("NativeActivity", "React context initialized");
                                nativeCallModule = context.getNativeModule(MyNativeModule.class);
                                Log.i("NativeActivity", "nativeCallModule instance obtained");
                                if (nativeCallModule != null) {
                                    nativeCallModule.acceptCall();
                                    finish();
                                    Log.d("NativeActivity", "MyNativeModule initialized successfully");
                                } else {
                                    Log.e("NativeActivity", "Failed to initialize MyNativeModule");
                                }
                            }
                        });
            }
        } catch (Exception e) {
            Log.e("NativeActivity-error", e.toString());
        }
    }
}
