#import "AppDelegate.h"
#import "RNCallKeep.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <PushKit/PushKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import "RNVoipPushNotificationManager.h"
#import <Firebase/Firebase.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"voizcallreactnative";
  self.initialProps = @{};

  [FIRApp configure];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  [RNVoipPushNotificationManager voipRegistration];
  
  [application registerForRemoteNotifications];

  [RNCallKeep setup:@{
    @"appName": @"voizcallreactnative",
    @"maximumCallGroups": @3,
    @"maximumCallsPerCallGroup": @1,
    @"supportsVideo": @YES,
  }];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"voizcallreactnative"
                                            initialProperties:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
//  [self requestNotificationPermission];

  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [FIRMessaging messaging].APNSToken = deviceToken;
}

- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type {}

- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  
 // [self scheduleLocalNotification];
  
  NSLog(@"Received incoming push notification with payload: %@", payload.dictionaryPayload);
  
  NSDictionary *payloadDict = payload.dictionaryPayload;
  NSDictionary *apsDict = payloadDict[@"aps"];
  NSDictionary *alertDict = apsDict[@"alert"];
  
  NSString *title = alertDict[@"title"];
  NSString *subtitle = alertDict[@"body"];
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
}

- (void)requestNotificationPermission {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
                          completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            NSLog(@"Notification permission granted");
        } else {
            NSLog(@"Notification permission denied");
        }
    }];
}
- (void)scheduleLocalNotification {
    // Create the content for the notification
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = @"Incoming Call";
    content.body = @"You have a new incoming call.";
    content.sound = [UNNotificationSound defaultSound];
    
    // Optionally, add custom data (userInfo) to the notification
    content.userInfo = @{@"type": @"incoming_call", @"caller": @"John Doe"};
    
    // Set the trigger for the notification (e.g., 5 seconds from now)
    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:5 repeats:NO];
    
    // Create a request with a unique identifier
    NSString *identifier = @"LocalNotification";
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier content:content trigger:trigger];
    
    // Schedule the notification with the system
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"Error scheduling local notification: %@", error);
        } else {
            NSLog(@"Local notification scheduled successfully");
        }
    }];
}

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

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
