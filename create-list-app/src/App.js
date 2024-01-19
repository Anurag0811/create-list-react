import logo from './logo.svg';
import './App.css';

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



  return (
    <>
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
          <button onClick={handleCreateList} disabled={shouldShowListViewCreation}>
            Create New List
          </button>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="container">
              <p>{message}</p>
              {Object.keys(lists).map((listNumber) => (
                <div key={listNumber}>
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
                      <li key={item.id} className="item">
                        <div className="item-box">
                          <strong>{item.name}</strong>
                          <p>{item.description}</p>
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
