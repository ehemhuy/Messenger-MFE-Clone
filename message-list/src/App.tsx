import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ChannelList, SendBirdProvider } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";

function App() {
  return (
    <div className="App">
      <SendBirdProvider
        appId={process.env.SB_APP_ID || ""}
        userId={process.env.SB_USER_ID || ""}
        accessToken={process.env.SB_ACCESS_TOKEN || ""}
      >
        <ChannelList
          onChannelSelect={(channel) => {
            history.replaceState(
              null,
              "",
              window.location.origin +
                `${channel?.url ? `?url=${channel.url}` : ""}`
            );
          }}
        />
      </SendBirdProvider>
    </div>
  );
}

export default App;
