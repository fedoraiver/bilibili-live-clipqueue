import { useState, useEffect, useContext } from "react";
import { Data } from "../App";
import { DataContext } from "../App";
import BiliBiliVideo from "../components/BilibiliVideo";
import Button from "../components/Button";
import ScoreBoard from "../components/ScoreBoard";
import Switch from "../components/Switch";
import { CustomScriptAction } from "../utils/StreamerBotHttp";

function Queue() {
  let { ClipLimit, IsRunning, setIsRunning, MyClipQueue, live } = useContext(
    DataContext
  ) as Data;
  const [ClipNum, setClipNum] = useState(MyClipQueue.Num());
  const [wssData, setWssData] = useState("{}");
  const [cmd, setCmd] = useState("");
  const [src, setSrc] = useState("");

  MyClipQueue.setCapacity(ClipLimit ? parseInt(ClipLimit) : 0);

  useEffect(() => {
    live.on("heartbeat", () => console.log("running"));
    live.on("msg", (data) => {
      console.log(data);
      setCmd(data.cmd);
      setWssData(JSON.stringify(data.data));
    });
  }, [live]);

  useEffect(() => {
    let JsonData = JSON.parse(wssData);
    let StreamerBotHttpServerUrl =
      localStorage.getItem("StreamerBotHttpServerUrl") || "";
    let CustomScript = localStorage.getItem("CustomScript") || "";
    if (cmd === "LIVE_OPEN_PLATFORM_DM") {
      let msg: string = JsonData.msg;
      if (IsRunning == true) {
        if (
          msg.startsWith("/BV") &&
          !MyClipQueue.has(msg) &&
          !MyClipQueue.isFull()
        ) {
          MyClipQueue.enqueue(msg);
          setClipNum(MyClipQueue.Num());
        } else if (!msg.startsWith("/BV")) {
          CustomScriptAction(
            StreamerBotHttpServerUrl,
            CustomScript,
            cmd,
            JsonData
          );
        }
      }
    } else {
      CustomScriptAction(StreamerBotHttpServerUrl, CustomScript, cmd, JsonData);
    }
  }, [wssData]);

  useEffect(() => {
    setSrc(
      MyClipQueue.getFirst()
        ? "https://player.bilibili.com/player.html?bvid=" +
            MyClipQueue.getFirst()?.substring(1) +
            "&autoplay=0"
        : ""
    );
  }, [ClipNum]);

  return (
    <>
      <BiliBiliVideo src={src}></BiliBiliVideo>
      <Button
        ButtonName="下一个"
        ClickHandler={() => {
          {
            let pastSrc = MyClipQueue.dequeue();
            let history = JSON.parse(localStorage.getItem("history") || "[]");
            if (!history.includes(pastSrc) && pastSrc !== null)
              history.push(pastSrc);
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
      <ScoreBoard
        ClipNum={ClipNum}
        ClipLimit={MyClipQueue.getCapacity()}
      ></ScoreBoard>
    </>
  );
}

export default Queue;
