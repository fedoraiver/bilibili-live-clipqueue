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
  let { MyClipQueue } = useContext(DataContext) as Data;
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTitle(data.data.title);
        setAuthor(data.data.owner.name);
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
