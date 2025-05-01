import UserInput from "../components/UserInput";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
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
        <UserInput></UserInput>
      </div>
    </div>
  );
}

export default Home;
