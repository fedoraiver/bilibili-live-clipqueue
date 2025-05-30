import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { KeepLiveWS } from "bilibili-live-ws/browser";
import ClipQueue from "./class/ClipQueue";
import NavBar from "./components/NavBar";
import Queue from "./pages/Queue";
import Home from "./pages/Home";
import History from "./pages/History";
import Error from "./pages/Error";
import { getOpenData } from "./utils/BilibiliOpenLive";
import { GetActions } from "./utils/StreamerBotHttp";

export const DataContext = createContext<Data | null>(null);
export interface Data {
  AKId: string;
  setAKId: (AKId: string) => void;
  AKSecret: string;
  setAKSecret: (AKSecret: string) => void;
  AppId: string;
  setAppId: (AppId: string) => void;
  AuthCode: string;
  setAuthCode: (Authcode: string) => void;
  ClipLimit: string;
  setClipLimit: (ClipLimit: string) => void;
  StreamerBotHttpServerUrl: string;
  setStreamerBotHttpServerUrl: (StreamerBotHttpServerUrl: string) => void;
  CustomScript: string;
  setCustomScript: (CustomScript: string) => void;
  IsRunning: boolean;
  setIsRunning: (IsRunning: boolean) => void;
  Autoplay: boolean;
  setAutoplay: (Autoplay: boolean) => void;
  MyClipQueue: ClipQueue;
  live: KeepLiveWS;
}

function App() {
  let MyClipQueue = new ClipQueue(0);
  const [live, setLive] = useState<KeepLiveWS>(new KeepLiveWS(0));
  const [AKId, setAKId] = useState(localStorage.getItem("AKId") || "");
  const [AKSecret, setAKSecret] = useState(
    localStorage.getItem("AKSecret") || ""
  );
  const [AppId, setAppId] = useState(localStorage.getItem("AppId") || "");
  const [AuthCode, setAuthCode] = useState(
    localStorage.getItem("AuthCode") || ""
  );
  const [ClipLimit, setClipLimit] = useState(
    localStorage.getItem("ClipLimit") || ""
  );
  const [StreamerBotHttpServerUrl, setStreamerBotHttpServerUrl] = useState(
    localStorage.getItem("StreamerBotHttpServerUrl") || ""
  );
  const [CustomScript, setCustomScript] = useState(
    localStorage.getItem("CustomScript") || ""
  );
  const [IsRunning, setIsRunning] = useState(
    localStorage.getItem("IsRunning") == "true" ? true : false
  );
  const [Autoplay, setAutoplay] = useState(
    localStorage.getItem("Autoplay") == "true" ? true : false
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    GetActions(StreamerBotHttpServerUrl);
  }, [StreamerBotHttpServerUrl]);

  useEffect(() => {
    let cleanupHeartBeat = () => {};
    let retryTimeout: NodeJS.Timeout | null = null;
    let stopped = false;

    const connect = async () => {
      if (stopped) return; // 如果 useEffect 被清除，不再尝试

      try {
        const { data, clearHeartBeat } = await getOpenData(
          AKId || "",
          AKSecret || "",
          parseInt(AppId || ""),
          AuthCode || "",
          (success) => {
            if (!stopped) setIsConnected(success);
          }
        );

        // 成功后设置心跳清理函数
        cleanupHeartBeat = clearHeartBeat;

        const newlive = new KeepLiveWS(data.anchor_info.room_id, {
          address: data.websocket_info.wss_link[0],
          authBody: JSON.parse(data.websocket_info.auth_body),
        });
        newlive.interval = 1000;
        if (!stopped) setLive(newlive);
      } catch (err: any) {
        if (!stopped) {
          setIsConnected(false);
          console.error(err);

          const shouldRetry =
            err.message == "7001" ||
            err.message == "7002" ||
            err.message == "4004";
          if (shouldRetry) {
            console.log("10秒后尝试重连...");
            retryTimeout = setTimeout(connect, 10 * 1000);
          } else {
            console.log("密码错误");
          }
        }
      }
    };

    connect(); // 初始连接

    return () => {
      console.log("尝试连接");
      cleanupHeartBeat();
      setIsConnected(false);
      stopped = true; // 退出标志
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [AKId, AKSecret, AppId, AuthCode]);

  return (
    <>
      <DataContext.Provider
        value={{
          AKId,
          setAKId,
          AKSecret,
          setAKSecret,
          AppId,
          setAppId,
          AuthCode,
          setAuthCode,
          ClipLimit,
          setClipLimit,
          StreamerBotHttpServerUrl,
          setStreamerBotHttpServerUrl,
          CustomScript,
          setCustomScript,
          IsRunning,
          setIsRunning,
          Autoplay,
          setAutoplay,
          MyClipQueue,
          live,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh", // 整个视口高度
            overflow: "hidden", // 隐藏滚动，交给子组件自己处理
          }}
        >
          {/* 顶部固定 NavBar */}
          <NavBar isConnected={isConnected} />

          {/* 主体内容区 */}
          <div
            style={{
              flex: 1, // 填满 NavBar 以外的所有空间
              overflow: "hidden", // 子组件内自己做滚动
            }}
          >
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default App;
