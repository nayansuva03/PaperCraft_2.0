import React, { useState } from 'react';

const GetMaxQuestion_PU = () => {
    const [file, setFile] = useState(null);
    const [questionType, setQuestionType] = useState('MCQs');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("File:", file, "Question Type:", questionType);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Get Maximum Questions</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="MCQs">MCQs</option>
                    <option value="True-False">True-False</option>
                    <option value="One liner">One liner</option>
                    <option value="Long questions">Long questions</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Create Maximum Questions
                </button>
            </form>
        </div>
    );
};

export default GetMaxQuestion_PU;