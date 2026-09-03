import React, { useState } from 'react';

const FlashCards_PU = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Flashcard Material:", file);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Flash Cards & Notes</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Create flash cards/notes
                </button>
            </form>
        </div>
    );
};

export default FlashCards_PU;