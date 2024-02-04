import React from "react";
import styles from "./App.module.css";
const MessageList = React.lazy(() => import("messageList/MessageList"));
const Chat = React.lazy(() => import("chat/Chat"));

function App() {
  return (
    <div className={styles.App}>
      <React.Suspense fallback={"Loading ..."}>
        <div className={styles.MessageList}>
          <MessageList />
        </div>
      </React.Suspense>
      <React.Suspense fallback={"Loading ..."}>
        <div className={styles.Chat}>
          <Chat />
        </div>
      </React.Suspense>
    </div>
  );
}

export default App;
