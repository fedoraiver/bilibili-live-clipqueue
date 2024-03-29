export function GetActions(StreamerBotHttpServerUrl: string) {
  fetch(`${StreamerBotHttpServerUrl}/GetActions`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("actions", JSON.stringify(data.actions));
    })
    .catch((e) => console.error("GetActions Error:", e));

  return () => {
    console.log("http service for streamer.bot shutdown");
  };
}

export function DoAction(
  StreamerBotHttpServerUrl: string,
  name: string,
  data: any
) {
  fetch(`${StreamerBotHttpServerUrl}/DoAction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: {
        id: JSON.parse(localStorage.getItem("actions") || "[]").find(
          (action: any) => action.name === name
        ).id,
        name: name,
      },
      args: data,
    }),
  }).catch((e) => console.error("DoAction Error:", e));
}

export function CustomScriptAction(
  StreamerBotHttpServerUrl: string,
  CustomScript: string,
  cmd: string,
  JsonData: any
) {
  const lines = CustomScript.split("\n");
  lines.forEach((line) => {
    const [command, action] = line.split(" ");
    if (command === cmd) {
      DoAction(StreamerBotHttpServerUrl, action, JsonData);
    }
  });
}
