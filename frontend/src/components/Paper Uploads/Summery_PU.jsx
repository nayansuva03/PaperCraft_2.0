import React, { useState } from 'react';

const Summery_PU = () => {
    const [file, setFile] = useState(null);
    const [summaryFormat, setSummaryFormat] = useState('MCQs');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("File:", file, "Format:", summaryFormat);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Summary Generator</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <select
                    value={summaryFormat}
                    onChange={(e) => setSummaryFormat(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="MCQs">MCQs</option>
                    <option value="True-False">True-False</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Generate Summary
                </button>
            </form>
        </div>
    );
};

export default Summery_PU;