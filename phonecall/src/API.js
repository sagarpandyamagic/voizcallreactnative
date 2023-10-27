const FCM_SERVER_URL = "http://10.0.2.2:8163/extension/auth";
export const updateCallStatus = async ({ callerInfo, type }) => {
    await fetch(`${FCM_SERVER_URL}/update-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callerInfo,
        type,
      }),
    })
      .then((response) => {
        console.log("##RESP", response);
      })
      .catch((error) => console.error("error", error));
  };