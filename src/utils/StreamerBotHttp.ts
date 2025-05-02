export function GetActions(StreamerBotHttpServerUrl: string) {
  fetch(`http://${StreamerBotHttpServerUrl}/GetActions`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("actions", JSON.stringify(data.actions));
    })
    .catch((e) => console.error( e));

  return () => {
    console.log("http service for streamer.bot shutdown");
  };
}

export function DoAction(
  StreamerBotHttpServerUrl: string,
  name: string,
  data: any
) {
  fetch(`http://${StreamerBotHttpServerUrl}/DoAction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: {
        id: JSON.parse(localStorage.getItem("actions") || "[]").find(
          (action: any) => action.name == name
        ).id,
        name: name,
      },
      args: data,
    }),
  }).catch((e) => console.error( e));
}

export function CustomScriptAction(
  StreamerBotHttpServerUrl: string,
  CustomScript: string,
  cmd: string,
  JsonData: any
) {
  const lines = CustomScript.split("\n");
  lines.forEach((line, index) => {
    const parts = line.trim().split(/\s+/); // 使用正则处理多个空格
    if (parts.length < 2) {
      console.warn(`Line ${index + 1} skipped: invalid format "${line}"`);
      return; // 跳过格式不对的行
    }

    const [command, action] = parts;
    if (command == cmd) {
      DoAction(StreamerBotHttpServerUrl, action, JsonData);
    }
  });
}