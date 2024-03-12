const fs = require('fs');
const axios = require('axios');

function TxtFileReader() {
    useEffect(() => {
      async function fetchTxtFile() {
        try {
          // Using Fetch API
        //   const response = await fetch('/path/to/your/file.txt');
        //   const text = await response.text();
        //   console.log(text);
  
          // Using Axios
          const response = await axios.get('./all_book_details.txt');
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching the .txt file:', error);
        }
      }
  
      fetchTxtFile();
    }, []);
  
    // return <div />;
  }