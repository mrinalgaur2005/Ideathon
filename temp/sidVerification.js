const axios = require('axios');
const sharp = require('sharp');
const tesseract = require('tesseract.js');

// Function to extract Name, Department, and Identity No. from the given text
function extractDetails(text) {
    const nameMatch = text.match(/Name:\s*(.+)/);
    const identityMatch = text.match(/Identity No\.\s*:\s*(\d+)/);
    const departmentMatch = text.match(/Department:\s*(.+)/);

    return {
        name: nameMatch ? nameMatch[1].trim() : null,
        identityNo: identityMatch ? identityMatch[1].trim() : null,
        department: departmentMatch ? departmentMatch[1].trim() : null
    };
}

// Function to extract text from all image URLs
async function extractTextFromImageLinks(imageLinks) {
    const extractedText = {};

    for (const url of imageLinks) {
        try {
            // Download the image from the URL
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);

            // Use sharp to process the image before passing it to Tesseract
            const image = sharp(imageBuffer);
            const { data } = await image.toBuffer({ resolveWithObject: true });

            // Use tesseract.js to extract text
            const text = await tesseract.recognize(data, 'eng', { logger: (m) => console.log(m) });
            extractedText[url] = text.data.text;
            console.log(`Extracted text from ${url}`);

        } catch (error) {
            console.error(`Error processing ${url}: ${error}`);
        }
    }

    return extractedText;
}

// Example usage
const imageLinks = [
    "https://res.cloudinary.com/demo/image/upload/sample1.jpg", /////// PLACEHOLDER MRNAL CHAKKE
];

(async () => {
    const results = await extractTextFromImageLinks(imageLinks);

    // Process each result and extract details
    for (const [url, text] of Object.entries(results)) {
        console.log(`Text from ${url}:`);
        console.log(text);

        const { name, department, identityNo } = extractDetails(text);

        console.log("Name:", name);
        console.log("Department:", department);
        console.log("Identity Number:", identityNo);
    }
})();
