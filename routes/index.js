var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
const scrapeIt = require("scrape-it");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape', (req, res) => {
  var url = 'http://www.imdb.com/title/tt1229340/';
       request(url, function(error, response, html){
          if(!error){
              
              var $ = cheerio.load(html);
              var title, release, rating;
              var json = { title : "", release : "", rating : ""};
              res.send({$});
          }
          console.log(error);
          //res.send(error);
      });
      //res.send({no:"398439847"});
});

router.get('/scrape2', (req, res) => {
  scrapeIt("https://ionicabizau.net", {
    title: ".header h1"
  , desc: ".header h2"
  , avatar: {
        selector: ".header img"
      , attr: "src"
    }
}).then(page => {
    console.log(page);
    res.send(page);
})

});

router.get('/scrape3', (req, res) => {

  var theUrl = "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544";
  scrapeIt(theUrl, {
    theData: {
      listItem: "td.statColumn",
      name: "data",
      data: {
        w2: "td"
      }
    }
  }).then(page => {
    console.log(page);
    res.send(page);
})
});
var theUrl = "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544";
var scraper = require('table-scraper');
router.get('/scrape4', (req, res) => {
  var theUrl = "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544";
  
  scraper.get(theUrl).then(function(tableData) {
      console.log(theData);
      res.send(theData);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
}); 
var tabletojson = require('tabletojson');
router.get('/scrape5', (req, res) => {
  tabletojson.convertUrl(
    theUrl,
    
    function(tablesAsJson) {
      console.log(tablesAsJson);
      res.send(tablesAsJson);
    }
  );
});

//this is the working route
router.post('/scrape6', (req, res) => {
var iamtheurl= req.body.url;
  console.log(iamtheurl);
  var options = {
   // url: "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544",
   url : iamtheurl, 
   headers: {
      'User-Agent': 'request'
    }
  };
   
  function callback(error, response, body) {

    var tablesAsJson = tabletojson.convert(body);
    var arr  = [];
    var index = 2
    tablesAsJson.forEach((d) => {
      if(d[0].hasOwnProperty('Team') && d[0].hasOwnProperty('W')) {
        arr.push(d);
      }

      if(d[0].hasOwnProperty('Team_'+ index) && d[0].hasOwnProperty('W_'+ index)) {
        arr.push(d);
        index++;
      }
      //index++;
    });
    res.send(arr);
 }
  request(options, callback);
});
module.exports = router;
