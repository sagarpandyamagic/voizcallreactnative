import { NativeModules } from 'react-native';

const { MyNativeModule } = NativeModules;

export const requestOverlayPermission = () => {
  return MyNativeModule.requestOverlayPermission();
};

export const hasOverlayPermission = () => {
  return MyNativeModule.hasOverlayPermission();
};
