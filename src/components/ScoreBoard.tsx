interface ScoreBoardProps {
  ClipNum: number;
  ClipLimit: number;
}

function ScoreBoard({ ClipNum, ClipLimit }: ScoreBoardProps) {
  return (
    <p>
      {ClipNum}/{ClipLimit}
    </p>
  );
}

export default ScoreBoard;
