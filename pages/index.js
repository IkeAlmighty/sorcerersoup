import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalHistory } from "../lib/hooks/react-localhistory";

export default function Home() {
  const localHistory = useLocalHistory();
  const [characters, setCharacters] = useState([]);

  async function getCharacterNameFromLink(link) {
    const parsed = link.split("?");
    const query = parsed[1];

    const apiResponse = await fetch(`/api/character?${query}`);

    if (apiResponse.status !== 200) return null;

    const character = await apiResponse.json();
    return character.name;
  }

  useEffect(() => {
    if (!localHistory) return;
    const links = localHistory.filter(
      (val, index) => localHistory.indexOf(val) === index
    ); //filters repeated elements out

    async function fetchAndSetCharacters() {
      const _characters = [];

      for (let i = 0; i < links.length; i++) {
        let character = await getCharacterNameFromLink(links[i]);

        if (character) _characters.push(character);
      }

      setCharacters(_characters);
    }

    fetchAndSetCharacters();
  }, [localHistory]);

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
            {characters.map((c) => {
              return <div key={c.query} className=""></div>;
            })}
            {/* {localHistory
              ?.filter((val, index) => localHistory.indexOf(val) === index) //filter repeated elements out
              .map((link) => (
                <div key={link} className="text-sm my-2">
                  <Link href={link}>
                    <a>{getCharacterNameFromLink(link)}</a>
                  </Link>
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
