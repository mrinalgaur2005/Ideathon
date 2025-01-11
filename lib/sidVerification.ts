import Tesseract from 'tesseract.js';
import fetch from 'node-fetch';

import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Extracts details like Name, Department, and Identity No. from the text.
 *
 * @param {string} text - The input text to extract details from.
 * @returns {object} An object containing name, department, and identity number.
 */
export const extractDetails = async (text: string): Promise<{ name: string | null; department: string | null; identityNo: string | null }> => {
  // const nameMatch = text.match(/(Name|Namc):?\s*([A-Za-z]+(?:[ '-][A-Za-z]+)*)(?=\s*[-'\n$])/); 
  // const identityMatch = text.match(/Identity No\.:\s*(\d+)/);
  // const departmentMatch = text.match(/Department:\s*(.+)/);

  // const name = nameMatch ? nameMatch[2].trim().replace(/\s+[A-Za-z]$/, '') : null;  // Removing trailing single letters like 'O'
  // const identityNo = identityMatch ? identityMatch[1].trim() : null;
  // const department = departmentMatch ? departmentMatch[1].trim() : null;

  // console.log(`Name: ${name}`);
  // console.log(nameMatch)
  // console.log(`Identity No.: ${identityNo}`);
  const promptSID = `I am providing you a text, return me the Identity No. you find in that text, it might not be written Identity No. exactly but might be close to it so adjust. Just return the number you find. \n\nText: ${text}`;

  const completionSID = await groqClient.chat.completions.create({
  messages: [{ role: 'user', content: promptSID }],
  model: 'llama3-8b-8192',
  });

  const identityNo = completionSID.choices[0]?.message?.content;

  const promptName = `I am providing you a text, return me the Name you find in that text, it might not be written Name exactly but might be close to it so adjust. Just return the name you find. \n\nText: ${text}`;

  const completionName = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: promptName }],
    model: 'llama3-8b-8192',
    });
  
  const name = completionSID.choices[0]?.message?.content;

  const promptDepartment = `I am providing you a text, return me the Department you find in that text, it might not be written Department exactly but might be close to it so adjust. Just return the department you find. \n\nText: ${text}`;

  const completionDepartment = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: promptDepartment }],
    model: 'llama3-8b-8192',
    });
  
  const department = completionSID.choices[0]?.message?.content;
  return { name, department, identityNo };
};

/**
 * Extracts text from an array of image URLs.
 *
 * @param {string[]} imageLinks - An array of image URLs.
 * @returns {Promise<Record<string, string>>} A promise resolving to a dictionary mapping file names to extracted text.
 */
const extractTextFromImageLinks = async (imageLinks: string[]): Promise<Record<string, string>> => {
  const extractedText: Record<string, string> = {};

  // Process each image link asynchronously
  await Promise.all(imageLinks.map(async (link) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      console.log('here');
      
      const imageBuffer = await response.buffer();
      
      // Use Tesseract.js to recognize text
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');

      // Map the extracted text to the image link
      extractedText[link] = text;
      console.log(extractedText);
      
    } catch (error) {
      console.error(`Error processing ${link}:`, error);
    }
  }));  
  return extractedText;
};

// Example usage
export default extractTextFromImageLinks;
