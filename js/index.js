// 重置页面body大小
var resetSize = function () {
    var screenWidth = window.screen.width
    var screenHeight = window.screen.height
    var bodyWidth = $('body').width()
    var bodyHeight = $('body').height()
    var widthScale = screenWidth / bodyWidth
    var heightScale = screenHeight / bodyHeight
    var leftval = bodyWidth / 2 * (1 - widthScale)
    var topval = bodyHeight / 2 * (1 - heightScale)
    $('body').css({
        'transform': 'scale(' + widthScale + ', ' + heightScale + ')',
        'left': -leftval,
        'top': -topval
    })
}

resetSize();

// 当前时间
function setTime() {
    function getDate() {
        var dateTime = new Date();
        var yy = dateTime.getFullYear();
        var mon = dateTime.getMonth();
        var day = dateTime.getDate();
        var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
        $('.time-container .week').text(str);
        $('.time-container .date').text(yy + '年' + extra((mon + 1)) + '月' + extra(day) + '日');
    }

    function systemTime() {
        var slidint;
        clearTimeout(slidint);

        var dateTime = new Date();
        var hh = dateTime.getHours();
        var mm = dateTime.getMinutes();
        var ss = dateTime.getSeconds();

        hh = extra(hh);
        mm = extra(mm);
        ss = extra(ss);

        $('.time-container .time').text(hh + ":" + mm + ":" + ss);
        slidint = setTimeout(systemTime, 1000);

    }

    function extra(x) {
        return x < 10 ? "0" + x : x;
    }

    getDate();
    systemTime();
}

setTime();

(function () {
    /*判断是否可以循环*/
    var hasStarted = false;
    var interval = false;
    var currentIndex = 0;
    var width = 580;
    var length = $(".slider-left-item").length;
    /*给默认的图片*/

    $(".slider-left-item:not(:first)").removeClass("slider-item-selected");
    $(".slider-left-item:first").addClass("slider-item-selected");
    $(".slider-left-page").hide();
    start();

    /*面面item标签事件*/
    $(".slider-left-item").hover(function (e) {
        stop();
        var currentIndex = $(this).index();
        $(".slider-left-item").removeClass("slider-item-selected");
        $(".slider-left-item").eq(currentIndex).addClass("slider-item-selected");
        $(".slider-left-page").show();
        goto(currentIndex);

    }, function (e) {
        $(".slider-left-page").hide();
        start();
    });

    /*banner图片停止轮播*/
    $(".slider-left-panel, .slider-left-page").hover(function (e) {
        $(".slider-left-page").show();
        clearInterval(interval);
        stop();
    }, function (e) {
        $(".slider-left-page").hide();
        start();
    });
    /*开始运行*/
    function start() {
        if (!hasStarted) {
            hasStarted = true;
            interval = setInterval(function () {
                currentIndex = (++currentIndex + length) % length;
                var offset = width * currentIndex;
                $(".slider-left-item").removeClass("slider-item-selected");
                $(".slider-left-item").eq(currentIndex).addClass("slider-item-selected");

                $(".slider-left-main").animate({ marginLeft: "-" + offset + "px" });
            }, 10000);
        }
    }
    /*停止轮播*/
    function stop() {
        clearInterval(interval);
        hasStarted = false;
    }
    function goto(current) {
        var offset = current * width;
        $(".slider-left-item").removeClass("slider-item-selected");
        $(".slider-left-item").eq(current).addClass("slider-item-selected");
        $(".slider-left-main").animate({ marginLeft: "-" + offset + "px" });
    }
})();

var clickFlag = true;
var $leftContainer = $('.wrap-left .discern-content');
var $rightContainer = $('.wrap-right .discern-container');

function checkName(name) {
    return name != '100001' && name != '100002';
}

var timeout,
    translateX = 219;

try {

    var ws = new WebSocket("ws://10.1.226.100:58000/chat");

    ws.onmessage = function (e) {
        
        var data = JSON.parse(JSON.parse(e.data));
        console.log(data, typeof data)

        clearTimeout(timeout);

        // 识别结果
        var checkFlag = checkName(data.name);
        var id = Math.floor(Math.random() * 100000);

        // 载入HTML模板
        var $dom = $("<iframe class='iframe' src='iframe.html?id=" + id + "' id='" + id + "' scrolling='no' seamless frameborder='0'></iframe>").data("data", data);

        switch ($leftContainer.find('.iframe').length) {
            case 0:
                translateX = 219;
                break;

            case 1:
                translateX = 109;
                break;

            case 2:
                translateX = 0;
                break;

            default:
                translateX -= 219;
                break;
        }

        $leftContainer.css('transform', 'translateX('+ translateX +'px)');
        
        $leftContainer.append($dom);

        if (checkFlag) {
            // 保证最多只有8个识别项
            if ($rightContainer.find('.discern-list').length == 8) {
                $rightContainer.find('.discern-list:last-child').remove();
            }

            $rightContainer.prepend(
                '<div class="discern-list">' +
                '<div class="discern-picture">' +
                '<img src="'+ data.image +'" />' +
                '</div>' +
                '<div class="discern-desc">' +
                '<p>'+ data.name +'</p>' +
                '</div>' +
                '</div>'
            )
        }

        // 20秒后自动销毁识别项
        timeout = setTimeout(function() {
            $leftContainer.empty();
            $leftContainer.css('transform', 'translateX(219px)');
        }, 20000);
    };

} catch (ex) {

    alert(ex.message);

}

// var clickFlag = true;

// $('.header').click(function () {
//     var DATA = [{
//         name: '贺成璋',
//         image: "./image/successPic.png"
//     },{
//         name: '杨雄',
//         image: "./image/failPic.png"
//     }]

//     data = DATA[clickFlag? 0 : 1];

//     clearTimeout(timeout);

//     // 识别结果
//     var checkFlag = checkName(data.name);
//     var id = Math.floor(Math.random() * 100000);

//     // 载入HTML模板
//     var $dom = $("<iframe class='iframe' src='iframe.html?id=" + id + "' id='" + id + "' scrolling='no'></iframe>").data("data", data);

//     switch ($leftContainer.find('.iframe').length) {
//         case 0:
//             translateX = 219;
//             break;

//         case 1:
//             translateX = 109;
//             break;

//         case 2:
//             translateX = 0;
//             break;

//         default:
//             translateX -= 219;
//             break;
//     }

//     $leftContainer.css('transform', 'translateX('+ translateX +'px)');
    
//     $leftContainer.append($dom);

//     if (checkFlag) {
//         // 保证最多只有8个识别项
//         if ($rightContainer.find('.discern-list').length == 8) {
//             $rightContainer.find('.discern-list:last-child').remove();
//         }

//         $rightContainer.prepend(
//             '<div class="discern-list">' +
//             '<div class="discern-picture">' +
//             '<img src="'+ data.image +'" />' +
//             '</div>' +
//             '<div class="discern-desc">' +
//             '<p>'+ data.name +'</p>' +
//             '</div>' +
//             '</div>'
//         )
//     }

//     clickFlag = ! clickFlag;

//     // 20秒后自动销毁识别项
//     // timeout = setTimeout(function() {
//     //     $leftContainer.empty();
//     //     $leftContainer.css('transform', 'translateX(219px)');
//     // }, 10000);
// });