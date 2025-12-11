// Helper function to split text into lines based on words per line
const splitTextIntoLines = (text, wordsPerLine) => {
    const words = text.split(' ');
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    return lines;
};

export default splitTextIntoLines;
