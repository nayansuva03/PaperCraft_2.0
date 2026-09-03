import React, { useState } from 'react';

const OnlineQuiz_PU = () => {
    const [file, setFile] = useState(null);
    const [quizType, setQuizType] = useState('MCQs');
    const [questionCount, setQuestionCount] = useState(10);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ file, quizType, questionCount });
    };

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Online Quiz</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,.pptx"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="MCQs">MCQs</option>
                    <option value="True-False">True-False</option>
                </select>
                <div>
                    <label className="block mb-1 font-medium">Number of Questions (Max 100):</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Start Quiz
                </button>
            </form>
        </div>
    );
};

export default OnlineQuiz_PU;