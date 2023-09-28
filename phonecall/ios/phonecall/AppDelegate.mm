#import "AppDelegate.h"
#import "RNCallKeep.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <PushKit/PushKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import "RNVoipPushNotificationManager.h"

#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


@implementation AppDelegate



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"phonecall";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  [RNVoipPushNotificationManager voipRegistration];
  
  // Define UNUserNotificationCenter
  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    // Enable or disable features based on authorization.
  }];
  
  
  
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"phonecall" initialProperties:nil];
  
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}


- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

// --- Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];

    // Retrieve information like handle and callerName here
     NSString *uuid = [[[NSUUID UUID] UUIDString] lowercaseString];
     NSString *callerName = @"caller name here";
     NSString *handle = @"caller number here";
     NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */

    [RNCallKeep reportNewIncomingCall: uuid
                               handle: handle
                           handleType: @"generic"
                             hasVideo: NO
                  localizedCallerName: callerName
                      supportsHolding: YES
                         supportsDTMF: YES
                     supportsGrouping: YES
                   supportsUngrouping: YES
                          fromPushKit: YES
                              payload: extra
                withCompletionHandler: completion];
  
  

  // Handl
  
  //
  //    NSString *uuid = payload.dictionaryPayload[@"uuid"];
  //    NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  //    NSString *handle = payload.dictionaryPayload[@"handle"];
  //
  //    // --- this is optional, only required if you want to call `completion()` on the js side
  //    [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];
  //
  //    // --- Process the received push
  //    [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  //
  //    [RNCallKeep reportNewIncomingCall: uuid
  //                                 handle: handle
  //                             handleType: @"generic"
  //                               hasVideo: NO
  //                    localizedCallerName: callerName
  //                        supportsHolding: YES
  //                           supportsDTMF: YES
  //                       supportsGrouping: YES
  //                     supportsUngrouping: YES
  //                            fromPushKit: YES
  //                                payload: nil
  //                  withCompletionHandler: completion];
  
  
  //      NSString *uuid = [[NSUUID UUID] UUIDString];
  //      NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
  //      [dict setObject:uuid forKey:@"uuid"];
  //
  //    // --- You should make sure to report to callkit BEFORE execute `completion()`
  //    if ([[CXCallObserver alloc] init].calls.count == 0) {
  //      // --- Process the received push
  //      [[NSNotificationCenter defaultCenter] postNotificationName:@"voipRemoteNotificationReceived" object:self userInfo:dict];
  ////      [RNCallKeep reportNewIncomingCall:uuid handle:@"Stringee" handleType:@"generic" hasVideo:true localizedCallerName:@"Connecting..." fromPushKit: YES payload:nil];
  //
  //      NSString *uuid = payload.dictionaryPayload[@"uuid"];
  //      NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  //      NSString *handle = payload.dictionaryPayload[@"handle"];
  //      [RNCallKeep reportNewIncomingCall: @"cb499f3e-1521-4467-a51b-ceea76ee92b6"
  //                                   handle: handle
  //                               handleType: @"generic"
  //                                 hasVideo: NO
  //                      localizedCallerName: @"TEST"
  //                          supportsHolding: YES
  //                             supportsDTMF: YES
  //                         supportsGrouping: YES
  //                       supportsUngrouping: YES
  //                              fromPushKit: YES
  //                                  payload: nil
  //                    withCompletionHandler: completion];
  //
  //
  //      } else {
  //      // Show fake call
  ////      [RNCallKeep reportNewIncomingCall:uuid handle:@"Stringee" handleType:@"generic" hasVideo:true localizedCallerName:@"FakeCall" fromPushKit: YES payload:nil];
  //      [RNCallKeep endCallWithUUID:uuid reason:1];
  //    }
  
  //  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  //  NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  //  NSString *handle = payload.dictionaryPayload[@"handle"];
  //  NSString *callData = payload.dictionaryPayload[@"callData"];
  //
  //  // --- this is optional, only required if you want to call `completion()` on the js side
  //  [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];
  //
  //  // --- Process the received push
  //  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  //
  //  // --- You should make sure to report to callkit BEFORE execute `completion()`
  //  [RNCallKeep reportNewIncomingCall: uuid
  //                             handle: handle
  //                         handleType: @"generic"
  //                           hasVideo: true
  //                localizedCallerName: callerName
  //                    supportsHolding: false
  //                       supportsDTMF: false
  //                   supportsGrouping: false
  //                 supportsUngrouping: false
  //                        fromPushKit: YES
  //                            payload: callData
  //              withCompletionHandler: nil];
  //
  
  // --- You don't need to call it if you stored `completion()` and will call it on the js side.
  completion();
  
}


//
//- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
//  // Process the received push
//  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
//
////   Retrieve information like handle and callerName here
//   NSString *uuid = [[[NSUUID UUID] UUIDString] lowercaseString];
//   NSString *callerName = @"caller name here";
//   NSString *handle = @"caller number here";
//   NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */
//
//  [RNCallKeep reportNewIncomingCall: uuid
//                             handle: handle
//                         handleType: @"generic"
//                           hasVideo: NO
//                localizedCallerName: callerName
//                    supportsHolding: YES
//                       supportsDTMF: YES
//                   supportsGrouping: YES
//                 supportsUngrouping: YES
//                        fromPushKit: YES
//                            payload: extra
//              withCompletionHandler: completion];
//}
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
{
  return [RNCallKeep application:application
            continueUserActivity:userActivity
              restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
