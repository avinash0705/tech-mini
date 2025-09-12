import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { wrapper } from '@store/store';
import '@styles/globals.scss';
import '@styles/variables.css';

function MyApp({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<div>Loading...</div>}>
        <Component {...props.pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
