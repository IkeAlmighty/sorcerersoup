import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { logToLocalHistory } from "../../lib/hooks/react-localhistory";
import useSocket from "../../lib/hooks/socketio";

import ItemCreator from "../../components/ItemCreator";
import CharacterCreator from "../../components/CharacterCreator";
import SpellCreator from "../../components/SpellCreator";
import Character from "../../components/Character";
import Notes from "../../components/Notes";
import Rules from "../../components/Rules";

import Menu from "../../components/Menu";
import MenuItem from "../../components/MenuItem";
import SearchBox from "../../components/SearchBox";

const VIEWS = {
  CHARACTER_CREATOR: 0,
  ITEM_CREATOR: 1,
  NOTES: 2,
  RULES: 3,
  SPELL_CREATOR: 4,
  CHARACTER: 5,
};

export default function GameTerminal({ gameData }) {
  useEffect(logToLocalHistory, []);
  const socketio = useSocket("gameterminals");

  const [allGameCharacters, setAllGameCharacters] = useState([]);

  const [currentlyViewedCharacter, setCurrentlyViewedCharacter] = useState({});

  const [view, setView] = useState(VIEWS.RULES);

  // character search box states
  const [characterSearchFragment, setCharacterSearchFragment] = useState("");
  const [characterSearchResults, setCharacterSearchResults] = useState([]);
  function updateCharacterSearchResults(searchFragment) {
    setCharacterSearchFragment(searchFragment);

    // hit up backend for characters in this game terminal that match
    // the fragment
    async function fetchAndSetCharacterSearchResults() {
      const apiCharacterSearchResponse = await fetch(
        `/api/characters/matchFieldFragment?field=name&gameTerminalId=${gameData._id}`
      );

      const matches = await apiCharacterSearchResponse.json();
      setCharacterSearchResults(matches);
    }
    fetchAndSetCharacterSearchResults();
  }

  useEffect(() => {
    async function fetchAndSetAllCharacters() {
      const apiAllCharactersResponse = await fetch(
        `/api/characters/all?gameTerminalId=${gameData._id}`
      );
    }
  }, []);

  return (
    <div>
      {/* Game Link Copier and Display */}
      <div className="text-sm mx-1 mb-10">
        _id:
        <span
          className="text-blue-600 cursor-pointer mx-2"
          onClick={() => {
            copy(document.location); // copy to clipboard if pressed
            toast("Game Link Copied to Clipboard!", {
              autoClose: 900,
              hideProgressBar: true,
            });
          }}
        >
          {gameData._id}
        </span>
      </div>

      <div className="flex">
        <div className="grow p-3">
          {/* Character View */}
          {view === VIEWS.CHARACTER && <div></div>}
          {/* Character Creator View */}
          {view === VIEWS.CHARACTER_CREATOR && (
            <CharacterCreator onCreate={() => {}} gameData={gameData} />
          )}
          {/* Item Creator View */}
          {view === VIEWS.ITEM_CREATOR && <ItemCreator />}
          {/* Spell Creator View */}
          {view === VIEWS.SPELL_CREATOR && <SpellCreator />}
          {/* Notes View */}
          {view === VIEWS.NOTES && <Notes />}
          {/* Rules View */}
          {view === VIEWS.RULES && <Rules />}
        </div>

        {/* A slide out menu used to switch between views within the GM terminal */}
        <Menu className="flex-none xl:fixed w-[200px]">
          <MenuItem label="Notes" onClick={() => setView(VIEWS.NOTES)} />
          <MenuItem label="Rules" onClick={() => setView(VIEWS.RULES)} />
          <MenuItem
            label="Spell Creator"
            onClick={() => setView(VIEWS.SPELL_CREATOR)}
          />
          <MenuItem
            label="Item Creator"
            onClick={() => setView(VIEWS.ITEM_CREATOR)}
          />
          <MenuItem
            label="Character Creator"
            onClick={() => setView(VIEWS.CHARACTER_CREATOR)}
          />

          <hr />

          <SearchBox
            label=""
            searchFragment={characterSearchFragment}
            onFragmentChange={(frag) => updateCharacterSearchResults(frag)}
            searchResults={characterSearchResults}
            onSelect={(character) => setCurrentlyViewedCharacter(character)}
          />

          {allGameCharacters.map((character) => (
            <MenuItem
              onClick={setCurrentlyViewedCharacter(character)}
              label={character.name}
            />
          ))}
        </Menu>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  let gameData = null;

  try {
    const client = await clientPromise;

    if (query._id) {
      gameData = await client
        .db()
        .collection("gameterminals")
        .findOne({ _id: ObjectId(query._id) });
    }

    // if no id was given or the gameData does not exist,
    // then create the character and rerun this function with
    // the query _id value set:
    if (!gameData) {
      const mongoInsertResponse = await client
        .db()
        .collection("gameterminals")
        .insertOne({});

      return {
        redirect: {
          destination: `/gameterminal?_id=${mongoInsertResponse.insertedId.toString()}`,
        },
      };
    }
  } catch (err) {
    return { redirect: { destination: "/dberror" } };
  }

  // return the gameData, with the _id property converted
  // to a serializable string:
  gameData._id = gameData._id.toString();
  return { props: { gameData } };
}
