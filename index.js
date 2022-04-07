const express = require('express');
const xmlgenerator = require('sitemap-generator');
const fs = require('fs');

// Sets up the Express.js App
const app = express();

app.set('view engine', 'ejs'); 

const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('webcrawler', {title: "David Ohayon's Web Crawler"})
})

app.post('/', (req, res) => {
    // Gets the URL typed by the user. 
    var url = req.body.url;  

    // Name of the XML file that will be downloaded
    var finalFile = "output.xml";

    // Package function that will generate the Sitemap
    const generator = xmlgenerator(url, {
        stripQuerystring: false,
        filepath: finalFile,
        priorityMap: [1.0, 0.8, 0.6, 0.4, 0.2, 0]
    });

    // Sets up event  listeners
    generator.on('done', () => {
        // Runs when the site map is created, outputs an XML file.
        res.download(finalFile, (err) => {
            if (err) {
                // Sends an error if anything goes wrong.
                fs.unlinkSync(finalFile);
                res.send(err);
            }
            // Outputs the XML file. 
            fs.unlinkSync(finalFile)
        });
    });

    generator.on('error', (error) => {
        // Prints an error message if something went wrong while fetching a URL.
        // An object with the http status code, a message and the URL will be printed. 
        console.log(error);
    }),

    // Starts the Crawler
    generator.start();

});

// Access the Webpage on: "localhost:1000"
app.listen(1000);
