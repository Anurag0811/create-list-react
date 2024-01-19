import React, { useState, useEffect } from 'react';
import './App.css';
import ListCreationView from './ListCreationView.js';
function App() {

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkBoxMap, setCheckBoxMap] = useState({});
  const [message, setMessage] = useState('');
  const [shouldShowListViewCreation, setShouldShowListViewCreation] = useState(false);
  const [selectedListNumbers, setSelectedListNumbers] = useState([]);
  const [newList, setNewList] = useState([]);

  useEffect(() => {
    // Fetch data from the API and update lists
    fetch('https://apis.ccbp.in/list-creation/lists')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const filteredLists = data.lists.reduce((acc, item) => {
          acc[item.list_number] = acc[item.list_number] || [];
          acc[item.list_number].push(item);
          return acc;
        }, {});
        setLists(filteredLists);
        // Create a checkbox map with default values
        const initialCheckBoxMap = Object.keys(filteredLists).reduce((acc, listNumber) => {
          acc[listNumber] = false;
          return acc;
        }, {});
        setCheckBoxMap(initialCheckBoxMap);
      })
      .catch((error) => console.error('Error fetching data:', error))
      .finally(() => {
        setLoading(false); // Set loading to false when API call is complete
      });
  }, []);

  const handleCheckBoxChange = (listNumber) => {
    setCheckBoxMap((prevCheckBoxMap) => ({
      ...prevCheckBoxMap,
      [listNumber]: !prevCheckBoxMap[listNumber],
    }));
  };

  const handleUpdateLists = (updatedLists) => {
    // Update the lists in ListApp component based on changes in ListCreationView
    setLists(updatedLists);
    setShouldShowListViewCreation(false); // Close ListCreationView after updating
    setSelectedListNumbers([]);
    setNewList([]);
  };

  const handleCreateList = () => {
    const checkedCount = Object.values(checkBoxMap).filter((checked) => checked).length;

    if (checkedCount === 2) {
      const selectedListNumbers = Object.keys(checkBoxMap).filter(
        (listNumber) => checkBoxMap[listNumber]
      );
      setSelectedListNumbers(selectedListNumbers);

      const newListNumber = Object.keys(lists).length + 1;
      const newList = [];
      setNewList(newList);
      setSelectedListNumbers([...selectedListNumbers, newListNumber]);
      setLists((prevLists) => ({
        ...prevLists,
        [newListNumber]: newList,
      }));

      setCheckBoxMap({});
      setShouldShowListViewCreation(true);
    } else {
      setMessage('Please select exactly 2 checkboxes to create a new list.');
    }
  };

  const handleCancelListView = () => {
    // Reset the state when canceling ListCreationView
    
    setShouldShowListViewCreation(false);
    setSelectedListNumbers([]);
    setNewList([]);
  };

  return (
    <>
    <h2 >List Creation</h2>
      <button onClick={handleCreateList} disabled={shouldShowListViewCreation}>
            Create New List
      </button>
      <p>{message}</p>
      {shouldShowListViewCreation ? (
        <ListCreationView
        selectedLists={selectedListNumbers}
        newList={newList}
        lists={lists}
        onCancel={handleCancelListView}
        onUpdate={handleUpdateLists}
      />
      ) : (
        <div className="container">
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="container">
  
              {Object.keys(lists).map((listNumber) => (
                <div key={listNumber} className="list-container">
                  <h2>
                    <input
                      type="checkbox"
                      checked={checkBoxMap[listNumber]}
                      onChange={() => handleCheckBoxChange(listNumber)}
                    />
                    List {listNumber}
                  </h2>
                  <ul>
                    {lists[listNumber].map((item) => (
                      <li key={item.id} className="card my-3 mx-0">
                        <div className="item-box">
                          <strong>{item.name}</strong>
                          <p className="desc">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
