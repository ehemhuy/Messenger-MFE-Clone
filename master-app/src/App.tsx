import React from "react";
import "./App.css";
const MessageList = React.lazy(() => import("messageList/MessageList"));
const Chat = React.lazy(() => import("chat/Chat"));

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={"Loading ..."}>
        <MessageList />
      </React.Suspense>
      <React.Suspense fallback={"Loading ..."}>
        <Chat />
      </React.Suspense>
    </div>
  );
}

export default App;
