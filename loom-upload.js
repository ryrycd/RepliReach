import { setup } from "@loomhq/record-sdk";
import { isSupported } from "@loomhq/record-sdk/is-supported";

// Replace this with your actual public app ID from the Loom Developer Portal
const PUBLIC_APP_ID = "YOUR_PUBLIC_APP_ID";
const BUTTON_ID = "loom-upload-button";

(async function initLoomSDK() {
  // 1. Check support
  const { supported, error } = await isSupported();
  if (!supported) {
    console.warn("Loom recordSDK not supported:", error);
    return;
  }

  // 2. Initialize recordSDK
  const { configureButton } = await setup({
    publicAppId: PUBLIC_APP_ID,
    // If you're using a Custom SDK (paid tier), you'd replace publicAppId with jws, mode: 'custom', etc.
  });

  // 3. Attach SDK to button
  const button = document.getElementById(BUTTON_ID);
  if (!button) {
    console.warn(`No button found with ID #${BUTTON_ID}`);
    return;
  }

  const sdkButton = configureButton({ element: button });

  // 4. Listen for "upload-complete" event
  sdkButton.on("upload-complete", (video) => {
    // 5. Copy Loom share link to clipboard
    if (video?.sharedUrl) {
      navigator.clipboard.writeText(video.sharedUrl).then(() => {
        console.log("Copied Loom link to clipboard:", video.sharedUrl);
      });
    } else {
      console.log("No sharedUrl found in Loom video object:", video);
    }
  });
})();
