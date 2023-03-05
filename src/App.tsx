import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import { getAuth, signInAnonymously } from "firebase/auth";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import FinderView from './pages/HomeFinder/FinderView';

function App() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      //TODO
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // ...
    });

  return (
    <Fragment>
      <Provider store={store}>
        <FinderView />
      </Provider>
    </Fragment>
  );
}

export default App;
