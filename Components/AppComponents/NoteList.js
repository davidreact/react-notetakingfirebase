import React, { useState, useEffect } from "react";
import firebase from "../../Services/firebase";
import SelectOptions from "./SelectOptions";
import RenderNotes from "./RenderNotes";
import { CSSTransition } from "react-transition-group";

function useGetList({ user, collection }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(collection)
      .where("uid", "==", user.uid)
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          fid: doc.id,
          ...doc.data()
        }));

        setList(list);
      });

    return () => unsubscribe();
  }, []);

  return list;
}

const NoteList = ({
  user,
  categories,
  collection,
  toggleCatList,
  showCatList,
  categorySelected,
  toggleCategorySelected
}) => {
  const list = useGetList({ user, collection });
  const [filteredList, setFilteredList] = useState([]);
  // const [categorySelected, setCategorySelected] = useState("");
  // const [showCatList, setShowCatList] = useState(false);
  const categoriesNew = ["All", ...categories, "Done"];

  const orderDesc = (a, b) => {
    const aa = a.title.toLowerCase();
    const bb = b.title.toLowerCase();
    if (aa > bb) return -1;
    if (aa < bb) return 1;
    return 0;
  };

  useEffect(() => {
    if (categorySelected) {
      filteredCategory(categorySelected);
    } else {
      filteredCategory("All");
    }
  }, [list]);

  const filteredCategory = (cat, toggle) => {
    console.log("cat", cat);
    toggleCategorySelected(cat);
    switch (cat) {
      case "All":
        setFilteredList(
          list
            .filter(doc => doc.isDone !== true)
            .sort((a, b) => orderDesc(a, b))
        );
        break;
      case "Done":
        setFilteredList(
          list
            .filter(doc => doc.isDone === true)
            .sort((a, b) => orderDesc(a, b))
        );
        break;
      default:
        setFilteredList(
          list
            .filter(doc => doc.category === cat)
            .sort((a, b) => orderDesc(a, b))
        );
    }

    if (toggle) {
      toggleCatList(!showCatList);
    }
  };

  return (
    <div>
      <CSSTransition
        in={showCatList}
        // in={false}

        timeout={500}
        classNames="list"
        unmountOnExit
      >
        <div
          className="filterbuttons"
          // style={{ display: showCatList ? "flex" : "none" }}
        >
          <SelectOptions
            butClick={filteredCategory}
            cat={categoriesNew}
            cl="button is-info"
            type="button"
            catSelected={categorySelected}
          />
        </div>
      </CSSTransition>
      <div>
        {filteredList.map((note, index) => (
          <RenderNotes
            note={note}
            index={index}
            key={index}
            collection={collection}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
