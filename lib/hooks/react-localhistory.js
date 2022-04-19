// CLIENT SIDE ONLY

import { useEffect, useState } from "react";

// private function for accessing the history from local storage
function getLocalHistory() {
  const recentlyVisited = JSON.parse(localStorage.getItem("recentlyVisited"));

  if (!recentlyVisited) localStorage.setItem("recentlyVisited", "[]");

  return recentlyVisited || [];
}

// react friendly function for hooking the local history
export function useLocalHistory() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  return history;
}

export function logToLocalHistory() {
  let history = getLocalHistory();
  const href = document.location.href;
  // add this page to the front of the history, removing previous entries
  history = [href, ...history.filter((link) => link !== href)];
  localStorage.setItem("recentlyVisited", JSON.stringify(history));
}
