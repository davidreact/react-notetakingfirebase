import React from "react";

const SelectOptions = ({ cat = [], type, cl, butClick, catSelected }) => {
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
            style={{ backgroundColor: cat === catSelected ? "#845ec2" : "" }}
            key={index}
            value={cat}
            className={cl}
            onClick={() => butClick(cat, true)}
          >
            {cat}
          </button>
        ))
      : "";
  }

  return 1;
};

export default SelectOptions;
