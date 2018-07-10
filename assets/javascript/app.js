$(document).ready(function() {
    clickWidgetListener();
    // draggableDivListener();
    resizableDivListener();
    // the click function below is to refresh the cryptocurrencies 
    $(document).on("click", "#toRefreshBitcoin", bitcoinWidget);
});

function clickWidgetListener() {
    $(document).on("click", ".widget-btn", function() {
        var widgetName = $(this).attr("data-widget");
        if ($("#" + widgetName).length !== 0){
            $("#" + widgetName).remove();
            console.log("The " + widgetName+ " has been removed from the screen");
        } else {
            var dashboard = $("#dashboard");
            var widgetDiv = $("<div>");
            widgetDiv.addClass("resize-drag");
            widgetDiv.text(widgetName);
            widgetDiv.attr("id", widgetName);
            // dashboard.append("<div class=\"draggable\">" + widget + "</div>");
            // dashboard.append("<div class=\"resize-drag\">" + widget + "</div>");
            dashboard.append(widgetDiv);
            switch(widgetName) {
                case "weather":
                    weatherWidget()
                    break;
                case "bitcoin":
                    bitcoinWidget()
                    break;
                default:
                    console.log("The " + widgetName+ " widget cannot be displayed on the dashboad at the moment");
            }
        }
    });
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


function weatherWidget() {
    // API Key for OpenWeatherMap API
    var apikey = "38eaa5467935a12d64ac94be4773f286";
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=" + apikey;
    getData(queryUrl, generateWeatherWidgetHtml, displayWeatherWidget);
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

function generateWeatherWidgetHtml(response) {
    var tempInfern  = (response.main.temp - 273.15) *1.80+32;
    var paresedtemp =  Math.round(tempInfern);
    var city= response.name;
    var humidity = response.main.humidity;
    var wind=response.wind.speed;
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

function displayBitcoinWidget(bitcoinWidgetHtml) {
    $("#bitcoin").html(bitcoinWidgetHtml);
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
        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    });
}