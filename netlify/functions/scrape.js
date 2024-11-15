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
    const url = `https://www.google.com/async/callback:550?fc=EssFCowFQUpHOUprUHU3Q3Q1MHdfcEZ6a1QwVkQ3c2VfY3JKODZGdnhLZzBia2RYOWZCT3pUUVhNQTk4bm1aWEozYUw2NHFxTnpGcVhWbThYOVhVLUtMOEVPQ0NEWVU4LTB1NWhHQ3B2RERiWkFNOXM2THFUX2g4bU9IX0xEX0ZWd1lHZUt0VHdqc1ZkSk5UUll1MGtXSkx0MW1zdkdpNE5wYkgyS2Z5YXJ5Rk9UVDFnclpQb3FLOU5JQXp3MDNHV29Rb0xEV0ZwclRiMnhEalloaFZlWXN2ZWgzSDJ3QlR5UXRqUkRBRXlXdWp0WGNaNlozU1BoQ2hzcWwxWlZlb1lFWXhTbW9WZFpZVk9EYWJvREE5WFVkaFpYQnE4UHpXQ1pqcHR5VVNWaVVMdUhFM21sTWlYNjdLWVBSdVdKOUNBODlkQmJDeTI5YXN2Sk82b3pqeUx5dkFuQk4wTHozYTlNRHYzVHhuNVhjRkI2a0FmQnQ0RVJlMnh6R1FGQ2FfOF9seUFXVGhqVHZ4U002MV9EU0s1WE9pMDZpWkNIaWppMURlWUFJdXBUaHhZcEhaNTEteDhhXzg2bnZTeUZsd0ZXYU0zakQ4QlRJclRFZGRuRGRKcUxtLXgxODVnMng0SUpLQlh1RGNCbGViY05LSHp0dEQzdmZ5T1Brc2dhV0VLZFVyYjZuR2tvMkhiZTdYZTQ3dUtwMlVrY2NHRENkN2RINWhYUlNoZWF2ak1uOEVZWlNJSjBicUF5V3p4aHgwQVNET2FwSHpuck5heVdSalZhNTE0TXU4bEZvZ3BDUFBYS1NjdmRpdGxiZnozRmxFMHRXVWdONTNtQ0dwenZQRWFCMmQ3Z1M2ZElDemxrY2hkYRIWck5FMlpfeFNzbzNGenctNHh1NjVDZxoiQUZYckVjcGFDLXIzVFJtaVNfTmw2YzI0eFJ5UnlqVHFmZw&fcv=3&vet=12ahUKEwj82NvGw92JAxWyRvEDHTijO6cQw40IegQIAxAB..i&ei=rNE2Z_xSso3Fzw-4xu65Cg&opi=89978449&rlz=1C1EJFC_enMU844MU844&sca_esv=d3120922bcdac98d&udm=8&yv=3&cs=1&async=_basejs:%2Fxjs%2F_%2Fjs%2Fk%3Dxjs.s.en_GB.u7yJ9bpIWmE.2018.O%2Fam%3DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAggAIEBAAAAAAAFPADAAAAQAgAAAAAAAAAAAAAJCAAgdAAAAABAAAAAMACAAAIGECAAABAAAAAAAgECAAAAAWIAPb7rwAAAAAAAAAAAABCACACAAAAAC4AAAgADQEAIAAIAAAADAAAABAAgAAAAKAAAEAAAAAAAAACAAAAAAAAAAAAAAgA6AcAAAAAAAAAAAAAAAgCAAAABNAACgAE8AMAAAAAAAAAAAAAEBAAAOAPGIAACAAAAAAAcB8APB4QDik8AAAAAAAAAAAAAAAAIAAJgjkg_QUBIAAAAAAAAAAAAAAAAAAAIEXQxOUGAAU%2Fdg%3D0%2Fbr%3D1%2Frs%3DACT90oGm6lpCDA7RJR98XRFAR7t9Kz1ZWA,_basecss:%2Fxjs%2F_%2Fss%2Fk%3Dxjs.s.IsLhK8znwXY.L.B1.O%2Fam%3DAFIHACEAAAAEAABEgAoAAgAAAAAAAAAAAAAAAAAAAAAAACQAAABACAAAAAAAEAAAiAAAACAAAIDgBfBD9gAA1hgAPgAAHBUADAAAIAAAAdAAAAAAAAAgAIACAQAAEAAAAAAEAgAAAgiACABAAACFAAAAMAADAAAMAAAAAABBAAEACGAAFCAACQgACAH0o4IAAAQADAAAQBAQjmAYQKgAwICDAAAAAAAAAAAAAEAAgBAAAAhAAQAQQACAHwAAwAIAoBmCAABBhIEAigAgAAAACAAAAAAIgEAAACBiAuAPGIAAAAAAAAAAAAkAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAQ%2Fbr%3D1%2Frs%3DACT90oHAq1YL8OqF078W6QN4ykyNjMgQPg,_basecomb:%2Fxjs%2F_%2Fjs%2Fk%3Dxjs.s.en_GB.u7yJ9bpIWmE.2018.O%2Fck%3Dxjs.s.IsLhK8znwXY.L.B1.O%2Fam%3DAFIHACEAAAAEAABEgAoAAgAAAAAAAAAAAAAAAAAAAAAAACQAAABACAAAAAAAEAAgiAIEBCAAAIDgFfBD9gAA1hgAPgAAHBUADAAAJCAAgdAAAAABAAAgAMACAQAIGECAAABEAgAAAgiECABAAAWNAPb7vwADAAAMAAAAAABDACECCGAAFC4ACQgADQH0o4IIAAQADAAAQBAQjmAYQKgAwMCDAAAAAAACAAAAAEAAgBAAAAhA6QcQQACAHwAAwAIAoBmCAABBhNEAigAk8AMACAAAAAAIgEAAEDBiAuAPGIAACAAAAAAAcB8APB4QDik8AAAAAAAAAAAAAAAAIAAJgjkg_QUBIAAAAAAAAAAAAAAAAAAAIEXQxOUGAAU%2Fd%3D1%2Fed%3D1%2Fdg%3D0%2Fbr%3D1%2Fujg%3D1%2Frs%3DACT90oE-4LsT0AA-0eafpMsLfG8W5ji4SA,_fmt:prog,_id:fc_rNE2Z_xSso3Fzw-4xu65Cg_1`;

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
    $('div.BjJfJf.PUpOsf').each((i, elem) => {
      currentnum.push($(elem).text().trim());
    });
    let titles = [];
    $('div.BjJfJf.PUpOsf').each((i, elem) => {
      titles.push($(elem).text().trim());
    });
    let jobElements = [];
    $('a.pMhGee.Co68jc.j0vryd').each((i, elem) => {
      jobElements.push($(elem).attr('href'));
    });
    let descriptions = [];
    $("span.HBvzbc").each((i, elem) => {
      descriptions.push($(elem).text().trim());
    });
    let tempLocation = [];
    $('div.wHYlTd MKCbgd a3jPc').each((i, elem) => {
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
