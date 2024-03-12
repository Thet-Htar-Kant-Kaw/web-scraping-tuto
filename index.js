const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePdfDrive() {
  const baseUrl = 'https://www.pdfdrive.com/category/113';
  const books_data = [];
  let existingData = [];
  const fileName = 'booksdata.txt';

  let currentPage = 1;
  const maxPages = 5; // Set the maximum number of pages you want to scrape

  while (currentPage <= maxPages) {
    const url = `${baseUrl}/p${currentPage}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extract data from the current page using Cheerio selectors
      $('.files-new .row').each(function () {
        const dataId= $(this).find('.file-left a').attr('data-id');        
        const title = $(this).find('.file-left img').attr('title');
        const coverImg = $(this).find('.file-left img').attr('src');
        const link= $(this).find('.file-left a').attr('href');
        const dataLoc= $(this).find('.file-right a').attr('data-loc');

        const entry = { dataId, title, coverImg, link, dataLoc, fileInfo: {} };

        entry.fileInfo.pageCount= $(this).find('.file-right .fi-pagecount').text();
        entry.fileInfo.pub_year= $(this).find('.file-right .fi-year').text();
        entry.fileInfo.fileSize= $(this).find('.file-right .fi-size').text(); 
        entry.fileInfo.newBook= $(this).find('.file-right .new').text();

        console.log(entry);
        books_data.push(entry);
      });

      // Move to the next page
      currentPage++;
      console.log(books_data);

    } catch (error) {
      console.error(`Error fetching page ${currentPage}: ${error.message}`);
    }
  }

  fs.writeFileSync(fileName, JSON.stringify(books_data, null, 2));

  console.log(`Scraped data saved to ${fileName}`);
}

scrapePdfDrive();
