import React from "react";
import "./App.css";
const MessageList = React.lazy(() => import("messageList/MessageList"));

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={"Loading ..."}>
        <MessageList />
      </React.Suspense>
    </div>
  );
}

export default App;
