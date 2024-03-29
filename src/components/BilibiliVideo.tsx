interface BiliBiliVideoProps {
  src: string;
}

function BiliBiliVideo({ src }: BiliBiliVideoProps) {
  return (
    <div className="ratio ratio-21x9">
      <iframe
        src={src}
        sandbox="allow-same-origin allow-scripts"
        allowFullScreen
        title="Bilibili video"
      ></iframe>
    </div>
  );
}

export default BiliBiliVideo;
