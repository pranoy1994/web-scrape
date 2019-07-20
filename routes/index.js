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


//----------------------------------------------------------------
var theArray = [];
//this is the working route
router.post('/scrape6', (req, res) => {
var iamtheurl= req.body.url;
  //console.log(iamtheurl);
  var options = {
   url : iamtheurl, 
   headers: {
      'User-Agent': 'request'
    }
  };
   
  function callback(error, response, body) {



    $ = cheerio.load(body);
    links = $('td'); //jquery get all hyperlinks
    $(links).each(function(i, link){
      //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
      theArray.push({text : $(link).text().trim(), link: $(link).find('a').attr('href')});
    });



    var tablesAsJson = tabletojson.convert(body);
    var arr = convertTable (tablesAsJson);
    var newArr = [];
    var teamCounter=0;
    arr.forEach((theObj, i) => {
      
      theObj.forEach((x) => {
        //console.log(x);
        teamCounter++;
        theArray.forEach((t) => {
          //console.log(i);
          if(i==0) {
            if(t.text == x['Team']) {
            x.TeamLink = "http://tourneymachine.com/Public/Results/" + t.link;
            //console.log(x);
          }
          }else {
            if(t.text == x['Team_' + (i+1)]) {
            x.TeamLink = "http://tourneymachine.com/Public/Results/" + t.link;
            console.log(x);
          }
          }
          
          
      });
      });
      
      newArr.push(theObj);
      
    });
    
    //res.send(newArr);

    var theArr2 = [];
    newArr.forEach((obj, i) => {
      obj.forEach((theObj) => {

      

      var options = {
        url : theObj.TeamLink, 
        headers: {
           'User-Agent': 'request'
         }
       };


       function callback2(error, response, body) {
        // var tablesAsJson = tabletojson.convert(body);
        // var theFinalData = getTheInsideData(tablesAsJson);


        var $ = cheerio.load(body);

        var theScore = [];
        $('.schedule_row').each(function(index, value) {
          
          var score = {}
          $(value).find('td').each(function(i) {
            
            if($(this).html().trim() != ""){
              if(i>2){
              
                console.log($(this).text().trim())
                if(i == 3) score['Team'] = $(this).text().trim();
                if(i == 4) score['Score'] = $(this).text().trim();
                if(i == 5) score['Team_2'] = $(this).text().trim();
                if(i == 6) {
                   score['6'] = $(this).text().trim();
                    theScore.push(score);
                }
              }
            }
            
          })
          
          
        })
        var theFinalData = theScore;



        var final = [];
        theFinalData.forEach(function(s) {
            var obj = {
              '6' : s['6'],
              Team : s.Team,
              "Score" : s.Score,
            "Team_2" : s['Team_2']
            }
          final.push(obj);
        });
        theObj.teamData = final;
        theArr2.push(theObj);
        console.log(newArr.length);
        if(teamCounter == theArr2.length){
          res.send([theArr2, newArr.length, teamCounter]);
        }
        // if(newArr.length == i+1) {
        //   res.send(theArr2); 
        // }
        //res.send(theArr2); 
        //console.log(theArr2);
        //res.send(tablesAsJson);
        // if(theArr2.length == newArr.length){
        //     res.send([theArr2]);
        // }
        
      }
        request(options, callback2);
      });
    });
   
  
  


    // res.send(newArr);
    // res.send(theArray);
 }
  request(options, callback);
});

//this function converts the table to the required json format 
function convertTable (tablesAsJson) {

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
  });
 return arr;


}


function getTeamInfo(teamName) {

  var theLink;//this link will contain the performance report of the team that are in the table
  theArray.forEach((obj) => {
    if(obj.text == teamName) {
      theLink = obj.link;
    }
  });

  var options = {
    // url: "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544",
    url : "http://tourneymachine.com/Public/Results/"+theLink, 
    headers: {
       'User-Agent': 'request'
     }
   };
   return theLink;
}





//----------------------------------------------------------------------------------------------------------

router.post("/the-scrape", (req, res) => {

  var iamtheurl= req.body.url;
  //console.log(iamtheurl);
  var options = {
   url : iamtheurl, 
   headers: {
      'User-Agent': 'request'
    }
  };


     
  function callback(error, response, body) {
    var tablesAsJson = tabletojson.convert(body);
    var theFinalData = getTheInsideData(tablesAsJson);
    res.send(theFinalData);
    //res.send(tablesAsJson);
  }
    request(options, callback);




});

function getTheInsideData(theTeamData) {

  var theReqData = [];
  theTeamData[4].forEach((theObject) => {
    if(theObject.hasOwnProperty('Team')) {
      theReqData.push(theObject);
    }
  });

  return theReqData;
}
//-----------------------------

var linkscrape = require("linkscrape");

//this will be the test route
router.post('/test-scrape', (req, res) => {

  console.log("here 1");
  var url= req.body.url;

  var options = {
    // url: "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544",
    url : url, 
    headers: {
       'User-Agent': 'request'
     }
   };
  request(options, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a'); //jquery get all hyperlinks
  var theArray = [];
  $(links).each(function(i, link){
    //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
    theArray.push({text : $(link).text().trim(), link: $(link).attr('href')});
  });
  res.send(theArray);
});

});

module.exports = router;
