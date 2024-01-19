import React, { useState, useEffect } from 'react';
import './App.css';

function ListCreationView({ selectedLists, newList, lists, onCancel, onUpdate }) {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);

  useEffect(() => {
    // Fetch lists from selectedLists and assign them to list1 and list2
    const [list1Number, list2Number,newListNumber] = selectedLists;
    setList1(lists[list1Number]);
    setList2(lists[list2Number]);
    // Assign newList to list3
    setList3(lists[newListNumber]);
  }, [selectedLists, lists, newList]);

  const handleItemMoveBack = (item, fromList, toList) => {
    toList === 'list1'
      ? setList1((prevList1) => [...prevList1, item])
      : setList2((prevList2) => [...prevList2, item]);

    setList3((prevList3) => prevList3.filter((i) => i.id !== item.id));
  };

  const handleItemMove = (item, fromList) => {
    setList3((prevList3) => [...prevList3, item]);

    if (fromList === 'list1') {
      setList1((prevList1) => prevList1.filter((i) => i.id !== item.id));
    } else {
      setList2((prevList2) => prevList2.filter((i) => i.id !== item.id));
    }
  };

  const handleCancel = () => {
    onCancel(); // Call the onCancel callback passed as a prop
  };

  const handleUpdate = () => {
    const [list1Number, list2Number, newListNumber] = selectedLists;
    // Call the callback function to update lists in ListApp
    onUpdate((prevLists) => ({
      ...prevLists,
      [list1Number]: list1,
      [list2Number]: list2,
      [newListNumber]: list3,
    }));
  };

  return (
    <>
      <div className="container">
        <div className="list-container">
          <h2>List {selectedLists[0]}</h2>
          <ul>
            {list1.map((item) => (
              <li key={item.id} className="item">
                <div className="item-box">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <spnan onClick={() => handleItemMove(item, 'list1')} className="right-arrow">
                  &rarr;
                </spnan>
              </li>
            ))}
          </ul>
        </div>

        <div className="list-container">
          <h2>List {selectedLists[2]}</h2>
          <ul>
            {list3.map((item) => (
              <li key={item.id} className="item">
                <div className="item-box">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <span onClick={() => handleItemMoveBack(item, 'list3', 'list1')} className="left-arrow">
                  &larr;
                </span>
                <span onClick={() => handleItemMoveBack(item, 'list3', 'list2')} className="right-arrow">
                  &rarr;
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="list-container">
          <h2>List {selectedLists[1]}</h2>
          <ul>
            {list2.map((item) => (
              <li key={item.id} className="item">
                <div className="item-box">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <span onClick={() => handleItemMove(item, 'list2')} className="left-arrow">
                  &larr;
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="update-button-container">
        <button onClick={handleUpdate}>Update</button>
      </div>
      <button onClick={handleCancel}>Cancel</button>
    </>
  );
}

export default ListCreationView;
