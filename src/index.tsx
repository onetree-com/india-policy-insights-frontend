import App from "App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "index.scss";
import "./i18n/i18n";
import reportWebVitals from "reportWebVitals";
import GlobalProvider from "context/globalContext";
import TagManager from "react-gtm-module";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const tagManagerArgs = {
  gtmId: "GTM-53LHZGJ",
};
TagManager.initialize(tagManagerArgs);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
