import React, { useState } from 'react';
import io from "socket.io-client";

const socket = io('http://localhost:4000');

function InputBox({ onFileLoad, code }) {
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

   async function exportFile(event) {
    // Prevent default behavior of form or button click if needed
    if (event) event.preventDefault();

    try {
        const fileHandle = await getSaveFilePicker();

        const luaFile = new Blob([code], { type: 'application/x-lua' });

        const url = URL.createObjectURL(luaFile);

        // Save the file to disk
        await save(fileHandle, url);
    } catch (error) {
        console.error(error);
    }
}

async function getSaveFilePicker() {
    const opts = {
        suggestedName: 'defaultName.lua', // Use the fileName or a default name
        types: [
            {
                accept: { "text/plain": [".lua"] },
            },
        ],
    };

    if ('showSaveFilePicker' in window) {
        return await window.showSaveFilePicker(opts);
    } else {
        alert("Your browser doesn't support the File System Access API.");
        const fileName = prompt('We are going to try something else... name the file w/ extension')
        const blob = new Blob([code], { type: 'text/plain' });  // Create a Blob for the Lua file
        const fileURL = URL.createObjectURL(blob);  // Create a downloadable URL for the Blob

        // Create an anchor element for the download
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `${fileName}.lua`;  // Set the download filename with the '.lua' extension

        // Append the link to the DOM, click it, then remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the URL after download to free up resources
        URL.revokeObjectURL(fileURL);
    }
}

async function save(fileHandle, url) {
    try {
        const writable = await fileHandle.createWritable();
        const response = await fetch(url); // Fetch the file from the provided URL
        const imageBlob = await response.blob(); // Convert the fetched content to a blob
        await writable.write(imageBlob); // Write the blob data to the file
        await writable.close(); // Close the file handle
    } catch (error) {
        console.error(error);
    }
}


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
                    <p id="yourId">Room ID: {localStorage.getItem('username')}</p>
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
                            style={{paddingBottom: '2vh', paddingRight: '1vw'}}
                            onChange={handleFileChange} // Track the selected file
                        />
                        <input
                            type="submit"
                            name="Confirm"
                            value="Import"
                            onClick={(e) => {
                                if (!window.confirm('Confirm, please.')) {
                                    e.preventDefault(); // Prevent submission if "Cancel" is clicked
                                }
                            }}
                        />
                    </form>
                </pre>
            </ div>
            <div className="ExportArea">
                <pre>
                    <h3>Export Files ▼</h3>
                    <form onSubmit={exportFile}>
                        <input
                            type="submit"
                            name="Confirm"
                            value="Export"
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
