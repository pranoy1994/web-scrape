var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
const scrapeIt = require("scrape-it");
var tabletojson = require('tabletojson');

router.get('/get-hs-scores', (req, res) => {

    var theUrl = "http://tourneymachine.com/Public/Results/Division.aspx?IDTournament=h20171018142428327245ada17a12c44&IDDivision=h201710181438463598c0556dae69544";
    const url = "https://scores.newsday.com/sports/highschool/scores/lacrosse-boys/suffolk";

    var options = {
        url : url, 
        headers: {
           'User-Agent': 'request'
        }
    };
    request(options, (error, response, body) => {
        //console.log(body);
        //res.send(body);
        const $ = cheerio.load(body);
        var theScores = [];

$('.tabContent').each(function() {
	if($(this).attr('style') == "display: block;") {
		
		var scores = [];
		$(this).children().each(function(i) {
			if(!$(this).is('p')){
				//console.log(sendTheScoresPerTable(this));
				scores.push(sendTheScoresPerTable(this));
            }
			else {
					scores = [];
                    theScores.push({
                       date: $(this).html(), 
                        scores: scores
                    });
					
						
					
                    				
				

			}
		})
		
		console.log(this)
	}
})


function sendTheScoresPerTable(element) {
	var theScores = [];
	$(element).find('tbody').each(function(){
		var theObj = {};
		$(this).find('th').each(function(i) {
			if(i == 0){
				theObj.key = $(this).html().trim();
			}else {
				theObj.value = $(this).html().trim();
				theScores.push(theObj);
				theObj = {};
			}
		})

		$(this).find('td').each(function(j) {
			if(j == 0){
				theObj.key = $(this).html().trim();
			}else if(j == 1){
				theObj.value = $(this).html().trim();
				theScores.push(theObj);
				theObj = {};
			}else if(j == 2){
				theObj.key = $(this).html().trim();
			}else {
				theObj.value = $(this).html().trim();
				theScores.push(theObj);
				theObj = {};
			}
		})
	})
	return theScores;
}
    res.send(theScores);
    })
});

// var theScores = [];

// $('.tabContent').each(function() {
// 	if($(this).attr('style') == "display: block;") {
		
// 		var scores = [];
// 		$(this).children().each(function(i) {
// 			if(!$(this).is('p')){
// 				//console.log(sendTheScoresPerTable(this));
// 				scores.push(sendTheScoresPerTable(this));
//             }
// 			else {
// 					scores = [];
//                     theScores.push({
//                        date: $(this).html(), 
//                         scores: scores
//                     });
					
						
					
                    				
				

// 			}
// 		})
		
// 		console.log(this)
// 	}
// })


// function sendTheScoresPerTable(element) {
// 	var theScores = [];
// 	$(element).find('tbody').each(function(){
// 		var theObj = {};
// 		$(this).find('th').each(function(i) {
// 			if(i == 0){
// 				theObj.key = $(this).html().trim();
// 			}else {
// 				theObj.value = $(this).html().trim();
// 				theScores.push(theObj);
// 				theObj = {};
// 			}
// 		})

// 		$(this).find('td').each(function(j) {
// 			if(j == 0){
// 				theObj.key = $(this).html().trim();
// 			}else if(j == 1){
// 				theObj.value = $(this).html().trim();
// 				theScores.push(theObj);
// 				theObj = {};
// 			}else if(j == 2){
// 				theObj.key = $(this).html().trim();
// 			}else {
// 				theObj.value = $(this).html().trim();
// 				theScores.push(theObj);
// 				theObj = {};
// 			}
// 		})
// 	})
// 	return theScores;
// }



module.exports = router;