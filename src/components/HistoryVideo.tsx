import { useState, useEffect, useContext } from "react";
import { Data } from "../App";
import { DataContext } from "../App";
import Button from "./Button";

interface HistortyVideoProps {
  bvid: string;
}

function HistortyVideo({ bvid }: HistortyVideoProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  let { MyClipQueue } = useContext(DataContext) as Data;
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    fetch(
      `https://apiv2.magecorn.com/bilicover/get?type=bv&id=${bvid}&client=2.6.0`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTitle(data.title);
        setAuthor(data.up);
        setCoverUrl(data.url.replace(/^http:/, "https:"));
      })
      .catch((error) => {
        console.error("fetch api.bilibili.com Error:", error);
      });
  }, [bvid]);

  const handleButtonClick = () => {
    MyClipQueue.enqueue(`/${bvid}`);
    setIsRendered(false);
    let history = JSON.parse(localStorage.getItem("history") || "[]");
    history = history.filter((bv: string) => bv !== `/${bvid}`);
    localStorage.setItem("history", JSON.stringify(history));
  };

  if (!isRendered) {
    return null;
  }

  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{author}</h5>
          <p className="card-text">{title}</p>
          <Button ButtonName="加入队列" ClickHandler={handleButtonClick} />
        </div>
      </div>
    </>
  );
}

export default HistortyVideo;
