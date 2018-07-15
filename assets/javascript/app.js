var database = null;
var registeredUserNameArray =[];
var registeredUserWidgetInfoObject ={};
var authenticatedUsername = "";
var toDoArray = [];

$(document).ready(function() {
    emptyLocalStorageForUnAuthenticatedUser();
    // a variable to reference the database
    database = initializeFirebase();
    deleteDatabaseInfo();
    saveWidgetStateButtonClickListener();
    authenticateButtonClickListener();
    registerButtonClickListener();
    // getUserNameListing();
    updateRegisteredUserNameArray();
    
    clickWidgetButtonListener();
    clearLocalStorageButtonListener(); //for local storage debugging only
    // draggableDivListener();
    resizableDivListener();
    newsCategoryButtonClickListener();
    cryptocurrencyRefreshButtonListener();
    generateWidgetFromLocalStorage();
    clickWidgetListener();
    searchCityWeatherEventListner();
    reStartClickedEventListner();
    clock();
    YTbuttonClickListener(); 
    gifListener(); 
    addToDoBtnClickListener();
    taskBtnClassClickListener();
});

function emptyLocalStorageForUnAuthenticatedUser() {
    if (!authenticatedUsername) {
        localStorage.clear();
    }
}

function initializeFirebase() {
    var config = {
        apiKey: "AIzaSyCyw-VuXSaB1S88dOXCjlg1z56xg66yyBI",
        authDomain: "personalized-dahsboard.firebaseapp.com",
        databaseURL: "https://personalized-dahsboard.firebaseio.com",
        projectId: "personalized-dahsboard",
        storageBucket: "",
        messagingSenderId: "135361166750"
    };
    firebase.initializeApp(config);
    return firebase.database();
}

function saveWidgetStateButtonClickListener() {
    $("#save-widget-state-button").on("click", function() {
        event.preventDefault();
        if (!authenticatedUsername) {
            displayFeedback("You have not registered and/or authenticated yet");
        } else {
            saveUserWidgetInfoToDatabase(authenticatedUsername);
            displayFeedback("Saved widget information");
            setTimeout(displayFeedback, 10 * 1000);
        }
    });   
}

function saveUserWidgetInfoToDatabase(username) {
    database.ref().child("users/" + username).update(getWidgetInfoFromLocalStorage());
}

function authenticateButtonClickListener() {
    $("#authenticate-button").on("click", function() {
        event.preventDefault();
        var username = $("#username").val();
        if (!isUsernameValid(username)) {
            displayFeedback("Please enter a valid username that must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
            // setTimeout(displayFeedback, 10 * 1000);
        } else if (isUsernameUnique(username)) {
            displayFeedback("The username " + username + " is not registered yet");
        }
        else {
            authenticatedUsername = username;
            if ("No preference set yet" !== registeredUserWidgetInfoObject[authenticatedUsername]) {
                setWidgetInfoToLocalStorage(registeredUserWidgetInfoObject[authenticatedUsername]);
                generateWidgetFromLocalStorage();
            }
            displayFeedback("Welcome back " + authenticatedUsername + "! You widgets are now displayed!");
            setTimeout(displayFeedback, 10 * 1000);
        }
        $("#username").val("");
        // database.ref().child("users").remove();
    });   
}

function registerButtonClickListener() {
    $("#register-button").on("click", function() {
        event.preventDefault();
        var username = $("#username").val();
        if (!isUsernameValid(username)) {
            displayFeedback("Please enter a valid username that must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
            // setTimeout(displayFeedback, 10 * 1000);
        } else if (!isUsernameUnique(username)) {
            displayFeedback("The username " + username + " is already registered");
        }
        else {
            registerUsername(username);
            displayFeedback("Registered the username: " + username);
            setTimeout(displayFeedback, 10 * 1000);
        }
        $("#username").val("");
        // database.ref().child("users").remove();
    });   
}

function isUsernameValid(username) {
    if (username === "") {
        return false;
    }

    var invalidCharacterArray = [".", "#", "$", "[", "]"];
    for (var i=0; i<invalidCharacterArray.length; i++) {
        var invalidCharacter = invalidCharacterArray[i];
        if (username.indexOf(invalidCharacter) !== -1) {
            return false;
        }
    }

    return true;
}

function isUsernameUnique(username) {
    for (var i=0; i<registeredUserNameArray.length; i++) {
        var currentUsername = registeredUserNameArray[i];
        if (username === currentUsername) {
            return false;
        }
    }

    return true;
}

// function getUserNameListing() {
//     database.ref().once("value", function(snapshot) {
//         console.log("inside getUserNameListing()");
//         registeredUserNameArray = [];
//         if (snapshot.val() && snapshot.val()["users"]) {
//             jQuery.each(snapshot.val()["users"], function(username, value) {
//                 registeredUserNameArray.push(username);
//             });
//             console.log("registeredUserNameArray: " + registeredUserNameArray);
//         }
//     });
// }

function updateRegisteredUserNameArray() {
    database.ref().on("value", function(snapshot) {
        console.log("inside updateRegisteredUserNameArray()");
        registeredUserNameArray = [];
        if (snapshot.val() && snapshot.val()["users"]) {
            jQuery.each(snapshot.val()["users"], function(username, value) {
                registeredUserNameArray.push(username);
                registeredUserWidgetInfoObject[username] = value;
            });
            console.log("registeredUserNameArray: " + registeredUserNameArray);
            console.log("registeredUserWidgetInfoObject: " + registeredUserWidgetInfoObject);
        }
    });
}

function registerUsername(username) {
    database.ref().child("users/" + username).set("No preference set yet");
}

function displayFeedback(message) {
    if (message) {
        $("#feedback-div").text(message);
    } else {
        $("#feedback-div").text("");
    }
}
function deleteDatabaseInfo() {
    $("#clear-database-button").on("click", function() {
        // database.ref().child("users").remove();
        database.ref().remove();
    });
}

function clock() {
    setInterval(function(){
        $("#clock").text(moment().format("dddd, MMMM Do, YYYY h:mm:ss A")); 
    }, 1 * 1000);
}

function clickWidgetButtonListener() {
    $(document).on("click", ".widget-btn", function() {
        var widgetName = $(this).attr("data-widget");
        if ($("#" + widgetName).length !== 0){
            $("#" + widgetName).remove();
            console.log("The " + widgetName+ " has been removed from the screen");
            updateWidgetInfoToLocalStorage("remove", widgetName);
        } else {
            generateAndDisplayWidgetContainer(widgetName);
            var addWidgetToLocalStorage = true;
            generateAndDisplayWidget(widgetName, addWidgetToLocalStorage);
        }
    });
}

function generateAndDisplayWidgetContainer(widgetName) {
    var dashboard = $("#dashboard");
    var widgetDiv = $("<div>");
    widgetDiv.addClass("resize-drag");
    // widgetDiv.addClass("draggable");
    widgetDiv.text(widgetName); //for debugging purposes only
    widgetDiv.attr("id", widgetName);
    dashboard.append(widgetDiv);
}

function generateAndDisplayWidget(widgetName, addWidgetToLocalStorage) {
    switch(widgetName) {
        case "weather":
            weatherWidget();
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName);
            }
            break;
            case "trivia":
            triviaWidget();
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName);
            }
            break;
        case "news":
            createNewsButtons();
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName);
            }
            break;
        case "bitcoin":
            bitcoinWidget();
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName);
            }
            break;
        case "youtube":
            youTubeWidget(); 
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName);
            }
            break;
        case "google-maps":
            console.log("google-maps");
            break; 
        case "gif": 
            gifWidget(); 
            if (addWidgetToLocalStorage) {
                updateWidgetInfoToLocalStorage("add", widgetName); 
            }
            break; 
        case "toDoList":
            createToDoInput();
            break;
        default:
            console.log("The " + widgetName+ " widget cannot be displayed on the dashboad at the moment");
    }
}

function clickWidgetListener() {
    $(document).on("click", ".resize-drag", function() {
        var widgetName = $(this).attr("id");
        console.log("clickWidgetListener() for widget: " + widgetName);
        updateWidgetInfoToLocalStorage("add", widgetName);
    });
}

function clearLocalStorageButtonListener() {
    $("#clear-localstorage-button").on("click", function() {
        localStorage.clear();
        location.reload();
    });
}

function getWidgetInfoFromLocalStorage() {
    if (localStorage.getItem("widgetInfoObject")) {
        return JSON.parse(localStorage.getItem("widgetInfoObject"));
    } else {
        return {};
    }
}

function setWidgetInfoToLocalStorage(widgetInfoObject) {
    localStorage.setItem("widgetInfoObject", JSON.stringify(widgetInfoObject));
}

function updateWidgetInfoToLocalStorage(update, widgetName) {
    var widgetInfoObject = getWidgetInfoFromLocalStorage();
    if (update === "add") {
        var widgetInDOM = $("#" + widgetName);
        var widgetInfo = {};
        widgetInfo["data-x"] = widgetInDOM.attr("data-x");
        widgetInfo["data-y"] = widgetInDOM.attr("data-y");
        widgetInfo["style"] = widgetInDOM.attr("style");

        widgetInfoObject[widgetName] = widgetInfo;
    } else if (update === "remove") {
        var isWidgetDeleted = delete widgetInfoObject[widgetName];
        console.log("Deleted " + widgetName + " from Local Storage? " + isWidgetDeleted);
    }
    setWidgetInfoToLocalStorage(widgetInfoObject);
}

function generateWidgetFromLocalStorage() {
    var widgetInfoObject = getWidgetInfoFromLocalStorage();
    $.each(widgetInfoObject, function(widgetName, widgetInfo){
        generateAndDisplayWidgetContainer(widgetName);
        var addWidgetToLocalStorage = false; //false because the widget already exists in local storage
        generateAndDisplayWidget(widgetName, addWidgetToLocalStorage);
        updateWidgetHtmlAttributes(widgetName, widgetInfo);
    });
}

function updateWidgetHtmlAttributes(widgetName, widgetInfo) {
    $.each(widgetInfo, function(attribute, value){
        $("#" + widgetName).attr(attribute, value);
    });
}

function createToDoInput() {
    $("#toDoList").append($("<div>").attr("id", "toDoRow"));
    $("#toDoRow").addClass("row");
    $("#toDoRow").append($("<div>").attr("id", "toDoColumn"));
    $("#toDoColumn").addClass("col-xs-12");
    $("#toDoColumn").append($("<form>").attr("id", "toDoForm"));
    $("#toDoForm").append($("<input>").attr("id", "toDoInput"));
    $("#toDoInput").attr("type", "text");
    $("#toDoForm").append($("<input>").attr("id", "addToDoBtn"));
    $("#addToDoBtn").attr("type", "submit");
    $("#addToDoBtn").attr("value", "Add a To-Do");
    $("#toDoColumn").append($("<div>").attr("id", "toDoLog"));
}

function addToDoBtnClickListener() {
    $(document).on("click", "#addToDoBtn", addToDoFunction);
}

function taskBtnClassClickListener() {
    $(document).on("click", ".taskBtnClass", removeToDoFunction);
}

function addToDoFunction() {
    event.preventDefault();
    var task = $("#toDoInput").val().trim();
    toDoArray.push(task);
    console.log("The task is: " + task);
    console.log(toDoArray)
    toDoListWidget();
}


function toDoListWidget() {
    $("#toDoLog").empty();
    for (i = 0; i < toDoArray.length; i++) {
        var taskDiv = $("<div>").append(toDoArray[i]);
        taskDiv.attr("data-task", toDoArray[i])
        var taskBtn = $("<button>").addClass("taskBtnClass");
        taskBtn.append("✓");
        taskBtn.attr("data-task", toDoArray[i])
        var breaker = "&nbsp;";
        var br = $("<br>");
        taskDiv.prepend(taskBtn, breaker);
        $("#toDoLog").append(br, taskDiv);
    }
}

function removeToDoFunction() {
    event.preventDefault();
    var task = $(this).attr("data-task");
    console.log("This is the task to delete: " + task);
    console.log("Before splice: " + toDoArray);
    var deletedTask = toDoArray.indexOf(task);
    console.log("This is what I'm getting index of: " + deletedTask);
    toDoArray.splice(deletedTask, 1);
    console.log("After the splice: " + toDoArray);
    toDoListWidget();

}


function newsCategoryButtonClickListener() {
    $(document).on("click", ".newsButtonClass", newsWidget);
}

function createNewsButtons() {
    $("#news").append($("<div>").attr("id", "newsRow"));
    $("#newsRow").addClass("row");
    $("#newsRow").append($("<div>").attr("id", "newsColumn"));
    $("#newsColumn").addClass("col-xs-12");
    var newsCategories = ["entertainment", "general", "health", "sports", "business", "technology"];
    for (var i = 0; i < newsCategories.length; i++) {
        var newsBtn = $("<button>").attr("data-newsType", newsCategories[i]);
        newsBtn.addClass("newsButtonClass");
        newsBtn.attr("id", newsCategories[i]);
        $("#newsColumn").append(newsBtn);
    }
    $("#entertainment").append("Entertainment");
    $("#general").append("General");
    $("#health").append("Health");
    $("#sports").append("Sports");
    $("#business").append("Business");
    $("#technology").append("Technology");
}

function newsWidget() {
    console.log(this);
    // API Key for Google News API
    var newsType = $(this).attr("data-newsType");
    var apikey = "86b4d5a66fce464bba3e6a4b7977c702";
    var queryUrl = "https://newsapi.org/v2/top-headlines?country=ca&category=" + newsType + "&pageSize=5&apiKey=" + apikey;
    getData(queryUrl, generateNewsWidgetHtml, displayNewsWidget);
}

function displayNewsWidget(newsWidgetHtml) {
    $("#news").html(newsWidgetHtml);
}

function cryptocurrencyRefreshButtonListener() {
    $(document).on("click", "#toRefreshBitcoin", bitcoinWidget);
}

function bitcoinWidget() {
    $("#bitcoin").append($("<div>").attr("id", "bitcoinRow"));
    $("#bitcoinRow").addClass("row");
    $("#bitcoinRow").append($("<div>").attr("id", "bitcoinColumn"));
    $("#bitcoinColumn").addClass("col-xs-12");
    $("#bitcoinColumn").append($("<div>").attr("id", "bitcoinResults"));
    
    // API Key for World Coin Index API
    var apikey = "O9zZJm0q0o0XnTTXUWGbkqI5sXdeON&label=ethbtc-ltcbtc&fiat=btc";
    var queryUrl = "https://www.worldcoinindex.com/apiservice/ticker?key=" + apikey;
    getData(queryUrl, generateBitcoinWidgetHtml, displayBitcoinWidget);
}

function generateBitcoinWidgetHtml(response) {
    console.log(response);
    $("#bitcoinResults").empty();
    var coinResults = response.Markets;
    for (var i = 0; i < coinResults.length; i++) {
        var coinName = coinResults[i].Name;
        var coinNameDiv = $("<p>").text("Coin: " + coinName);
        var coinPrice = coinResults[i].Price;
        var coinPriceDiv = $("<p>").text("Price: " + coinPrice + " CAD");
        var br = $("<br>");

        $("#bitcoinResults").append(coinNameDiv);
        $("#bitcoinResults").append(coinPriceDiv);
        $("#bitcoinResults").append(br);

    }
    var coinRefreshBtn = $("<button>").text("Refresh Prices");
    coinRefreshBtn.attr("id", "toRefreshBitcoin");
    $("#bitcoinResults").append(coinRefreshBtn);
}

function displayBitcoinWidget(bitcoinWidgetHtml) {
    $("#bitcoin").html(bitcoinWidgetHtml);
}

function weatherWidget(city) {
    // API Key for OpenWeatherMap API
    var apikey = "38eaa5467935a12d64ac94be4773f286";
    var cityName = "Toronto";
    if (city) {
        cityName = city;
    }
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apikey;
    getData(queryUrl, generateWeatherWidgetHtml, displayWeatherWidget);
}

function generateWeatherWidgetHtml(response) {
   
    var tempInfern  = (response.main.temp - 273.15) *1.80+32;
    var tempInCenti = (tempInfern -32)*5/9;
    console.log("tempInCenti :"+tempInCenti);
    var paresedtemp =  Math.round(tempInfern);
    var paresedCentiTemp =  Math.round(tempInCenti);
    var city= response.name;
    var humidity = response.main.humidity;
    var wind=response.wind.speed;
    var weather_icon = response.weather[0].icon;
    var weather_desc = response.weather[0].description;
    var weather_pressure = response.main.pressure+" hPa";
    var city=response.name;
   
    var card = $("<div>");
    card.addClass("card border-success xs-3");
    card.attr("style", "max-width: 18rem");
    
    var cardHeader = $("<div>");
    cardHeader.addClass("card-header");
   
    cardHeader.text("Weather for "+city+" , ON");
    var cardBody = $("<div>");
    cardBody.addClass("card-body text-primary weather-row");

    var icon_url = "http://openweathermap.org/img/w/";
    var newicon = icon_url+weather_icon+".png";
    cardBody.append("<div class=\"weather_icon\">"+ "<img src=\"" + newicon + "\"></div>");

    var cardBodyWeatherInfoDiv = $("<div>");
    cardBodyWeatherInfoDiv.addClass("weather-col");
    cardBodyWeatherInfoDiv.append($("<p>").addClass("temp").text(paresedtemp+"°F "+"  "+paresedCentiTemp +"°C"));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("desc").text(weather_desc));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("wind").text("wind :"+wind));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("humidity").text("humidity :"+humidity));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("pressure").text("Pressure :"+weather_pressure));
    cardBody.append(cardBodyWeatherInfoDiv);

    var cardFooter = $("<div>");
    cardFooter.addClass("card-footer bg-transparent border-success");
    var cityInput=$("<input>");
    cityInput.attr("id","search-weather");
    cityInput.attr("type","text");
    cityInput.attr(palceholder="Venice");
    cityInput.attr("value","");

    var citySubmitButton  = $("<button>");
    citySubmitButton.addClass("btn btn-default")
    citySubmitButton.attr("id","search");
    citySubmitButton.attr("type","submit");
    citySubmitButton.text("Submit");
    
    cardFooter.append(cityInput);
    cardFooter.append(citySubmitButton);
    
    card.append(cardHeader);
    card.append(cardBody);
    card.append(cardFooter);
    //colDiv.append(card);
    return card;
}

function displayWeatherWidget(weatherWidgetHtml) {
    $("#weather").empty();
    $("#weather").html(weatherWidgetHtml);
}

function searchCityWeatherEventListner() {
    $("body").on("click", "#search", function () {
        var city = $("#search-weather").val();
        weatherWidget(city);
  });
}

function generateNewsWidgetHtml(response) {
    $("#newsColumn").append($("<div>").attr("id", "newsResults"));
    $("#newsResults").empty();
    console.log(response);
    results = response.articles;
    for (var i = 0; i < results.length; i++) {
        var title = results[i].title;
        var titleDiv = $("<p>").text(title);
        var url = results[i].url;
        var urlDiv = $("<p>").append("<a href='" + url + "'target='_blank'>Read More</a>");
        urlDiv.addClass("readMoreBtn");
        var br = $("<br>");
        $("#newsResults").append(br);
        $("#newsResults").append(titleDiv);
        $("#newsResults").append(urlDiv);
    }
}

function YTbuttonClickListener() {
    $(document).on("click", "#YTbutton",function() {
        event.preventDefault();
        youTubeCreation();
    });
}

function youTubeWidget() {

    var breaker = $("<br><br>");
    var form = $("<form>").attr("id", "YTform");
    var youTubeSearch = $("<input>").attr("type", "text");
    youTubeSearch.attr("id", "youTubeInput");
    var youTubeButton = $("<input>").attr("type", "submit");
    youTubeButton.attr("id", "YTbutton");
    youTubeButton.attr("value", "Search YouTube!"); 

    var videoContainer = $("<div>").addClass("row"); 
    videoContainer.attr("id", "videoRow");
    var videoSubContainer = $("<div>").addClass("col-xs-12"); 
    videoSubContainer.attr("id", "videoColumn");
    var allVideosDiv = $("<div>").attr("id", "allVideos");
    $("#youtube").append(videoContainer);
    $("#videoRow").append(videoSubContainer);
    $("#videoColumn").append(form);
    $("#videoColumn").append(breaker, allVideosDiv);
    $("#YTform").append(youTubeSearch);
    $("#YTform").append(youTubeButton);

  }

  
function youTubeCreation() {
    console.log("Hi");
    var newTopic = $("#youTubeInput").val();
    var apiKey = "AIzaSyAYqrc7twpW4gYFibHNmf7dHCx3AHsBRqM";
    var queryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + newTopic + "&key=" + apiKey;
    getData(queryUrl, generateYouTubeWidgetHtml, displayYouTubeWidget);
}

function generateYouTubeWidgetHtml(response) {
    $("#allVideos").empty(); 
    for (var i = 1; i < 5; i++) {
        console.log(response);
        var videoID = response.items[i].id.videoId;
        var imgDiv = $("<div>").addClass("thumbnails"); 
        var br = $("<br>");
        var breaker = $("<br>");
        imgDiv.html("<img src=" + response.items[i].snippet.thumbnails.default.url + ">");
        $("#allVideos").append(imgDiv, br);

        var titleID = response.items[i].snippet.title.substring(0,60); 

        var videoLink = $("<p>").append("<a href='" + "https://www.youtube.com/watch?v=" + videoID+ "'target='_blank'>" + titleID + "</a>");
        videoLink.addClass("YTlink");

        $("#allVideos").append(videoLink, breaker);

    }
}   

function displayYouTubeWidget(youtubeWidgetHtml) {
    $("#youtube").append(youtubeWidgetHtml);
}

function gifListener() {
    $(document).on("click", "#gif",function() {
        event.preventDefault();
        gifWidget();
    })
}

function gifWidget() {
    var apikey = "AGOnLXwDOWiIu3oC7OMWNFsQCMAElFt4"
    var queryUrl = "http://api.giphy.com/v1/gifs/random?api_key=" + apikey+ "&limit=1";
    getData(queryUrl, generateGifWidgetHtml, displayGifWidget); 
}

function generateGifWidgetHtml(response) {
    $("#gif").empty(); 
    var gifContainer = $("<div>").addClass("row");
    var gifSubContainer = $("<div>").addClass("col-xs-12");

    var theGif = $("<img>").addClass("the-gif");
    theGif.attr("src", response.data.images.fixed_width.url);

    gifSubContainer.html(theGif);
    gifContainer.append(gifSubContainer);
    $("#gif").append(gifContainer);

}

function displayGifWidget(gifWidgetHtml) {
    $("#gif").append(gifWidgetHtml);
}


function triviaWidget() {
    getData("https://opentdb.com/api.php?amount=10", generateTriviaHTML, displayTriviaWidget);
}

var question_number = 0;
var triviaArray = [];
var correctAnswers = 0;
var inCorrectAnswers = 0;

function generateTriviaHTML(response) {
    triviaArray = response;
    var mainDiv = createHtmlTags("div", "class", "row", "");
    var colDiv = createHtmlTags("div", "class", "col-md-3", "");
    mainDiv.append(colDiv);

    var card = $("<div>");
    card.addClass("card border-primary mb-3");
    card.attr("style", "max-width: 15rem");

    var cardHeader = $("<div>");
    cardHeader.addClass("card-header");
    cardHeader.text("Trivia Game");

    var cardBody = $("<div>");
    cardBody.addClass("card-body text-primary weather-row");

    var gameDiv = $("<div>");
    gameDiv.attr("id", "gameDiv")
    gameDiv.show();

    var showAnswerDiv = $("<div>");
    showAnswerDiv.attr("id", "showAnswer")
    showAnswerDiv.hide();

    var resultDiv = $("<div>");
    resultDiv.attr("id", "resultDiv")
    resultDiv.hide();

    cardBody.append(gameDiv);
    cardBody.append(showAnswerDiv);
    cardBody.append(resultDiv);

    card.append(cardHeader);
    card.append(cardBody);

    return card;
}

//Load next quiz called at START START OVER and get next quiz
function loadNextQuiz() {
    var answerMath = [1, 2, 3, 4];
    var optH2 = [];
    var qDiv = document.getElementById("gameDiv");
    var qQuestion = triviaArray.results[question_number].question;
    var qH2 = createHtmlTags("h2", "class", "questions", qQuestion);

    var qOptions = [];
    qCorrectAnswer = triviaArray.results[question_number].correct_answer;
    qOptions = triviaArray.results[question_number].incorrect_answers;
    var pos = qOptions.indexOf(qCorrectAnswer);
    if (pos === -1) {
        console.log("pos :" + pos);
        answerPos = answerMath[Math.floor(Math.random() * answerMath.length)];
        qOptions.splice(answerPos, 0, qCorrectAnswer);
    }
    $("#gameDiv").empty();
    qDiv.append(qH2);
    for (var j = 0; j < qOptions.length; j++) {
        optH2[j] = document.createElement("h2");
        optH2[j].setAttribute("class", "answers");
        optH2[j].setAttribute("onclick", "optionsClicked(this)");
        optH2[j].setAttribute("onmouseover", "mOver(this)");
        optH2[j].setAttribute("onmouseout", "mOut(this)");
        optH2[j].innerHTML = qOptions[j];
        qDiv.append(optH2[j]);
    }
    question_number += 1;
}

// Called from OPTIONS selected by user
function optionsClicked(obj) {
    answerClicked = "true";
    var answerWrong = "Nope!!";
    var answerRight = "Correct!!";
    var answerCorrect = "Correct Answer Is: ";
    var answerSelected = obj.innerHTML;
    var aCommentH2 = document.createElement("h2");
    aCommentH2.setAttribute("id", "comment");
    aCommentH2.innerHTML = answerWrong;
    var aCorrectAnswerH2 = document.createElement("h2");
    aCorrectAnswerH2.setAttribute("id", "correctAnswerComment");
    var qCorrectAns = "";

    qCorrectAns = triviaArray.results[question_number - 1].correct_answer;
    aCorrectAnswerH2.innerHTML = answerCorrect + " " + qCorrectAns + "!!";

    if (answerSelected === qCorrectAns) {
        correctAnswers += 1;
        aCommentH2.innerHTML = answerRight;
    } else {
        inCorrectAnswers += 1;
    }
    document.getElementById("gameDiv").style.display = "none";
    document.getElementById("showAnswer").style.display = "block";
    loadAnswerDiv(aCommentH2, aCorrectAnswerH2);
};

function getNextQuiz() {
    document.getElementById("showAnswer").style.display = "none";
    if (question_number < triviaArray.results.length) {
        loadNextQuiz();
        document.getElementById("gameDiv").style.display = "block";
    }
    else {
        loadResultDiv();
    }
}

//Called from optionsClicked
function loadAnswerDiv(aCommentH2, aCorrectAnswerH2) {
    var aDiv = document.getElementById("showAnswer");
    var aNextButton = document.createElement("button");
    aNextButton.setAttribute("id", "nextQuiz");
    aNextButton.setAttribute("onclick", "getNextQuiz()");
    aNextButton.innerHTML = "Click Next";

    $("#showAnswer").empty();
    aDiv.append(aCommentH2);
    aDiv.append(aCorrectAnswerH2);
    aDiv.append(aNextButton);
}

//Called from get Next Quiz, if all questions are answered
function loadResultDiv() {
    var rcorrctAnsSpan = createHtmlTags("span", "id", "correctAnswer", "");
    var rincorrctAnsSpan = createHtmlTags("span", "id", "inCorrectAnswer", "");

    var rcorrectAnsP = createHtmlTags("p", "class", "answerP", "Correct Answer: ");
    rcorrectAnsP.append(rcorrctAnsSpan);

    var rincorrectAnsP = createHtmlTags("p", "class", "answerP", "InCorrect Answer: ");
    rincorrectAnsP.append(rincorrctAnsSpan);

    var rstartOverButton = createHtmlTags("button", "id", "reStartGame", "START OVER");
    var rStartOverDiv = createHtmlTags("div", "id", "startOver", inCorrectAnswers);
    rStartOverDiv.append(rstartOverButton);
    rcorrctAnsSpan.innerHTML = correctAnswers;
    rincorrctAnsSpan.innerHTML = inCorrectAnswers;

    document.getElementById("resultDiv").style.display = "block";
    answerClicked = "true";

    var rDiv = document.getElementById("resultDiv");
    var rH2 = document.createElement("h2");
    rH2.setAttribute("class", "allDone");
    rH2.innerHTML = "All Done!!";
    $("#resultDiv").empty();
    rDiv.append(rH2);
    rDiv.append(rcorrectAnsP);
    rDiv.append(rincorrectAnsP);

    rDiv.append(rStartOverDiv);
}

function createHtmlTags(elemnt, attributeType, attributeValue, innerHtmlVal) {
    var newHtmlTag = document.createElement(elemnt);
    newHtmlTag.setAttribute(attributeType, attributeValue);
    console.log("innerHtmlVal :" + innerHtmlVal.length);
    if (innerHtmlVal.length > 0) {
        newHtmlTag.innerHTML = innerHtmlVal;
    }
    return newHtmlTag;
}

function reStartClickedEventListner() {
    $("body").on("click", "#reStartGame", function () {
        correctAnswers = 0;
        inCorrectAnswers = 0;
        question_number = 0;
        document.getElementById("resultDiv").style.display = "none";
        document.getElementById("gameDiv").style.display = "block";
        triviaWidget();
    });
}

function mOver(obj) {
    obj.style.backgroundColor = "#1ec5e5";
}
//Attachd to options
function mOut(obj) {
    obj.style.backgroundColor = "#ffffff";
}

function displayTriviaWidget(triviaWidgetHtml) {
    $("#trivia").html(triviaWidgetHtml);
    loadNextQuiz();
}

function getData(queryUrl, generateWidgetHtml, displayWidget) {
    console.log(queryUrl);
    $.ajax({
        url: queryUrl,
        success: function(response) {
            var widgetHtml = generateWidgetHtml(response);
            displayWidget(widgetHtml);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Sorry, invalid request.");
            console.log("textStatus: " + textStatus + " errorThrown: " + errorThrown);
        }
    });
}

// function draggableDivListener() {
//     // target elements with the "draggable" class
//     interact('.draggable')
//     .draggable({
//         // enable inertial throwing
//         inertia: true,
//         // keep the element within the area of it's parent
//         restrict: {
//             restriction: "parent",
//             endOnly: true,
//             elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
//         },
//         // enable autoScroll
//         autoScroll: true,

//         // call this function on every dragmove event
//         onmove: dragMoveListener,
//         // call this function on every dragend event
//         onend: function (event) {
//             var textEl = event.target.querySelector('p');

//             textEl && (textEl.textContent =
//                 'moved a distance of '
//                 + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
//                     Math.pow(event.pageY - event.y0, 2) | 0))
//                 .toFixed(2) + 'px');
//         }
//     });
// }

function dragMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;


function resizableDivListener() {
    // target elements with the "resize-drag" class
    interact('.resize-drag')
    .draggable({
        onmove: window.dragMoveListener,
        restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
    })
    .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

            // keep the edges inside the parent
            restrictEdges: {
            outer: 'parent',
            endOnly: true,
        },

        // minimum size
        restrictSize: {
        min: { width: 100, height: 50 },
        },

        inertia: true,
    })
    .on('resizemove', function (event) {
        var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    });
}