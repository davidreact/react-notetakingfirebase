import React, { useState, useEffect, useRef } from "react";
import firebase from "../Services/firebase";
import moment from "moment";
import {
  SwipeableList,
  SwipeableListItem,
  ActionAnimations
} from "@sandstreamdev/react-swipeable-list";
import "../swipeable-style.css";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";
import * as itemllist from "../data.json";
const collection = "notesauth";

const categories = [
  "FruitsVegs",
  "Meat",
  "Fridge",
  "Eggs/Milk",
  "Care",
  "Cleaning",
  "Pasta/Section"
];

function useGetList({ user }) {
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

const SelectOptions = ({ cat = [], type, cl, butClick }) => {
  if (type === "options") {
    return cat.length > 0
      ? cat.map((cat, index) => (
          <option key={index} value={cat} className={cl}>
            {" "}
            {cat}
          </option>
        ))
      : "";
  }

  if (type === "button") {
    return cat.length > 0
      ? cat.map((cat, index) => (
          <button
            key={index}
            value={cat}
            className={cl}
            onClick={() => butClick(cat)}
          >
            {cat}
          </button>
        ))
      : "";
  }

  return 1;
};

const RenderNotes = ({ note, index }) => {
  const [readonly, setReadOnly] = useState({ readOnly: true });
  const { title, body, timestamp, category } = note;
  const [tempTitle, setTempTitle] = useState("");
  const [tempBody, setTempBody] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  const [sectionHidden, setSectionHidden] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const inputRef = useRef();

  const handlerDeleteNote = fid => {
    firebase
      .firestore()
      .collection(collection)
      .doc(fid)
      .delete();
  };

  const handlerUpdateNote = fid => {
    setReadOnly({ readOnly: true });
    if (tempTitle || tempBody) {
      firebase
        .firestore()
        .collection(collection)
        .doc(fid)
        .set(
          {
            title: tempTitle,
            body: tempBody,
            category: tempCategory,
            updated: moment().unix()
          },
          { merge: true }
        )
        .then(() => {
          console.log("Document Updated");
          setTempTitle("");
          setTempBody("");
          setSectionHidden(!sectionHidden);
        })
        .catch(error => {
          console.log("Error writing document", error);
        });
    }
  };

  const itemList = (
    <div>
      <div className="noteline">
        <div className="field is-grouped inputwide">
          <div className="control is-expanded">
            <input
              type="text"
              value={!readonly.readOnly ? tempTitle : title}
              {...readonly}
              className={`input ${readonly.readOnly ? "" : "is-primary"}`}
              onChange={e => setTempTitle(e.target.value)}
              onDoubleClick={() => setSectionHidden(!sectionHidden)}
              ref={inputRef}
            />

            <div
              className={`timestamp help ${sectionHidden ? "is-hidden" : ""}`}
              hidden={true}
              value={moment
                .unix(note.timestamp)
                .format("dddd, MMM Do, YYYY h:mm:ss A")}
            >
              {moment
                .unix(note.timestamp)
                .format("dddd, MMM Do, YYYY h:mm:ss A")}
            </div>
          </div>

          <div className="select">
            <select
              id="myList"
              disabled={readonly.readOnly}
              value={!readonly.readOnly ? tempCategory : category}
              onChange={e => setTempCategory(e.target.value)}
            >
              <option />
              <SelectOptions cat={categories} type="options" />
            </select>
          </div>
        </div>
      </div>

      <div hidden={sectionHidden}>
        <textarea
          hidden={true}
          value={!readonly.readOnly ? tempBody : note.body}
          {...readonly}
          placeholder="Type your Notes"
          className={readonly.readOnly ? "" : "edit"}
          onChange={e => setTempBody(e.target.value)}
        />
        <div>
          <button
            className="button is-link"
            onClick={() => {
              if (readonly.readOnly) {
                setReadOnly({ readOnly: false });
                inputRef.current.focus();
                setTempTitle(title);
                setTempBody(body);
                setTempCategory(category);
              }
              if (!readonly.readOnly) {
                setReadOnly({ readOnly: true });
                setTempTitle("");
                setTempBody("");
                setTempCategory("");
              }
            }}
          >
            {readonly.readOnly ? "Edit" : "Discard"}
          </button>
          <button
            className={`button is-link ${readonly.readOnly ? "is-hidden" : ""}`}
            onClick={() => handlerUpdateNote(note.fid)}
            hidden={readonly.readOnly}
          >
            Update
          </button>
          <button
            className="button is-link is-danger"
            onClick={() => handlerDeleteNote(note.fid)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div index={index} className="note">
      <SwipeableList threshold={0.15}>
        <SwipeableListItem
          swipeLeft={{
            content: (
              <div
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  padding: "9px",
                  marginTop: "10px",
                  backgroundColor: "green",
                  textAlign: "right",
                  boxSizing: "border-box"
                }}
              >
                Done
              </div>
            ),
            action: () => console.info("swipe action triggered")
          }}
          swipeRight={{
            content: (
              <div
                style={{
                  backgroundColor: "red",
                  borderRadius: "5px",
                  marginTop: "10px",
                  width: "inherit",
                  textAlign: "left",
                  padding: "8px",
                  boxSizing: "border-box"
                }}
              >
                Delete
              </div>
            ),
            animation: ActionAnimations.RETURN,
            action: () => {
              handlerDeleteNote(note.fid);
              console.log("delete Triggered");
            }
          }}
          onSwipeProgress={progress => {
            console.info(`Swipe progress: ${progress}%`);
            // setOpacity((progress / 100) * 4);
          }}
        >
          <div>{itemList}</div>
        </SwipeableListItem>
      </SwipeableList>
    </div>
  );
};

const NoteList = ({ user }) => {
  const list = useGetList({ user });
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const ordered = list.sort((a, b) => {
      const aa = a.title.toLowerCase();
      const bb = b.title.toLowerCase();
      if (aa > bb) return -1;
      if (aa < bb) return 1;
      return 0;
    });
    setFilteredList(ordered);
  }, [list]);

  const filteredCategory = cat => {
    const catFilter = list.filter(doc => {
      return doc.category === cat;
    });
    setFilteredList(catFilter);
  };

  return (
    <div>
      <div>
        <div className="buttons is-centered filterbuttons">
          <button
            className="button is-small is-info"
            onClick={() => setFilteredList(list)}
          >
            All
          </button>
          <SelectOptions
            butClick={filteredCategory}
            cat={categories}
            cl="button is-small is-link"
            filter={filteredCategory}
            type="button"
          />
          <button className="button is-small is-success">Done</button>
        </div>
      </div>
      {filteredList.map((note, index) => (
        <RenderNotes note={note} index={index} key={index} />
      ))}
    </div>
  );
};

const NewNote = ({ user }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [dropActive, setDropActive] = useState(false);
  const { uid } = user;
  const itemList = itemllist;

  const handlerAddNote = () => {
    if (title.length) {
      firebase
        .firestore()
        .collection(collection)
        .add({
          title,
          body,
          uid,
          timestamp: moment().unix(),
          id: Math.floor(Math.random() * 10 + 1),
          category
        });

      setTitle("");
      setBody("");
    }
  };

  const searchAssist = itemList.default
    .filter(a => {
      return a.item.toLowerCase().includes(title.toLowerCase());
    })
    .map((e, index) => {
      return (
        <div
          key={index}
          value={e.item}
          category={e.category}
          className="dropdown-item"
          onClick={() => {
            setTitle(e.item);
            setCategory(e.category);
            setDropActive(false);
          }}
        >
          {e.item}
        </div>
      );
    });

  useEffect(() => {
    if (title && searchAssist.length > 0) {
      setDropActive(true);
    } else {
      setDropActive(false);
    }
  }, [title]);

  return (
    <div className="addNote">
      <form
        onSubmit={e => {
          e.preventDefault();
          handlerAddNote();
        }}
      >
        <div className="noteline1">
          <div className="field is-grouped inputwide">
            <div className="control is-expanded has-addon">
              <div
                className={
                  "dropdown inputwide " + (dropActive ? "is-active" : "")
                }
              >
                <div className="dropdown-trigger inputwide">
                  <input
                    controls="dropdown-menu"
                    className="input is-primary"
                    type="text"
                    placeholder="Enter new item"
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                    }}
                  />
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <div className="">
                        <div
                          className=""
                          onMouseLeave={() => setDropActive(false)}
                        >
                          <div
                            style={{
                              maxHeight: "300px",
                              overflowY: "scroll"
                            }}
                          >
                            {searchAssist}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="control">
              <div className="select">
                <select
                  id="myList"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <SelectOptions cat={categories} type="options" />
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal is-hidden">
          <div className="field-body">
            <div className="field">
              <div className="control">
                <textarea
                  hidden={true}
                  className="textarea"
                  placeholder="e.g. Note details"
                  rows="1"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <button className="button is-link" onClick={handlerAddNote}>
        Add Item
      </button>
    </div>
  );
};

const App = ({ user }) => {
  return (
    <div className="app">
      <div className="title is-4 has-text-white">Note Taking with Firebase</div>
      <NewNote user={user} />
      <NoteList user={user} />
    </div>
  );
};

export default App;
