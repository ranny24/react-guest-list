import './App.scss';
import React, { useEffect, useRef, useState } from 'react';

export default function Guestlist() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attendingOnly, setAttendingOnly] = useState(false);
  const [notAttendingOnly, setNotAttendingOnly] = useState(false);
  const firstNameInputRef = useRef(null);
  const lastNameIsFocused = useRef(null);

  const baseUrl =
    'http://d77e52ef-1e87-4919-85c5-bb0ce85427dc.id.repl.co/guests/';

  // Getting all guests (aka GET /guests)
  useEffect(() => {
    async function getGuests() {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestList([...allGuests]);
      setIsLoading(false);
    }
    getGuests().catch((error) => console.log('get all guests error:' + error));
  }, []);

  // Creating a new guest (aka POST /guests)
  async function handleAddGuest() {
    if (!firstName.trim() || !lastName.trim()) {
      setHasError(true);
    } else {
      // Updating a guest (aka PUT /guests/:id)
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: firstName, lastName: lastName }),
      });
      const createdGuest = await response.json();
      setGuestList([...guestList, createdGuest]);
      // clear input fields
      setFirstName('');
      setLastName('');
      // firstName input field
      firstNameInputRef.current.focus();
      setHasError(false);
    }
  }

  // Deleting a guest (aka DELETE /guests/:id)
  async function handleRemoveGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newList = guestList.filter((guest) => guest.id !== deletedGuest.id);
    setGuestList([...newList]);
    setHasError(false);
  }

  // change attending status (UPDATE)
  async function handleUpdateGuest(id, attending) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // change firstName of existing guest (Update)
  async function handleUpdateFirstName(id) {
    const newFirstName = prompt('Change the first name:');

    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: newFirstName }),
    });
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // change lastName of existing guest (Update)
  async function handleUpdateLastName(id) {
    const newLastName = prompt('Change the last name:');

    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastName: newLastName }),
    });
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // delete all guest entries
  async function handleDeleteAll() {
    for (const guest of guestList) {
      await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
    }
    firstNameInputRef.current.focus();
    setHasError(false);
    setGuestList([]);
  }

  // map over the saved list: callback function to create a div for each individual guest
  function mapOverGuestList(guest) {
    return (
      <div
        key={`guest-${guest.lastName}-${guest.id}`}
        data-test-id="guest"
        className="guest"
      >
        <div className="guestName">
          <p
            onDoubleClick={() => handleUpdateFirstName(guest.id)}
            title="double-click to edit name"
          >
            {`${guest.firstName} `}
          </p>
          <button
            title="edit"
            className="editNames"
            onClick={() => handleUpdateFirstName(guest.id)}
            aria-label="Edit the first name"
          >
            ✐
          </button>
          <p
            onDoubleClick={() => handleUpdateLastName(guest.id)}
            title="double-click to edit name"
          >
            {guest.lastName}
          </p>
          <button
            title="edit"
            className="editNames"
            onClick={() => handleUpdateFirstName(guest.id)}
            aria-label="Edit the first name"
          >
            ✐
          </button>
        </div>
        <div className="status">
          <label>
            <input
              type="checkbox"
              aria-label={'change attending status for ' + guest.firstName}
              checked={guest.attending}
              onChange={() => {
                handleUpdateGuest(guest.id, guest.attending).catch((error) =>
                  console.log('update guest: ' + error),
                );
              }}
            />
            {guest.attending ? 'Attending 🥳' : 'Not attending'}
          </label>
        </div>
        <button
          onClick={() =>
            handleRemoveGuest(guest.id).catch((error) =>
              console.log('remove guest: ' + error),
            )
          }
        >
          Remove guest
        </button>
      </div>
    );
  }

  return (
    <div className="display">
      <h1>Wedding Guestlist</h1>
      <div className="content">
        <div className="list">
          {isLoading ? (
            'Loading...'
          ) : guestList.length === 0 ? (
            <p>
              <i>Use the input fields below to create your guest list !</i>
            </p>
          ) : (
            guestList
              .filter((guest) =>
                attendingOnly
                  ? guest.attending
                  : notAttendingOnly
                  ? !guest.attending
                  : true,
              )
              .map((guest) => mapOverGuestList(guest))
          )}
        </div>

        <div className="filters">
          <button
            className={attendingOnly ? 'active' : 'inactive'}
            onClick={() => {
              setAttendingOnly(true);
              setNotAttendingOnly(false);
            }}
          >
            Show attending list
          </button>
          <button
            className={notAttendingOnly ? 'active' : 'inactive'}
            onClick={() => {
              setNotAttendingOnly(true);
              setAttendingOnly(false);
            }}
          >
            Show not attending list
          </button>
          <button
            className={
              !attendingOnly && !notAttendingOnly ? 'active' : 'inactive'
            }
            onClick={() => {
              setAttendingOnly(false);
              setNotAttendingOnly(false);
            }}
          >
            Show all guests
          </button>
        </div>

        {/* if not filled out, show error message */}

        <div className="addGuest">
          <div className={hasError ? 'error inputs' : 'inputs'}>
            {hasError ? (
              <p>Please submit both a first name and a last name!</p>
            ) : null}
            <label>
              🌺 First name:
              <input
                disabled={isLoading}
                onChange={(event) => setFirstName(event.target.value)}
                value={firstName}
                ref={firstNameInputRef}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    lastNameIsFocused.current.focus();
                  }
                }}
              />
            </label>
            <label>
              🌺 Last name:
              <input
                disabled={isLoading}
                onChange={(event) => setLastName(event.target.value)}
                value={lastName}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAddGuest().catch((error) => console.log(error));
                  }
                }}
                ref={lastNameIsFocused}
              />
            </label>
          </div>
          <div className="buttons">
            <button
              disabled={isLoading ? 'disabled' : false}
              className="add"
              onClick={() => handleAddGuest()}
            >
              Add guest
            </button>
          </div>
        </div>
        <div className="deleteAll">
          <button
            className="delete"
            onClick={() =>
              handleDeleteAll().catch((error) =>
                console.log('delete all: ' + error),
              )
            }
          >
            Delete all guest entries
          </button>
        </div>
      </div>
    </div>
  );
}
