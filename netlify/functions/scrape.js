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
    const url = `https://www.google.com/async/callback:550?fc=EqIDCuICQUpHOUprT2t5RjJuc1MyamxBS3VMdnhrZDYzLW5JZkZKbGhNRFV5N2pyMGI5aHI2TXJ6b0x4empNTlIzZjNaQXp3LXVxb3BPUG42UXhrY3ZvZk9QWW9ob1dkbmRjT0dsUUxSWUJjNkstOGpCYmo5YTNiWk9SWEM3U2tsMUluVUJLNjNBZW8tTkFvOVo1eUN4ZnFQVlZoQktIWm4xREdzWU5ETWkzcjhOS3MxQWp1enAwNnZmYXZZUjlFLVdoekthektwSzJTTGxjQ0VjRnBOc2Fyd0thNnVOaE9sNlJ2cGNyUnR2OFZJd2lVaHRmWmUtVWV3LThqc0w1ODdWUU5uenZXQnI2LVZDbUxyRFQ4MFZVcm5KUkFtZVJjXzBfWkV3S2w1Nlh3M2QybGtVQmhiVlp0QzZ5aWNTeExwYkExTWtWQWROdHJqcGlUNk5zUHgta1hjaHlhUmYzQnpXYzBKcU9nEhdxRWszWjdLa082MmRpLWdQM2NEWC1BbxoiQUZYckVjcnNLdDlrUVh3SkFCeTFtRERmVzdZR3B4U0hldw&fcv=3&vet=12ahUKEwiymNr9td6JAxWtzgIHHV3gFa8Qw40IegQIDBAB..i&ei=qEk3Z7KkO62di-gP3cDX-Ao&opi=89978449&rlz=1C1EJFC_enMU844MU844&sca_esv=a1c2417e3bcb69eb&udm=8&yv=3&cs=1&async=_basejs:%2Fxjs%2F_%2Fjs%2Fk%3Dxjs.s.en_GB.JtTw-5sXhus.2018.O%2Fam%3DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAggAIEBAAAAAAAFPADAAAAQAgAAAAAAAAAAAAAJCAAgdAAAAABAAAAAMACAAAIGECAAABAAAAAAAgECAAAAAWIAPb7rwAAAAAAAAAAAABCACACAAAAAC4AAAgADQEAIAAIAAAADAAAABAAgAAAAKAAAEAAAAAAAAACAAAAAAAAAAAAAAgA6AcAAAAAAAAAAAAAAAgCAAAABNAACgAE8AMAAAAAAAAAAAAAEBAAAOAPGIAACAAAAAAAcB8APB4QDik8AAAAAAAAAAAAAAAAIAAJgjkg_QUBIAAAAAAAAAAAAAAAAAAAIEXQxOUGAAU%2Fdg%3D0%2Fbr%3D1%2Frs%3DACT90oH-u_w8wlWQXCvMmQmJcV_n-Ilgwg,_basecss:%2Fxjs%2F_%2Fss%2Fk%3Dxjs.s.e66pMxdVp0U.L.B1.O%2Fam%3DAFIHACEAAAAEAABEgAoAAgAAAAAAAAAAAAAAAAAAAAAAACQAAABACAAAAAAAEAAAiAAAACAAAIDgBfBD9gAA1hgAPgAAHBUADAAAIAAAAdAAAAAAAAAgAIAGAQAAEAAAAAAEAgAAAgiACABAAACFAAAAMAADAAAMAAAAAQBBAAEACGAAFCAACQgACAH0o4IAAAQADAAAQBAQjmAYQKgAwICDAAAAAAAAAAAAAEAAgBAAAAhAAQAQQACAHwAAwAIAoBmCAABBhIEAigAgAAAACAAAAAAIgEAAACBiAuAPGIAAAAAAAAAAAAkAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAQ%2Fbr%3D1%2Frs%3DACT90oETI7KaTe2oNpwCRP_XWbb3h4XArQ,_basecomb:%2Fxjs%2F_%2Fjs%2Fk%3Dxjs.s.en_GB.JtTw-5sXhus.2018.O%2Fck%3Dxjs.s.e66pMxdVp0U.L.B1.O%2Fam%3DAFIHACEAAAAEAABEgAoAAgAAAAAAAAAAAAAAAAAAAAAAACQAAABACAAAAAAAEAAgiAIEBCAAAIDgFfBD9gAA1hgAPgAAHBUADAAAJCAAgdAAAAABAAAgAMAGAQAIGECAAABEAgAAAgiECABAAAWNAPb7vwADAAAMAAAAAQBDACECCGAAFC4ACQgADQH0o4IIAAQADAAAQBAQjmAYQKgAwMCDAAAAAAACAAAAAEAAgBAAAAhA6QcQQACAHwAAwAIAoBmCAABBhNEAigAk8AMACAAAAAAIgEAAEDBiAuAPGIAACAAAAAAAcB8APB4QDik8AAAAAAAAAAAAAAAAIAAJgjkg_QUBIAAAAAAAAAAAAAAAAAAAIEXQxOUGAAU%2Fd%3D1%2Fed%3D1%2Fdg%3D0%2Fbr%3D1%2Fujg%3D1%2Frs%3DACT90oFQ0T4SgtVqPT7EdpDUn2rYL_JMfw,_fmt:prog,_id:fc_qEk3Z7KkO62di-gP3cDX-Ao_1`;

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
