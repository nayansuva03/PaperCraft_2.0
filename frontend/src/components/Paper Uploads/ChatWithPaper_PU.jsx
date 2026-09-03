import React, { useState } from 'react';

const ChatWithPaper_PU = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Uploaded File:", file);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Chat With Paper</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Ask Your material
                </button>
            </form>
        </div>
    );
};

export default ChatWithPaper_PU;