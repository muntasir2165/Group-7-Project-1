$(document).ready(function() {
    clickWidgetListener();
    // draggableDivListener();
    resizableDivListener();
    $(document).on("click", "#YTbutton",function() {
        youTubeCreation();

    });
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
                case "youtube" :
                    youTubeWidget(); 
                    break; 
                default:
                    console.log("The " + widgetName+ " widget cannot be displayed on the dashboad at the moment");
            }
        }
    });
}
//this is the first step to create the search button
function youTubeWidget() {

  var youTubeSearch = $("<input type='text' id='youTubeInput'>");
  var youTubeButton = $("<button type='button' id='YTbutton'>Search YouTube</button>")
  $("#youtube").append(youTubeSearch, youTubeButton);
   
};
//this is followed up by the ability to create a new search function. 

function youTubeCreation() {

 var newTopic = $("#youTubeInput").val();
    var apiKey = "AIzaSyAYqrc7twpW4gYFibHNmf7dHCx3AHsBRqM";
    var queryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + newTopic + "&key=" + apiKey;
    getData(queryUrl, generateYouTubeWidgetHtml, displayYouTubeWidget);
}

function generateYouTubeWidgetHtml(response) {
    $("#youtube").empty(); 
    youTubeWidget(); 
    for (var i = 1; i < 5; i++) {
        var videoContainer = $("<div>").addClass("row"); 
        var videoSubContainer = $("<div>").addClass("col-xs-12"); 
        
        var videoID = response.items[i].id.videoId;
        var imgDiv = $("<div>").addClass("thumbnails"); 
        imgDiv.html("<img src=" + response.items[i].snippet.thumbnails.default.url + ">");
        videoSubContainer.append(imgDiv);
        
        var titleDiv = $("<div>").addClass("titles");
        titleDiv.html(response.items[i].snippet.title.substring(0,60));
        videoSubContainer.append(titleDiv);
        
        imgDiv.attr("value", response.items[i].id.videoId);
        
        var videoLink = $("<a>").addClass("a");
        videoLink.attr("href", "https://www.youtube.com/watch?v=" + videoID);
        videoLink.css("color", "black");
        videoLink.attr("target", "_blank");
        videoLink.html(videoSubContainer);

        videoContainer.append(videoLink);
        // //need to change the div in which I append videoLink because ImgResponse does not exist. 
        $("#youtube").append(videoLink);   
    }
}    
    function displayYouTubeWidget(youtubeWidgetHtml) {
        $("#youtube").append(youtubeWidgetHtml);
    }
    
    function weatherWidget() {
        // API Key for OpenWeatherMap API
        var apikey = "38eaa5467935a12d64ac94be4773f286";
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=" + apikey;
        getData(queryUrl, generateWeatherWidgetHtml, displayWeatherWidget);
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