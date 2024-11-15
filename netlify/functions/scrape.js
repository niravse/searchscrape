const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
  // Handle preflight requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow specific headers
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allow specific methods
      },
      body: '' // Preflight requests usually don't require a body
    };
  }

  try {
    const searchQuery = event.queryStringParameters.searchQuery || '';
    const page = event.queryStringParameters.page || 0;
    const url = `https://www.google.com/search?sca_esv=a1c2417e3bcb69eb&rlz=1C1EJFC_enMU844MU844&sxsrf=ADLYWIIQeQqzjbfJd05-NpNkbyyevY0gCg:1731674939372&q=software+jobs&udm=8&fbs=AEQNm0AZpliKpP9UPZH_QyJIQmccutwAzO9YcB1Q2LeUwcZe6fF8idJfmar-8eXETo5qIYuU-ViPdHfnThC_X4I2ZTsbWtrWgJymRBq1ONw1UsU-T8K8h25kaDUcxZw7otVJS9d-ii0KrkiUyMXdihN8P2q6-sCCrh1pjbo49Uli2ReiHKFEyI7qznEPFFXsTjiT7vOeulpb&sa=X&ved=2ahUKEwjls4Ltr96JAxU_Z_EDHcbgGEQQs6gLegQIGRAB&biw=1366&bih=641&dpr=1&jbr=sep:0`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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

    if (linksnum !== 0) {
      numofLinks.push(linksnum);
    }

    let currentnum = [];
    $('div.tNxQIb.PUpOsf').each((i, elem) => {
      currentnum.push($(elem).text().trim());
    });
    let titles = [];
    $('div.tNxQIb.PUpOsf').each((i, elem) => {
      titles.push($(elem).text().trim());
    });
    let jobElements = [];
    $('a.pMhGee.Co68jc.j0vryd').each((i, elem) => {
      jobElements.push($(elem).attr('href'));
    });
    let descriptions = [];
    $("span.hkXmid").each((i, elem) => {
      descriptions.push($(elem).text().trim());
    });
    let tempLocation = [];
    $('div.wHYlTd MKCbgd a3jPc').each((i, elem) => {
      tempLocation.push($(elem).text().trim());
    });
    let companies = [];
    $('div.waQ7qe.cS4Vcb-pGL6qe-ysgGef').each((i, elem) => {
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
      headers: {
        'Access-Control-Allow-Origin': '*',// Allow requests from any origin
      },
      body: JSON.stringify({
        numofLinks,
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
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Include CORS headers in error response as well
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
