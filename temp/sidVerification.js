import axios from 'axios';
import sharp from 'sharp';
import * as tesseract from 'tesseract.js';

/**
 * Dictionary of common misspelled words and their corrections.
 */
const corrections: Record<string, string> = {
  'Namc': 'Name',
  'Depatment': 'Department',
  'Idenity': 'Identity',
  // Add more common misspellings here as needed
};

/**
 * Corrects misspelled words using the provided corrections dictionary.
 *
 * @param {string} text - The input text to correct.
 * @returns {string} The corrected text.
 */
const correctSpelling = (text: string): string => {
  const words = text.split(/\s+/);  // Split text into words
  return words
    .map((word) => corrections[word] || word)  // Check if the word has a correction
    .join(' ');  // Join the words back together
};

/**
 * Extracts Name, Department, and Identity No. from the text.
 *
 * @param {string} text - The input text to extract details from.
 * @returns {object} An object containing name, department, and identity number.
 */
function extractDetails(text: string): { name: string | null; department: string | null; identityNo: string | null } {
  // Apply spelling correction
  const correctedText = correctSpelling(text);

  const nameMatch = correctedText.match(/Name:\s*(.+)/);
  const identityMatch = correctedText.match(/Identity No\.\s*:\s*(\d+)/);
  const departmentMatch = correctedText.match(/Department:\s*(.+)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    identityNo: identityMatch ? identityMatch[1].trim() : null,
    department: departmentMatch ? departmentMatch[1].trim() : null
  };
}

/**
 * Extracts text from all image URLs.
 *
 * @param {string[]} imageLinks - An array of image URLs.
 * @returns {Promise<Record<string, string>>} A promise resolving to a dictionary mapping file names to extracted text.
 */
async function extractTextFromImageLinks(imageLinks: string[]): Promise<Record<string, string>> {
  const extractedText: Record<string, string> = {};

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
