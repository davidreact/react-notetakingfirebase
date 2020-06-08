import React, { useState } from "react";
import NewNote from "./AppComponents/NewNote";
import NoteList from "./AppComponents/NoteList";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSTransition } from "react-transition-group";

const collection = "notesauth";

const categories = [
  "FruitsVegs",
  "Meat",
  "Fridge",
  "Eggs/Milk",
  "Care",
  "Cleaning",
  "Pasta/Section",
  "Poundland"
];

const App = ({ user }) => {
  const [showNewNote, setShowNewNote] = useState(false);
  const [showCatList, setShowCatList] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");

  return (
    <div className="app">
      <button
        className="button is-info is-light"
        onClick={() => setShowNewNote(!showNewNote)}
      >
        <span className="icon">
          <FontAwesomeIcon
            icon="plus-square"
            className={showNewNote ? "rotate-center" : "rotate-reverse"}
          />
        </span>
        <span>Add New Item</span>
      </button>
      <button
        className={showCatList ? "button is-info" : "button is-info is-light"}
        onClick={() => setShowCatList(!showCatList)}
      >
        <span className="icon">
          <FontAwesomeIcon
            icon="chevron-circle-down"
            className={showCatList ? "rotate-center" : "rotate-reverse"}
          />
        </span>
        <span>View: {categorySelected}</span>
      </button>
      <CSSTransition
        in={showNewNote}
        timeout={500}
        classNames="list"
        unmountOnExit
      >
        <div>
          <NewNote
            user={user}
            categories={categories}
            collection={collection}
          />
        </div>
      </CSSTransition>
      <NoteList
        user={user}
        categories={categories}
        collection={collection}
        toggleCatList={setShowCatList}
        showCatList={showCatList}
        categorySelected={categorySelected}
        toggleCategorySelected={setCategorySelected}
      />

      {console.log("showCatList", showCatList)}
    </div>
  );
};

export default App;
