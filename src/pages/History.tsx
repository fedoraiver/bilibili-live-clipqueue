import { useState, useEffect } from "react";
import Button from "../components/Button";
import HistortyVideo from "../components/HistoryVideo";

function Histroty() {
  const [historyVideos, setHistoryVideos] = useState([]);

  const handleClearClick = () => {
    localStorage.setItem("history", JSON.stringify([]));
    setHistoryVideos([]);
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    setHistoryVideos(history);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {historyVideos.length ? (
          historyVideos.map((bvid) => (
            <HistortyVideo key={bvid} bvid={(bvid as string).substring(1)} />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>暂无历史记录</p>
        )}
      </div>

      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #eee",
          paddingTop: "10px",
          backgroundColor: "#fff",
        }}
      >
        <Button ButtonName="清空历史" ClickHandler={handleClearClick} />
      </div>
    </div>
  );
}

export default Histroty;
