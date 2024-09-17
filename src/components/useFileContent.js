import { useState } from 'react';

export function useFileContent() {
    const [fileContent, setFileContent] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.name.endsWith('.lua')) {
                alert("You must submit a .lua file!");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setFileContent(content); // Set the content in state
            };
            reader.readAsText(file); // Read the file as text
        }
    };

    const loadCode = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Access the file input element directly from the form
        const form = e.target;
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput?.files[0]; // Use optional chaining to avoid errors if fileInput is undefined

        if (!file) {
            alert("You need to submit a file!"); // Show a warning if no file is selected
            return;
        }

        // Ensure the file is a .lua file
        if (!file.name.endsWith('.lua')) {
            alert("You must submit a .lua file!");
            return;
        }

        // Use the handleFileChange function to read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setFileContent(content); // Set the content in state
        };
        reader.readAsText(file); // Read the file as text
        console.log("File Submitted")
    };

    return {
        fileContent,
        loadCode,
        handleFileChange,
    };
}
