const fs = require('fs');
const http = require('http');
const url = require('url');

const port = 3000;
const hostname = '127.0.0.1'; 

//Replace
const replaceTemplate = require('./modules/replaceTemplate');


//Take a html file from template
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

//Take all data from data.json
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Start Server
const server = http.createServer((req, res) => {

    const pathName = req.url;
    const { query, pathname } = url.parse(req.url, true);

    //Routering
    //Overview page
    if(pathname === '/' || pathname === '/overview') {

        //Method map
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

        //Take all product cards 
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        //Show all products
        res.end(output);
        res.writeHead(200, {'Constent-type': 'text/html'});

    //Product page    
    } else if(pathname === '/product'){

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API    
    } else if(pathname === '/api') {
        res.end(data); 
    } else {
        res.end('pade not found');
    }
});

server.listen(port, hostname, () => {
    console.log('listening on port 3000')
});
