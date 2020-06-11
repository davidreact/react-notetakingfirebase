import React, { useState, useRef } from "react";
import moment from "moment";
import firebase from "../../Services/firebase";
import {
  SwipeableList,
  SwipeableListItem,
  ActionAnimations
} from "@sandstreamdev/react-swipeable-list";
import SelectOptions from "./SelectOptions";

const RenderNotes = ({ note, index, collection, categories }) => {
  const [readonly, setReadOnly] = useState({ readOnly: true });
  const { title, body, category } = note;
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
            isDone: false,
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

  const handlerDoneNote = (fid, noteIsDone) => {
    if (true) {
      firebase
        .firestore()
        .collection(collection)
        .doc(fid)
        .set(
          {
            isDone: !noteIsDone,
            updated: moment().unix()
          },
          { merge: true }
        )
        .then(() => {
          console.log("Document marked as Done");
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
      <SwipeableList threshold={0.2}>
        <SwipeableListItem
          swipeLeft={{
            content: (
              <div
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  padding: "9px",
                  marginTop: "10px",
                  backgroundColor: note.isDone ? "blue" : "green",
                  textAlign: "right",
                  boxSizing: "border-box"
                }}
              >
                {note.isDone ? "Add to List" : "Set Done"}
              </div>
            ),
            action: () => {
              handlerDoneNote(note.fid, note.isDone);
              console.info("Done triggered");
            }
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
          // onSwipeProgress={progress => {
          // console.info(`Swipe progress: ${progress}%`);
          // setOpacity((progress / 100) * 4);
          // }}
        >
          {itemList}
        </SwipeableListItem>
      </SwipeableList>
    </div>
  );
};

export default RenderNotes;
