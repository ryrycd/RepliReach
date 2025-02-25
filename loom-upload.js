import { setup } from "@loomhq/record-sdk";
import { isSupported } from "@loomhq/record-sdk/is-supported";

const PUBLIC_APP_ID = "YOUR_PUBLIC_APP_ID";
const BUTTON_ID = "loom-upload-button";

(async function initLoomSDK() {
  // 1. Check support
  const { supported, error } = await isSupported();
  console.log("isSupported =>", supported, error);
  if (!supported) {
    console.warn("Loom is not supported:", error);
    return;
  }

  // 2. Setup recordSDK
  let configureButton;
  try {
    const result = await setup({
      publicAppId: PUBLIC_APP_ID,
    });
    configureButton = result.configureButton;
    console.log("Loom setup success");
  } catch (e) {
    console.error("Error in Loom setup:", e);
    return;
  }

  // 3. Attach button
  const button = document.getElementById(BUTTON_ID);
  if (!button) {
    console.warn("No button found with ID:", BUTTON_ID);
    return;
  }

  const sdkButton = configureButton({ element: button });
  console.log("SDK button configured", sdkButton);

  // 4. Log key lifecycle events
  sdkButton.on("start", () => {
    console.log("Recording start event!");
  });

  sdkButton.on("recording-complete", (video) => {
    console.log("Recording complete, but still uploading... Video:", video);
  });

  sdkButton.on("upload-complete", (video) => {
    console.log("Upload complete! The Loom link is:", video.sharedUrl);
  });

  sdkButton.on("lifecycle-update", (state) => {
    console.log("Lifecycle state =>", state);
  });

  // 5. If you want, you can also manually open on click
  //    (But normally it's automatic once configured.)
  // button.addEventListener("click", () => {
  //   sdkButton.openPreRecordPanel();
  // });
})();
