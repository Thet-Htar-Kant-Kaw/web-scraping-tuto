const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCategoryNames(baseUrl) {
  try {
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);

    const categoryNames = [];

    // Extract category names from the homepage
    $('.categories-list a').each(function () {
      const catName = $(this).find('p').text();
      const catLink= $(this).attr('href');
      const coverImg = $(this).find('img').attr('src');
      const catImage = baseUrl + coverImg;

      categoryNames.push({ catName, catLink, catImage });
    });

    const outputFileName = 'categories.txt';
    fs.writeFileSync(outputFileName, JSON.stringify(categoryNames, null, 2));

    console.log(`Category names saved to ${outputFileName}`);

    return categoryNames;
  } catch (error) {
    console.error(`Error fetching category names: ${error.message}`);
    // return [];
  }
}

const baseUrl = 'https://www.pdfdrive.com';
scrapeCategoryNames(baseUrl);

// async function scrapeBookDetails(baseUrl, bookUrl) {
//   try {
//     const response = await axios.get(baseUrl + bookUrl);
//     const $ = cheerio.load(response.data);

//     // Extract additional data from the book details page
//     const title = $('.ebook-main h1').text();
//     const author = $('.ebook-author span').text();
//     const tags = {
//       tag1: $('.ebook-tags a:nth-child(1)').text(),
//       tag2: $('.ebook-tags a:nth-child(2)').text(),
//       tag3: $('.ebook-tags a:nth-child(3)').text(),
//     };

//     // Create an object for the book details
//     const bookDetails = { title, author, tags };

//     console.log(bookDetails);

//     return bookDetails;
//   } catch (error) {
//     console.error(`Error fetching book details for ${bookUrl}: ${error.message}`);
//     return null;
//   }
// }



// async function scrapeCategory(baseUrl, category, maxPages) {
//   let currentPage = 1;

//   const scrapedData = []; // Array to store scraped data as objects

//   while (currentPage <= maxPages) {
//     const url = `${baseUrl}${category}/p${currentPage}`;

//     try {
//       const response = await axios.get(url);
//       const $ = cheerio.load(response.data);

//       // Extract data from the current page using Cheerio selectors
//       $('.files-new .row').each(function () {
//         const bookUrl = $(this).find('.file-left a').attr('href');
//         const dataId = $(this).find('.file-left a').attr('data-id');
//         const coverImg = $(this).find('.file-left img').attr('src');
//         const dataLoc = $(this).find('.file-right a').attr('data-loc');

//         const bookDetails = scrapeBookDetails(baseUrl, bookUrl);

//         if (bookDetails) {
//           const entry = { ...bookDetails, dataId, coverImg, dataLoc, fileInfo: {} };

//           entry.fileInfo.pageCount = $(element).find('.file-right .fi-pagecount').text();
//           entry.fileInfo.pub_year = $(element).find('.file-right .fi-year').text();
//           entry.fileInfo.fileSize = $(element).find('.file-right .fi-size').text();
//           entry.fileInfo.newBook = $(element).find('.file-right .new').text();

//           scrapedData.push(entry);
//         }
//       }).get();

//       // Move to the next page
//       currentPage++;
//     } catch (error) {
//       console.error(`Error fetching page ${currentPage} for ${category}: ${error.message}`);
//     }
//     console.log(url)
//   }

//   // Save the scraped data array to a text file
//   const outputFileName = `test_data.txt`;
//   fs.writeFileSync(outputFileName, JSON.stringify(scrapedData, null, 2));
  
//   console.log(`Scraped data for ${category} saved to ${outputFileName}`);
// }

// Example usage to scrape category names and then fetch book data for each category


// Check if categoryNames is an array before iterating over it
// if (Array.isArray(categoryNames)) {
//   // Use Promise.all to wait for all category scraping operations to complete
//   Promise.all(categoryNames.map(category => scrapeCategory(baseUrl, category.category, 2)));
// } else {
//   console.log('Category names is not an array or is empty.');
// }