import { useEffect, useState } from "react";

export function useShortcutKey() {
	const [shortcutKey, setShortcutKey] = useState("");
	
	useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Win") || userAgent.includes("Linux")) {
      setShortcutKey("Shift + Enter");
    } else if (userAgent.includes("Mac")) {
      setShortcutKey("Shift + Return");
    } else {
      setShortcutKey("");
    }
  }, []);

	return { shortcutKey };
}
