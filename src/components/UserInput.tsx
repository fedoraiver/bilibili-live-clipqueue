import { useContext } from "react";
import { Data } from "../App";
import { DataContext } from "../App";
import "./components.css";

function UserInput() {
  let {
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
    MyClipQueue,
  } = useContext(DataContext) as Data;
  return (
    <>
      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">AKId</span>
        <input
          type="password"
          className="form-control"
          placeholder="必填,开放平台-个人资料-access_key_id"
          aria-describedby="addon-wrapping"
          value={AKId}
          onChange={(e) => {
            setAKId(e.target.value);
            localStorage.setItem("AKId", e.target.value);
          }}
        ></input>
      </div>

      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">AKSecret</span>
        <input
          type="password"
          className="form-control"
          placeholder="必填,开放平台-个人资料-access_key_secret"
          aria-describedby="addon-wrapping"
          value={AKSecret}
          onChange={(e) => {
            setAKSecret(e.target.value);
            localStorage.setItem("AKSecret", e.target.value);
          }}
        ></input>
      </div>

      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">AppId</span>
        <input
          type="password"
          className="form-control"
          placeholder="必填,开放平台-我的项目-项目ID"
          aria-describedby="addon-wrapping"
          value={AppId}
          onChange={(e) => {
            setAppId(e.target.value);
            localStorage.setItem("AppId", e.target.value);
          }}
        ></input>
      </div>

      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">身份码</span>
        <input
          type="password"
          className="form-control"
          placeholder="必填,互动应用中心-右下角菜单-身份码"
          aria-describedby="addon-wrapping"
          value={AuthCode}
          onChange={(e) => {
            setAuthCode(e.target.value);
            localStorage.setItem("AuthCode", e.target.value);
          }}
        ></input>
      </div>

      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">
          切片最大数量
        </span>
        <input
          type="number"
          className="form-control"
          placeholder="选填,默认为0"
          aria-describedby="addon-wrapping"
          value={ClipLimit}
          onChange={(e) => {
            if (parseInt(e.target.value) >= 0) {
              setClipLimit(e.target.value);
              MyClipQueue.setCapacity(parseInt(ClipLimit));
              localStorage.setItem("ClipLimit", e.target.value);
            }
          }}
        ></input>
      </div>

      <div className="input-group flex-nowrap UserInputDiv-width">
        <span className="input-group-text UserInputSpan-width">
          HTTP服务器地址
        </span>
        <span className="input-group-text">http://</span>
        <input
          type="text"
          className="form-control"
          placeholder="选填,与streamer.bot配合使用"
          aria-describedby="addon-wrapping"
          value={StreamerBotHttpServerUrl}
          onChange={(e) => {
            setStreamerBotHttpServerUrl(e.target.value);
            localStorage.setItem("StreamerBotHttpServerUrl", e.target.value);
          }}
        ></input>
      </div>

      <div className="mb-3 UserInputTextArea-width">
        <textarea
          className="form-control"
          id="custom-scripts"
          rows={7}
          value={CustomScript}
          placeholder={`选填,与streamer.bot配合使用\n格式:{CMD} {action}\n使用换行分隔\n-----------------------eg-----------------------\nLIVE_OPEN_PLATFORM_DM 弹幕互动\nLIVE_OPEN_PLATFORM_SEND_GIFT 送礼物`}
          onChange={(e) => {
            setCustomScript(e.target.value);
            localStorage.setItem("CustomScript", e.target.value);
          }}
        ></textarea>
      </div>
    </>
  );
}

export default UserInput;
