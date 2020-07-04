var apiKey = "&api-key=xu3AN0ZljaMEZMnlMGOszPWXqwlST71D";

//When Search Button is clicked, initiate function
$('#form-button-search').on('click', function () {
    event.preventDefault();
    $('#results-list').empty();

    //collect variables for constructing the queryURL
    //SEARCH TERM
    var term = $('#form-search-term').val(); //REQUIRED
    var queryTerm = '?query=' + term;
    if(term===''){
        $('#form-search-term').attr('placeholder', 'You must enter a search term!');
        $('#form-search-term').on('keydown', function(){
            location.reload();
        })
    }

    //MAX RESULTS
    var maxNumber = Number($('#form-result-number').val()); //REQUIRED
    console.log('Max number = ', maxNumber);
    if(maxNumber=='0'){
        $('#form-result-number').attr('placeholder', 'You must enter a number between 1 - 10!');
        $('#form-result-number').on('keydown', function(){
            location.reload();
        })
    }

    queryArray = [queryTerm];

    //START DATE
    var startYr = $('#form-start-year').val();
    console.log('This is the StarYr: ' + startYr);
    var startDate;
    if (startYr) {
        startDate = '&begin_date=' + startYr.toString().split('-').join('');
        queryArray.push(startDate);
        console.log('This is the StartDate: ', startDate);
    };

    //END DATE
    var endYr = $('#form-end-year').val();
    var endDate;
    if (endYr) {
        endDate = '&end_date=' + endYr.toString().split('-').join('');
        queryArray.push(endDate);
        console.log('This is the EndDate: ', endDate);
    };

    var queryURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    
    createQueryURL(queryArray, queryURL);
    function createQueryURL() {
        for (var i = 0; i < queryArray.length; i++) {
            if (queryArray[i] !== '') {
                queryURL += queryArray[i];
            };
        };
        queryURL += '&sort=newest' + apiKey;
        console.log('The queryURL inside the for loop = ', queryURL);
        return queryURL;
    };
    
    console.log('This is queryURL: ', queryURL);

    //Initiate API call with queryURL and maxNumber parameters
    apiCall(queryURL, maxNumber);

});

function apiCall(URL, num) {
    $.ajax({
        url: URL,
        method: 'GET'
    }).then(function (response) {
        var results = response.response.docs;
        //Use the Number of records input to generate a for loop that will dynamically generate results containers
        
        for (var i = 0; i < num; i++) {
            //Retrieve the result elements and use them to populate the generated page elements
            var newDate = moment(results[i].pub_date).format('MMMM DD YYYY');

            //Append the elements to the Results Container
            var cardContainer = $('<div>')
            cardContainer.attr('class', 'card mb-3').appendTo('#results-list');
            var cardInnerContainer = $('<div>');
            cardInnerContainer.attr({ class: 'row no-gutters', id: 'results-wrapper' }).appendTo(cardContainer);
            var cardBody = $('<div>');
            cardBody.attr('class', 'card-body').appendTo(cardInnerContainer);
            var url = $('<a>');
            url.attr('href', results[i].web_url).appendTo(cardBody);
            var headline = $('<h5>');
            headline.attr('class', 'card-title').text(results[i].headline.main).appendTo(url);
            var pubDate = $('<p>');
            pubDate.attr('class', 'card-text').text('Pub Date: ' + newDate).appendTo(cardBody);
            var abstract = $('<p>');
            abstract.attr('class', 'card-text').text(results[i].abstract).appendTo(cardBody);
            var section = $('<p>');
            section.attr('class', 'card-text').text('Section: ' + results[i].section_name).appendTo(cardBody);
            var bylineContainer = $('<p>');
            bylineContainer.attr('class', 'card-text').appendTo(cardBody);
            var byline = $('<small>');
            byline.attr('class', 'text-muted').text(results[i].byline.original).appendTo(bylineContainer);
        };
    });
};

//Clear Function 
//When Clear Button is clicked, clear all search fields and search results
$('#form-button-clear').on('click', function () {
    $('#results-list').empty();
    $('#form-search-term').val('');
    $('#form-result-number').val('');
    $('#form-start-year').val('');
    $('#form-end-year').val('');
});