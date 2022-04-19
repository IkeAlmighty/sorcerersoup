import Link from "next/link";
import { useEffect } from "react";
import { logToLocalHistory, useLocalHistory } from "../lib/react-localhistory";

export default function Home() {
  const localHistory = useLocalHistory();
  return (
    <div className="h-screen">
      <div className="text-center my-6 header">
        <h1>Sorcerer Soup</h1>
        <div>a computer assisted RPG</div>
      </div>

      <div className="my-6 max-w-lg mx-auto translate-y-1/3">
        <div className="text-center">
          <div className="my-6">
            <Link href="/character">
              <button>Create a Character</button>
            </Link>
          </div>
          <div className="my-6">
            <Link href="/gameterminal">
              <button>Create GM Terminal</button>
            </Link>
          </div>

          <div className="my-[200px]">
            <h2>Recently Visited on this Device:</h2>
            {localHistory
              ?.filter((val, index) => localHistory.indexOf(val) === index) //filter repeated elements out
              .map((link) => (
                <div className="text-sm my-2">
                  <Link href={link}>
                    <a>{link}</a>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
