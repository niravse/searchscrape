const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
    
  try {
    const searchQuery = 'software';
    const page = 0;
    const url =  `https://www.google.com/search?vet=10ahUKEwitmdOphOOGAxUy1gIHHV9qA2MQ06ACCOkM..i&ei=FGFwZrqbA7CL7NYPh5W98Ao&opi=89978449&rlz=1C1EJFC&yv=3&rciv=jb&nfpr=0&q=${searchQuery}&start=${page * 10}&asearch=jb_list&cs=1&async=_id:VoQFxe,_pms:hts,_fmt:pc`;

    const response = await axios.get(url,{
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    let linksnum = 0;
    const numofLinks = [];

    $('a').each((index, element) => {
      if ($(element).hasClass('pMhGee Co68jc j0vryd')) {
        linksnum += 1;
      } else {
        if (linksnum !== 0) {
          numofLinks.push(linksnum);
        }
        linksnum = 0;
      }
    });

    // Capture the last set of links if the loop ends on them
    if (linksnum !== 0) {
      numofLinks.push(linksnum);
    }
   
    let currentnum = [];
    $('div.BjJfJf.PUpOsf').each((i, elem) => {
      currentnum.push($(elem).text().trim());
    });
    let titles = [];
    $('div.BjJfJf.PUpOsf').each((i, elem) => {
      titles.push($(elem).text().trim());
    });
    console.log("Number of links:", titles);
    let jobElements = [];
    $('a.pMhGee.Co68jc.j0vryd').each((i, elem) => {
      jobElements.push($(elem).attr('href'));
    });
    let descriptions = [];
    $("span.HBvzbc").each((i, elem) => {
      descriptions.push($(elem).text().trim());
    });
    let tempLocation = [];
    $('div.tJ9zfc').each((i, elem) => {
      tempLocation.push($(elem).text().trim());
    });
    let companies = [];
    $('div.nJlQNd.sMzDkb').each((i, elem) => {
      companies.push($(elem).text().trim());
    });
    let data = [];
    $('div.ocResc.KKh3md').each((i, elem) => {
      data.push($(elem).text().trim());
    });
    let names = [];
    $('div.acCJ4b > div > span > div > span > a > div > div > span').each((i, elem) => {
      names.push($(elem).text().trim());
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        currentnum,
        titles,
        jobElements,
        descriptions,
        tempLocation,
        companies,
        data,
        names,
      }),
    };

    // Continue with other scraping tasks...
  } catch (error) {
    console.error("Error:", error);
  }
}

scrape();
