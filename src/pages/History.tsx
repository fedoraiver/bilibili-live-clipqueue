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
    <>
      <Button ButtonName="清空历史" ClickHandler={handleClearClick}></Button>
      <div>
        {historyVideos.map((bvid) => (
          <HistortyVideo key={bvid} bvid={(bvid as string).substring(1)} />
        ))}
      </div>
    </>
  );
}

export default Histroty;
