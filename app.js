const fs = require("fs");
const axios = require('axios');
const cheerio = require('cheerio');

const homeUrl = "https://www.pdfdrive.com/";
const books_data = [];
let existingData = [];
const fileName = 'books.txt';

async function getBooks(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const categories = $(".categories-list li");
    const baseUrl = "https://www.pdfdrive.com";

    const categoryPromises = categories.map(async function () {
      const cat_url = baseUrl + $(this).find('a').attr('href');
      await getBooks(cat_url);
    });

    await Promise.all(categoryPromises);

    const books = $("li");
    books.each(function () {
      let title = $(this).find('.file-right h2').text();
      let bookCover = $(this).find('.file-left img').attr('src');
      books_data.push({ title, bookCover }); //store in array
    });

    const firstUrl = "https://www.pdfdrive.com";
    if ($(".next").length > 0) {
      const next_page = firstUrl + $(".next").attr("href"); //converting to absolute URL
      await getBooks(next_page); //recursive call to the same function with new URL
    } else {
      if (fs.existsSync(fileName)) {
        const fileContent = fs.readFileSync(fileName, 'utf-8');
        existingData = JSON.parse(fileContent);
      }

      // Merge existing data with the new data
      const updatedData = [...existingData, ...books_data];

      // Convert the updated data array to a JSON string
      const updatedDataJSON = JSON.stringify(updatedData, null, 2);

      // Write the updated JSON string to the file
      fs.writeFileSync(fileName, updatedDataJSON);

      console.log(`${fileName} file has been updated!`);
    }

    console.log(books_data);
  } catch (err) {
    console.error(err);
  }
}

getBooks(homeUrl);
