import React, { useState, useEffect } from "react";
import firebase from "../../Services/firebase";
import * as itemllist from "../../data.json";
import moment from "moment";
import SelectOptions from "./SelectOptions";

const NewNote = ({ user, categories, collection }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [dropActive, setDropActive] = useState(false);
  const [dropHidden, setDropHidden] = useState(false);
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
          isDone: false,
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
    if (searchAssist.length === 0) {
      setDropHidden(true);
    } else {
      setDropHidden(false);
    }
  }, [searchAssist.length]);

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
                    onClick={() => setDropActive(true)}
                  />
                  <div
                    className={"dropdown-menu"}
                    id="dropdown-menu"
                    role="menu"
                    onMouseLeave={() => setDropActive(false)}
                  >
                    <div
                      className={
                        "dropdown-content" + (dropHidden ? "hidden" : "")
                      }
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}
                    >
                      <div>{searchAssist}</div>
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

      <button className="button is-info" onClick={handlerAddNote}>
        Add Item
      </button>
    </div>
  );
};

export default NewNote;
