#import "AppDelegate.h"
#import "RNCallKeep.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <PushKit/PushKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import "RNVoipPushNotificationManager.h"
#import <Firebase/Firebase.h>
#import <React/RCTLinkingManager.h>

#if DEBUG
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif


@implementation AppDelegate



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"phonecall";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  
  
  //  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  //
  //  [RNVoipPushNotificationManager voipRegistration];
  
  //  [RNCallKeep setup:@{
  //      @"appName": @"Awesome App",
  //      @"maximumCallGroups": @3,
  //      @"maximumCallsPerCallGroup": @1,
  //      @"supportsVideo": @NO,
  //    }];
  
  //    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
  //                                                     moduleName:@"phonecall"
  //                                              initialProperties:nil];
  //
  
  // Define UNUserNotificationCenter
  //  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
  //  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
  //                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
  //    // Enable or disable features based on authorization.
  //  }];
  //
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"phonecall" initialProperties:nil];
  //
  //  [self.window addSubview:rootView];
  
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"phonecall" initialProperties:nil];
  
  
  
  //#if DEBUG
  //  InitializeFlipper(application);
  //#endif
  //
  //  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
  //                                                   moduleName:@"phonecall"
  //                                            initialProperties:nil];
  //
  //  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  //
  //  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //  UIViewController *rootViewController = [UIViewController new];
  //  rootViewController.view = rootView;
  //  self.window.rootViewController = rootViewController;
  //  [self.window makeKeyAndVisible];
  
  [FIRApp configure];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  [RNVoipPushNotificationManager voipRegistration];
  
  //Add these Lines
  [RNCallKeep setup:@{
    @"appName": @"phonecall",
    @"maximumCallGroups": @3,
    @"maximumCallsPerCallGroup": @1,
    @"supportsVideo": @YES,
  }];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"phonecall"
                                            initialProperties:nil];
  
  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [UIDevice currentDevice].proximityMonitoringEnabled = YES;
  
  
  return YES; //[super application:application didFinishLaunchingWithOptions:launchOptions];
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
  
  
  //  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  
  // Retrieve information like handle and callerName here
  //  NSString *uuid = [[[NSUUID UUID] UUIDString] lowercaseString];
  //  NSString *callerName = @"caller name here";
  //  NSString *handle = @"caller number here";
  //  NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */
  //
  //  [RNCallKeep reportNewIncomingCall: @"cb499f3e-1521-4467-a51b-ceea76ee9666"
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
  
  //  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  //   NSString *callerName = [NSString stringWithFormat:@"%@ phonecall", payload.dictionaryPayload[@"callerName"]];
  //   NSString *handle = payload.dictionaryPayload[@"handle"];
  
  // --- this is optional, only required if you want to call `completion()` on the js side
  //   [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];
  
  // --- Process the received push
  //   [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  //  NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"];
  
  //  [RNCallKeep reportNewIncomingCall: uuid
  //                                handle: handle
  //                            handleType: @"generic"
  //                              hasVideo: YES
  //                   localizedCallerName: callerName
  //                       supportsHolding: YES
  //                          supportsDTMF: YES
  //                      supportsGrouping: YES
  //                    supportsUngrouping: YES
  //                           fromPushKit: YES
  //                               payload: nil
  //                 withCompletionHandler: completion];
  //
  
  
  NSLog(@"Received incoming push notification with payload: %@", payload.dictionaryPayload);
  
  NSDictionary *payloadDict = payload.dictionaryPayload;
  
  NSDictionary *apsDict = payloadDict[@"aps"];
  NSDictionary *alertDict = apsDict[@"alert"];
  
  NSString *title = alertDict[@"title"];
  NSString *subtitle = alertDict[@"subtitle"];
  NSString *body = alertDict[@"body"];
  
  NSUUID *uuid = [NSUUID UUID];
  NSString *uuidString = [uuid UUIDString];

  
  [RNVoipPushNotificationManager addCompletionHandler:uuidString completionHandler:completion];
  
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  
  
  [RNCallKeep reportNewIncomingCall: uuidString
                             handle: subtitle
                         handleType: @"number"
                           hasVideo: NO
                localizedCallerName: subtitle
                    supportsHolding: YES
                       supportsDTMF: YES
                   supportsGrouping: YES
                 supportsUngrouping: YES
                        fromPushKit: YES
                            payload: nil
              withCompletionHandler: completion];
  
  
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

//Add below delegate to allow deep linking
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}



@end
