import { useState, useEffect } from "react";
import Button from "../components/Button";
import HistoryVideo from "../components/HistoryVideo";

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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start", // 左对齐
          rowGap: "10px",
          columnGap: "10px",
          alignContent: "flex-start", // 顶部对齐
        }}
      >
        {historyVideos.length > 0 ? (
          historyVideos.map((bvid) => (
            <HistoryVideo
              key={bvid}
              bvid={(bvid as string).substring(1)}
              onRemove={(bv) =>
                setHistoryVideos((prev) =>
                  prev.filter((item) => item !== `/${bv}`)
                )
              }
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666", width: "100%" }}>
            暂无历史记录
          </p>
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
        <Button ButtonName="清空历史" ClickHandler={handleClearClick} />
      </div>
    </div>
  );
}

export default Histroty;
