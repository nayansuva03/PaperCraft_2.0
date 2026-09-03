import React, { useState } from 'react';

const TrancelatePaper_PU = () => {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState('Gujarati');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("File:", file, "Target Language:", language);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Translate Material</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="Gujarati">Gujarati</option>
                    <option value="Hindi">Hindi</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Translate material
                </button>
            </form>
        </div>
    );
};

export default TrancelatePaper_PU;