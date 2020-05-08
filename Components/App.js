import React, { useState, useEffect, useRef } from "react";
import firebase from "../Services/firebase";
import moment from "moment";
// import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
// import '@sandstreamdev/react-swipeable-list/dist/styles.css';


const collection = "notesauth";

const categories = [
  "FruitsVegs",
  "Meat",
  "Fridge",
  "Eggs/Milk",
  "Care",
  "Cleaning"
];

function useGetList({ user }) {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection(collection)
      .where("uid", "==", user.uid)
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          fid: doc.id,
          ...doc.data()
        }));
        sortList(list,localStorage.getItem("orderAsc"))
        setList(list)
      })
  }, []);

  return list;
}

const SelectOptions = ({ cat = [], type, cl, butClick }) => {
  if (type == "options") {
    return cat.length > 0
      ? cat.map((cat, index) => (
          <option key={index} value={cat} className={cl}>
            {" "}
            {cat}
          </option>
        ))
      : "";
  }

  if (type == "button") {
    const listButtons = [1];

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

  return (
    <div index={index} className="note">
      <div className="noteline1">
        <div className="field is-grouped inputwide">
          <div className="control is-expanded">
            <input
              type="text"
              value={!readonly.readOnly ? tempTitle : title}
              {...readonly}
              className={`input ${readonly.readOnly ? "" : "is-primary"}`}
              onChange={e => setTempTitle(e.target.value)}
              onClick={() => setSectionHidden(!sectionHidden)}
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
              <option></option>
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
};
const sortList = (li, sortingOrder) => {
  switch (sortingOrder) {
    case "Ascending":
      {console.log("Ascending Called")}
      return li.sort(function(a, b) {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x > y) {
          return -1;
        }
        if (x < y) {
          return 1;
        }
        return 0;
      });
    case "Descending":
    {console.log("Descending Called")}
      return li.sort(function(a, b) {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    default:
      return li;
  }
};

const NoteList = ({ user }) => {
  const list = useGetList({ user });
  const [filteredList, setFilteredList] = useState([]);
  const [orderAsc, setOrderAsc] = useState(localStorage.getItem("orderAsc"));

 useEffect(()=> {
   setFilteredList(list)
 },[list])

  const filteredCategory = cat => {
    const catFilter = list.filter(doc => {
      console.log("doc.category", doc.category, "cat", cat, "eval", doc.category == cat)
      return doc.category == cat})
    setFilteredList(catFilter);
    console.log("filCat clicked", cat, filteredList, "catFilter", catFilter);
  };

  const updateOrder = (val) => {
    sortList(list,val)
    console.log("orderAsc in UpdateOrder", val)
    if(val=="Ascending") {
      setOrderAsc("Descending")
      localStorage.setItem("orderAsc", "Descending");
      }
    if(val=="Descending") {
      setOrderAsc("Ascending");
      localStorage.setItem("orderAsc", "Ascending");
      }
  }

  return (
    <div>
      <div>
        <button
          className="button is-dark is-small "
          onClick={() => updateOrder(orderAsc)}
        >
          Sort {orderAsc}
        </button>
        <div className="buttons has-addons is-centered is-grouped">
          <button className="button is-small is-info"
          onClick={() => setFilteredList(list)}
          >All</button>
          <SelectOptions
            butClick={filteredCategory}
            cat={categories}
            cl="button is-small is-link"
            filter={filteredCategory}
            type="button"
          />

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
  const { uid } = user;

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
            <div className="control is-expanded">
              <input
                className="input is-primary"
                type="text"
                placeholder="Enter new item"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
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
