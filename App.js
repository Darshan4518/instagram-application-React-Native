import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
import AppNavigator from "./AppNavigator";
import SocketConnection from "./socketio/SocketConnection";

const App = () => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketConnection />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
