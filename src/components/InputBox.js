import React, { useState } from 'react';
import io from "socket.io-client";

const socket = io('http://localhost:4000');

function InputBox({ onFileLoad }) {
    const [file, setFile] = useState(null);
    const [roomId, setRoomId] = useState(""); // Track the room ID

    const loadCode = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!file) {
            alert("You need to submit a file!"); // Show a warning if no file is selected
            return;
        }

        if (!file.name.endsWith('.lua')) {
            alert("You must submit a .lua file!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            onFileLoad(content); // Call the callback with the file content
        };
        reader.readAsText(file); // Read the file as text
    };

    const roomRequest = (e) => {
        e.preventDefault(); // Prevent form submission
        if (roomId) {
            socket.emit('joinRoom', roomId); // Emit the room ID to the server
            localStorage.setItem('username', roomId)
            window.location.reload();
        } else {
            alert('Please enter a room ID.');
        }
    };

    const resetId = () => {
        localStorage.removeItem('username')
        window.location.reload();
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file in state when user selects one
    };

    const handleRoomChange = (e) => {
        setRoomId(e.target.value); // Update the room ID as the user types
    };

    return (
        <>
            <div className="JoinRoom">
                <pre>
                    <h3>Join Room ▼</h3>
                    <form onSubmit={roomRequest}>
                        <input
                            type="password"
                            style={{marginBottom: '1vh', marginRight: '1vw'}}
                            value={roomId}
                            onChange={handleRoomChange} // Track the input value
                            placeholder="Enter room ID"
                        />
                        <input
                            type="submit"
                            name="Confirm"
                            value="Confirm"
                            onClick={(e) => {
                                if (!window.confirm('Confirm, please.')) {
                                    e.preventDefault(); // Prevent submission if "Cancel" is clicked
                                }
                            }}
                        />
                    </form>
                    <button
                        onClick={resetId}
                        style={{marginBottom: '1vh', marginTop: '1vh'}}
                    >Leave Room (Reset)</button>
                </pre>
            </div>
            <div className="InputArea">
                <pre>
                    <h3>Import Files ▼</h3>
                    <form onSubmit={loadCode}>
                        <input
                            type="file"
                            accept=".lua"
                            style={{ paddingBottom: '2vh', paddingRight: '1vw' }}
                            onChange={handleFileChange} // Track the selected file
                        />
                        <input
                            type="submit"
                            name="Confirm"
                            value="Confirm"
                            onClick={(e) => {
                                if (!window.confirm('Confirm, please.')) {
                                    e.preventDefault(); // Prevent submission if "Cancel" is clicked
                                }
                            }}
                        />
                    </form>
                </pre>
            </ div>
        </>
    );
}

export default InputBox
