import "./App.css";
import { SendBirdProvider } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import { ChannelProvider } from "@sendbird/uikit-react/Channel/context";
import ChannelUI from "@sendbird/uikit-react/Channel/components/ChannelUI";
import "./App.css";

function App() {
  var url = new URL(window.location.href);
  console.log(process.env.SB_APP_ID);

  return (
    <div className="App">
      <SendBirdProvider
        appId={process.env.SB_APP_ID || ""}
        userId={process.env.SB_USER_ID || ""}
        accessToken={process.env.SB_ACCESS_TOKEN || ""}
      >
        <ChannelProvider channelUrl={url.searchParams.get("url") || ""}>
          <ChannelUI />
        </ChannelProvider>
      </SendBirdProvider>
    </div>
  );
}

export default App;
