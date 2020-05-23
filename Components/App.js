import React, { useState } from "react";
import NewNote from "./AppComponents/NewNote";
import NoteList from "./AppComponents/NoteList";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const showCategoryList = () => {
    setShowCatList(!showCatList);
  };

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

      {showNewNote ? (
        <NewNote user={user} categories={categories} collection={collection} />
      ) : (
        ""
      )}
      <NoteList
        user={user}
        categories={categories}
        collection={collection}
        toggleCatList={showCategoryList}
        showCatList={showCatList}
        categorySelected={categorySelected}
        toggleCategorySelected={setCategorySelected}
      />
    </div>
  );
};

export default App;
