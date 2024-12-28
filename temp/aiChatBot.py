# %%


# %%
from docx import Document
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from groq import Groq
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pymongo import MongoClient
from bson import ObjectId

# %%
def create_vector_store(text, embedding_function):
    """Create a vector store from a DOCX file."""
    text = text

    # Split the text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=500)
    documents = text_splitter.split_text(text)

    # Create Chroma vector store
    db = Chroma.from_texts(documents, embedding_function)

    return db

# %%
def get_bot_response(user_input, db, embedding_function, groq_client):
    """Get the bot response based on user input."""
    # Generate embedding for the user query
    query_embedding = embedding_function.embed_query(user_input)

    # Perform similarity search using Chroma
    similar_chunks = db.similarity_search_by_vector(query_embedding)

    # Gather context from similar chunks
    context = " ".join(chunk.page_content for chunk in similar_chunks)

    # Construct the detailed prompt
    detailed_prompt = f"You are a question-answering chatbot. Answer the following question: {user_input} \nContext: {context}\n if the context is about marks, just print the marks of the student, their name, their roll number and the subject code and name. If the context is about events and club, give the name of club hosting it, where it is hosted, venue, date and time, and a description of the event in not more than 100 words."

    # Make a call to Groq API for chat completions
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": detailed_prompt}
        ],
        model="llama3-8b-8192",
        max_tokens=1000
    )

    return chat_completion.choices[0].message.content

# %%
def getEventText(event_info):
    """Extract title and description from events and return as a single text string."""
    # Debugging: Check if `eventsInfo` exists
    if not event_info.get('eventsInfo'):
        print("No 'eventsInfo' field found in the document.")
        return ""

    # Debugging: Check if `events` exists within `eventsInfo`
    events = event_info['eventsInfo'].get('events', [])
    if not events:
        print("No 'events' found in 'eventsInfo'.")
        return ""

    # Process each event
    text = ""
    for i, event in enumerate(events):
        title = event.get('title', '')
        description = event.get('description', '')
        if title or description:
            text += f"Event {i + 1}:\n"
            text += f"Title: {title}\nDescription: {description}\n\n"
        else:
            print(f"Event {i + 1} is missing title and description.")
    
    return text.strip()

# %%
def getMarksText(event_info):
    """Extract title and description from events and return as a single text string."""
    # Debugging: Check if `eventsInfo` exists
    if not event_info.get('marksInfo'):
        print("No 'marksInfo' field found in the document.")
        return ""

    events = event_info['marksInfo'].get('marks', [])
    if not events:
        print("No 'marks' found in 'marksInfo'.")
        return ""

    # Process each event
    text = ""
    for i, event in enumerate(events):
        title = event.get('subject', '')
        description = event.get('marks', '')
        if title or description:
            text += f"Subject {i + 1}:\n"
            text += f"Subject Code and Name: {title}\nmarks of all Students: {description}\n\n"
        else:
            print(f"Subject {i + 1} is missing title and description.")
    
    return text.strip()

# %%
def getGeneralText(event_info):
    """Extract title and description from events and return as a single text string."""
    # Debugging: Check if `eventsInfo` exists
    if not event_info.get('generalInfo'):
        print("No 'generalInfo' field found in the document.")
        return ""

    # Debugging: Check if `events` exists within `eventsInfo`
    events = event_info['generalInfo'].get('general', [])
    if not events:
        print("No 'general' found in 'generalInfo'.")
        return ""

    # Process each event
    text = ""
    for i, event in enumerate(events):
        title = event.get('subject', '')
        description = event.get('description', '')
        if title or description:
            text += f"Info {i + 1}:\n"
            text += f"The starting title:  {title}\ngeneral of all College: {description}\n\n"
        else:
            print(f"Subject {i + 1} is missing title and description.")
    
    return text.strip()

# %%
from fuzzywuzzy import fuzz

def classify_query(query):
    # Convert the query to lowercase for case-insensitive matching
    query = query.lower()
    
    # Define keywords for each category
    marks_keywords = ["marks", "exam", "quiz", "midsem", "endsem", "practical", "score", "result"]
    events_keywords = ["event", "club", "workshop", "fest", "competition", "seminar"]
    general_keywords = ["information", "college", "timing", "library", "administration", "contact"]
    
    # Function to check if any keyword is close enough to the words in the query
    def fuzzy_match(keywords, query):
        for word in keywords:
            if any(fuzz.partial_ratio(word, query_word) > 80 for query_word in query.split()):
                return True
        return False
    
    # Check for fuzzy matching with keywords
    if fuzzy_match(marks_keywords, query):
        return "marks"
    elif fuzzy_match(events_keywords, query):
        return "events"
    elif fuzzy_match(general_keywords, query):
        return "general"
    else:
        return "unknown"

# %%
def main():
    """Main function to run the chatbot and highlight relevant text."""
        # Get user inputs
    mongo_db_uri = "mongodb+srv://mrinalgaur:mrinalgaur22@compus.s1fob.mongodb.net/?retryWrites=true&w=majority&appName=compus"
    client = MongoClient(mongo_db_uri)
    db = client['test']  # Database name
    collection = db['aiChatBot']  # Collection name

    # Fetch document from the collection
    user_input = ("How many acres is Punjab Engineering College?")
    classified_query = classify_query(user_input)
    if(classified_query == "events"):
        info = collection.find_one({'_id': ObjectId('676d8bf49e48cdfb0b216f3f')})
        text = getEventText(info)
    elif(classified_query == "marks"):
        info = collection.find_one({'_id': ObjectId('676da65f9e48cdfb0b216f48')})
        text = getMarksText(info)
    elif(classified_query == "general"):
        info = collection.find_one({'_id': ObjectId('676da9b09e48cdfb0b216f49')})  
        text = getGeneralText(info)

  
    API_KEY =  ("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")
    # Initialize Groq client
    groq_client = Groq(api_key=API_KEY)

    # Initialize embedding function
    embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # Create the vector store
    db = create_vector_store(text, embedding_function)

    # Get and print the bot response
    response = get_bot_response(user_input, db, embedding_function, groq_client)
    print(response)


if __name__ == "__main__":
    main()


# %%
import tensorflow as tf

# Check if TensorFlow is using the GPU
if tf.config.list_physical_devices('GPU'):
    print("TensorFlow is using the GPU.")
else:
    print("TensorFlow is not using the GPU.")

# %%


# %%



