import { useState, useEffect, useContext } from "react";
import { Data } from "../App";
import { DataContext } from "../App";
import Button from "./Button";

interface HistoryVideoProps {
  bvid: string;
  onRemove: (bvid: string) => void;
}

function HistoryVideo({ bvid, onRemove }: HistoryVideoProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  let { MyClipQueue } = useContext(DataContext) as Data;
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("获取视频信息错误");
        }
        return response.json();
      })
      .then((data) => {
        setTitle(data.data.title);
        setAuthor(data.data.owner.name);
        setCoverUrl(data.data.pic);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bvid]);

  const handleButtonClick = () => {
    MyClipQueue.enqueue(`/${bvid}`);
    setIsRendered(false);
    let history = JSON.parse(localStorage.getItem("history") || "[]");
    history = history.filter((bv: string) => bv != `/${bvid}`);
    localStorage.setItem("history", JSON.stringify(history));
    onRemove(bvid);
  };

  if (!isRendered) {
    return null;
  }

  return (
    <>
      <div
        className="card"
        style={{
          width: "18rem",
          border: "none",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={coverUrl}
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: "10rem", objectFit: "cover" }}
        />
        <div className="card-body" style={{ padding: "10px" }}>
          <h5
            className="card-title"
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            {title}
          </h5>
          <p
            className="card-text"
            style={{ fontSize: "0.8rem", color: "#666" }}
          >
            {author}
          </p>
          <Button ButtonName="加入队列" ClickHandler={handleButtonClick} />
        </div>
      </div>
    </>
  );
}

export default HistoryVideo;
