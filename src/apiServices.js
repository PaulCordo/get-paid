const electron = window.require("electron");
const { ipcRenderer } = electron;

export function request(action, content) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(action, (_, err, payload) => {
      err ? reject(err) : resolve(payload);
    });
    ipcRenderer.send(action, content);
  });
}
