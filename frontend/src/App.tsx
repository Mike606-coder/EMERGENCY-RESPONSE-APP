/**
 * Application entry point.
 */
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './src/store';
import Navigation from './src/navigation';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
