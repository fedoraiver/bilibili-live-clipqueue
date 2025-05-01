import { useState, useEffect, useContext } from "react";
import { Data } from "../App";
import { DataContext } from "../App";
import BiliBiliVideo from "../components/BilibiliVideo";
import Button from "../components/Button";
import ScoreBoard from "../components/ScoreBoard";
import Switch from "../components/Switch";
import { CustomScriptAction } from "../utils/StreamerBotHttp";

function Queue() {
  let {
    ClipLimit,
    IsRunning,
    setIsRunning,
    Autoplay,
    setAutoplay,
    MyClipQueue,
    live,
  } = useContext(DataContext) as Data;
  const [ClipNum, setClipNum] = useState(MyClipQueue.Num());
  const [wssData, setWssData] = useState("{}");
  const [cmd, setCmd] = useState("");
  const [src, setSrc] = useState("");

  MyClipQueue.setCapacity(ClipLimit ? parseInt(ClipLimit) : 0);

  useEffect(() => {
    const handleMsg = (data: any) => {
      console.log(data);
      setCmd(data.cmd);
      setWssData(JSON.stringify(data.data));
    };

    live.on("msg", handleMsg);

    return () => {
      live.off("msg", handleMsg);
    };
  }, [live]);

  useEffect(() => {
    let JsonData = JSON.parse(wssData);
    let StreamerBotHttpServerUrl =
      localStorage.getItem("StreamerBotHttpServerUrl") || "";
    let CustomScript = localStorage.getItem("CustomScript") || "";
    if (IsRunning == true) {
      if (cmd === "LIVE_OPEN_PLATFORM_DM") {
        let msg: string = JsonData.msg;
        if (
          msg.startsWith("/BV") &&
          !MyClipQueue.has(msg) &&
          !MyClipQueue.isFull()
        ) {
          MyClipQueue.enqueue(msg);
          setClipNum(MyClipQueue.Num());
        }
      }
      CustomScriptAction(StreamerBotHttpServerUrl, CustomScript, cmd, JsonData);
    }
  }, [wssData]);

  useEffect(() => {
    setSrc(
      MyClipQueue.getFirst()
        ? "https://player.bilibili.com/player.html?bvid=" +
            MyClipQueue.getFirst()?.substring(1) +
            "&autoplay=" +
            (Autoplay ? "1" : "0")
        : ""
    );
  }, [ClipNum]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
        paddingRight: "20px",
        paddingBottom: "70px",
        paddingLeft: "20px",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          overflow: "auto",
        }}
      >
        {src ? (
          <BiliBiliVideo src={src} />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>暂无视频</p>
        )}
      </div>
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #eee",
          padding: "10px 20px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: "10px",
        }}
      >
        <Button
          ButtonName="下一个"
          ClickHandler={() => {
            {
              let pastSrc = MyClipQueue.dequeue();
              let history = JSON.parse(localStorage.getItem("history") || "[]");
              if (!history.includes(pastSrc) && pastSrc !== null) {
                history.push(pastSrc);
              }
              setClipNum(MyClipQueue.Num());
              localStorage.setItem("history", JSON.stringify(history));
            }
          }}
        ></Button>
        <Switch
          SwitchName="运行"
          Checked={IsRunning}
          ClickHandler={(value) => {
            setIsRunning(value);
            localStorage.setItem("IsRunning", value.toString());
          }}
        ></Switch>
        <Switch
          SwitchName="自动播放"
          Checked={Autoplay}
          ClickHandler={(value) => {
            setAutoplay(value);
            localStorage.setItem("Autoplay", value.toString());
          }}
        ></Switch>
        <ScoreBoard
          ClipNum={ClipNum}
          ClipLimit={MyClipQueue.getCapacity()}
        ></ScoreBoard>
      </div>
    </div>
  );
}

export default Queue;
