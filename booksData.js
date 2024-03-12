const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeBookDetails(baseUrl, bookUrl) {
  try {
    const response = await axios.get(baseUrl + bookUrl);
    const $ = cheerio.load(response.data);

    // Extract additional data from the book details page
    const title = $('.ebook-main h1').text();
    const author = $('.ebook-author span').text();
    const language = $('.ebook-file-info span.info-green:last-child').text();
    const tag = $('.ebook-tags a');
    const tags = [];

    tag.each((index, element) => {
        tags.push($(element).text().trim());
      });

    // Create an object for the book details
    const bookDetails = { title, author, tags, language };

    console.log(bookDetails);

    return bookDetails;
  } catch (error) {
    console.error(`Error fetching book details for ${bookUrl}: ${error.message}`);
    return null;
  }
}

async function scrapeBooksInCategory(baseUrl, category, maxPages) {
  let currentPage = 1;

  const scrapedData = []; // Array to store scraped data as objects


  console.log(baseUrl, category, maxPages)
  while (currentPage <= maxPages) {
    const url = `${baseUrl}${category}/p${currentPage}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extract data from the current page using Cheerio selectors
      const pagePromises = $('.files-new .row').map(async (index, element) => {
        const bookUrl = $(element).find('.file-left a').attr('href');
        const dataId = $(element).find('.file-left a').attr('data-id');
        const coverImg = $(element).find('.file-left img').attr('src');
        const dataLoc = $(element).find('.file-right a').attr('data-loc');
        const pageCount = $(element).find('.file-right .fi-pagecount').text();
        const pub_year = $(element).find('.file-right .fi-year').text();
        const fileSize = $(element).find('.file-right .fi-size').text();
        const newBook = $(element).find('.file-right .new').text();

        const bookDetails = await scrapeBookDetails(baseUrl, bookUrl);

        if (bookDetails) {
          const entry = { ...bookDetails, dataId, coverImg, dataLoc, pageCount, pub_year, fileSize, };

            scrapedData.push(entry);
        }
      }).get();

      // Wait for all promises to resolve before moving to the next page
      await Promise.all(pagePromises);

      // Move to the next page
      currentPage++;
    } catch (error) {
      console.error(`Error fetching page ${currentPage} for ${category}: ${error.message}`);
    }
  }

  // Save the scraped data array to a text file
  const outputFileName = 'all_books_details.txt';
  fs.writeFileSync(outputFileName, JSON.stringify(scrapedData, null, 2));

  console.log(`Scraped data for ${category} saved to ${outputFileName}`);
}

async function main() {
  const baseUrl = 'https://www.pdfdrive.com';

  // Read categories from 'categories.txt'
  const categoriesFile = fs.readFileSync('categories.txt', 'utf-8');
  const categoryNames = JSON.parse(categoriesFile);

  // Scrape book details for each category
  for (const category of categoryNames) {
    await scrapeBooksInCategory(baseUrl, category.catLink, 10);
  }
}

main();
