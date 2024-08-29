package com.voizcallreactnative;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import io.wazo.callkeep.RNCallKeepModule;
import android.telecom.TelecomManager;
import android.content.Context;
import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen; // here
import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
import android.view.WindowManager;
import android.app.KeyguardManager;
import android.os.Build;

public class MainActivity extends ReactActivity {

  private ReactActivity reactContext;

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "voizcallreactnative";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this); // here
    // getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
    // WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
    // WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
    // WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
    //   setShowWhenLocked(true);
    //   setTurnScreenOn(true);

    //   KeyguardManager keyguardManager = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
    //   if (keyguardManager != null) {
    //     keyguardManager.requestDismissKeyguard(this, null);
    //   }
    // } else {
    //   getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
    //       | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
    //       | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
    // }

    // // Add these flags for all Android versions
    // getWindow().addFlags(WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON);

    // // Disable the default lock screen
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    //   ((KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE)).requestDismissKeyguard(this, null);
    // }
    // ;

    super.onCreate(savedInstanceState);
  }

  // @Override
  //   protected void onResume() {
  //       super.onResume();
  //       // Reapply the flags in case they were cleared
  //       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
  //           setShowWhenLocked(true);
  //           setTurnScreenOn(true);
  //       } else {
  //           getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
  //                   | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
  //                   | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
  //       }
  //       getWindow().addFlags(WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON);
  //   }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    if (grantResults.length > 0) {
      switch (requestCode) {
        case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
          RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
          break;
      }
    }
  }

}
