import md5 from "md5";
import { autoGet } from "./request";

/**
 * 鉴权加密
 * @param {*} params
 * @param {string} akId
 * @param {string} akSecret
 * @returns
 */
async function getEncodeHeader(body: any, akId: string, akSecret: string) {
  const timestamp = parseInt(Date.now() / 1000 + "");
  const nonce = parseInt(Math.random() * 100000 + "") + timestamp;
  const header: Record<string, any> = {
    "x-bili-accesskeyid": akId,
    "x-bili-content-md5": md5(body),
    "x-bili-signature-method": "HMAC-SHA256",
    "x-bili-signature-nonce": nonce + "",
    "x-bili-signature-version": "1.0",
    "x-bili-timestamp": timestamp,
  };
  const data = [];
  for (const key in header) {
    data.push(`${key}:${header[key]}`);
  }

  const signature = await getHmacSha256(akSecret, data.join("\n"));
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...header,
    Authorization: signature,
  };
}

/**
 * HMAC-SHA256加密
 * @param {string} key
 * @param {string} message
 * @returns
 */
async function getHmacSha256(key: string, message: string) {
  const encoder = new TextEncoder();
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const START_URL = "https://live-open.biliapi.com/v2/app/start";
const HEARTBEAT_URL = "https://live-open.biliapi.com/v2/app/heartbeat";
// const END_URL = "https://live-open.biliapi.com/v2/app/end";

async function callApi(url: any, data: any, akId: any, akSecret: any) {
  const body = JSON.stringify(data);
  const headers = await getEncodeHeader(body, akId, akSecret);
  return autoGet(url, { method: "POST", headers, body });
}

/**
 * @param {string} akId
 * @param {string} akSecret
 * @param {number} appId
 * @param {string} authCode
 */
export async function getOpenData(
  akId: string,
  akSecret: string,
  appId: number,
  authCode: string,
  onHeartbeat?: (success: boolean) => void
) : Promise<{ data: any; clearHeartBeat: () => void }>{
  const startRes = await callApi(
    START_URL,
    { code: authCode, app_id: appId },
    akId,
    akSecret
  );

  console.log("连接中");
  if (startRes.code != 0) {
    throw new Error(startRes.code);
  }
  const data=startRes.data;
  const gameId = data.game_info.game_id;

   const intervalId = setInterval(async () => {
    try {
      const heartbeatRet = await callApi(
        HEARTBEAT_URL,
        { game_id: gameId },
        akId,
        akSecret
      );

      // console.log(heartbeatRet);
      if (heartbeatRet.code == 0) {
        console.log("连接正常");
        onHeartbeat?.(true);
      } else {
        onHeartbeat?.(false);
        throw new Error(heartbeatRet.code);
      }
    } catch (err) {
      onHeartbeat?.(false);
      throw err;
    }
  }, 30 * 1000);

  // 返回数据和清理函数
  return {
    data,
    clearHeartBeat: () => clearInterval(intervalId),
  };
}
