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
  IsReceived: boolean;
  setIsReceived: (IsReceived: boolean) => void;
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
  const [IsReceived, setIsReceived] = useState(
    localStorage.getItem("IsReceived") == "true" ? true : false
  );

  useEffect(() => {
    GetActions(StreamerBotHttpServerUrl);
  }, [StreamerBotHttpServerUrl]);

  useEffect(() => {
    getOpenData(
      AKId ? AKId : "",
      AKSecret ? AKSecret : "",
      parseInt(AppId ? AppId : ""),
      AuthCode ? AuthCode : ""
    )
      .then((data) => {
        let newlive = new KeepLiveWS(
          data.anchor_info.room_id,
          {
            address: data.websocket_info.wss_link[0],
            authBody: JSON.parse(data.websocket_info.auth_body),
          } || { protover: 3, uid: 0 }
        );
        newlive.interval = 1000;
        setLive(newlive);
      })
      .catch((e) => {
        console.log("getopenData Error:", e);
      });

    return () => {
      console.log("wss service for bilibili-live shutdown");
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
          IsReceived,
          setIsReceived,
          MyClipQueue,
          live,
        }}
      >
        <NavBar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </DataContext.Provider>
    </>
  );
}

export default App;
