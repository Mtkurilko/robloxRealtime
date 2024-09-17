import React, { useRef, useState } from 'react';

function InputBox({ onFileLoad }) {
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file in state when user selects one
    };

    return (
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
    );
}

export default InputBox;
