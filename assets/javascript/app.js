$(document).ready(function() {
    clickWidgetButtonListener();
    clearLocalStorageButtonListener(); //for local storage debugging only
    // draggableDivListener();
    resizableDivListener();
    newsCategoryButtonClickListener();
    cryptocurrencyRefreshButtonListener();
    generateWidgetFromLocalStorage();
    clickWidgetListener();
});

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
        console.log("Cleared Local Storage");
    });
}

function getWidgetInfoFromLocalStorage() {
    if (localStorage.getItem("widgetInfoObject")) {
        return JSON.parse(localStorage.getItem("widgetInfoObject"));
    } else {
        return {};
    }
}
function updateWidgetInfoToLocalStorage(update, widgetName) {
    // <div 
    // class="resize-drag" 
    // id="weather" 
    // data-x="337.08203125" 
    // data-y="59.9140625" 
    // style="transform: translate(337.082px, 59.9141px);">
    var widgetInfoObject = getWidgetInfoFromLocalStorage();
    if (update === "add") {
        var widgetInDOM = $("#" + widgetName);
        var widgetInfo = {};
        // widgetInfo["class"] = widgetInDOM.attr("class");
        // widgetInfo["id"] = widgetInDOM.attr("id");
        widgetInfo["data-x"] = widgetInDOM.attr("data-x");
        widgetInfo["data-y"] = widgetInDOM.attr("data-y");
        widgetInfo["style"] = widgetInDOM.attr("style");

        console.log("inside updateWidgetInfoToLocalStorage(): widgetName: " + widgetName +": widgetInfo: " + JSON.stringify(widgetInfo));
        widgetInfoObject[widgetName] = widgetInfo;
        // localStorage.setItem("widgetInfoObject", JSON.stringify(widgetInfoObject));
    } else if (update === "remove") {
        var isWidgetDeleted = delete widgetInfoObject[widgetName];
        console.log("Deleted " + widgetName + " from Local Storage? " + isWidgetDeleted);
    }
    localStorage.setItem("widgetInfoObject", JSON.stringify(widgetInfoObject));
}

function generateWidgetFromLocalStorage() {
    var widgetInfoObject = getWidgetInfoFromLocalStorage();
    console.log("widgetInfoObject: " + widgetInfoObject);
    $.each(widgetInfoObject, function(widgetName, widgetInfo){
        console.log("Generating the " + widgetName + " widget");
        generateAndDisplayWidgetContainer(widgetName);
        // console.log("done with generateAndDisplayWidgetContainer(widgetName)");
        var addWidgetToLocalStorage = false; //false because the widget already exists in local storage
        generateAndDisplayWidget(widgetName, addWidgetToLocalStorage);
        // console.log("done with generateAndDisplayWidget(widgetName)");
        updateWidgetHtmlAttributes(widgetName, widgetInfo);
        // console.log("done with updateWidgetHtmlAttributes(widgetName, widgetInfo)");
    });
}

function updateWidgetHtmlAttributes(widgetName, widgetInfo) {
    $.each(widgetInfo, function(attribute, value){
        console.log("widgetName: " + widgetName  + " - attribute: " + attribute + " - value: " + value);
        $("#" + widgetName).attr(attribute, value);
    });
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

function weatherWidget() {
    // API Key for OpenWeatherMap API
    var apikey = "38eaa5467935a12d64ac94be4773f286";
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=" + apikey;
    getData(queryUrl, generateWeatherWidgetHtml, displayWeatherWidget);
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
        var br = $("<br>");
        $("#newsResults").append(br);
        $("#newsResults").append(titleDiv);
        $("#newsResults").append(urlDiv);
    }
}

function generateWeatherWidgetHtml(response) {
    var tempInfern  = (response.main.temp - 273.15) *1.80+32;
    var paresedtemp =  Math.round(tempInfern);
    var city = response.name;
    var humidity = response.main.humidity;
    var wind = response.wind.speed;
    var weather_icon = response.weather[0].icon;
    var weather_desc = response.weather[0].description;
    var weather_pressure = response.main.pressure+" hPa";

    var card = $("<div>");
    card.addClass("card border-primary mb-3");
    card.attr("style", "max-width: 15rem");
    
    var cardHeader = $("<div>");
    cardHeader.addClass("card-header");
    cardHeader.text("Weather for Toronto, ON");

    var cardBody = $("<div>");
    cardBody.addClass("card-body text-primary weather-row");

    var icon_url = "http://openweathermap.org/img/w/";
    var newicon = icon_url+weather_icon+".png";
    cardBody.append("<div class=\"weather_icon\">"+ "<img src=\"" + newicon + "\"></div>");

    var cardBodyWeatherInfoDiv = $("<div>");
    cardBodyWeatherInfoDiv.addClass("weather-col");
    cardBodyWeatherInfoDiv.append($("<p>").addClass("temp").text(paresedtemp+" °F"));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("desc").text(weather_desc));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("wind").text("wind :"+wind));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("humidity").text("humidity :"+humidity));
    cardBodyWeatherInfoDiv.append($("<p>").addClass("pressure").text("Pressure :"+weather_pressure));
    cardBody.append(cardBodyWeatherInfoDiv);

    card.append(cardHeader);
    card.append(cardBody);

    return card;
}

function displayWeatherWidget(weatherWidgetHtml) {
    $("#weather").html(weatherWidgetHtml);
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