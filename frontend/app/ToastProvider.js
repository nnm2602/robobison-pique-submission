import React from 'react';
import Toast from 'react-native-toast-message';

const ToastProvider = ({ children }) => (
  <>
    {children}
    <Toast />
  </>
);

export default ToastProvider;
