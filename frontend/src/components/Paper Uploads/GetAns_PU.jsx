import React, { useState } from 'react';

const GetAns_PU = () => {
    const [questionsFile, setQuestionsFile] = useState(null);
    const [materialFile, setMaterialFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Questions:", questionsFile);
        console.log("Material:", materialFile);
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Get Answers</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-medium">Questions</label>
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt,.pptx"
                        onChange={(e) => setQuestionsFile(e.target.files[0])}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Material</label>
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt,.pptx"
                        onChange={(e) => setMaterialFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Generate Answers
                </button>
            </form>
        </div>
    );
};

export default GetAns_PU;