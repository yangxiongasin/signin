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

var $leftContainer = $('.wrap-left .discern-content'),
    $rightContainer = $('.wrap-right .discern-container'),
    timeout,
    len = 0;

try {

    var ws = new WebSocket("ws://10.1.226.100:58000/chat");

    ws.onmessage = function (e) {
        
        var data = JSON.parse(JSON.parse(e.data));

        renderLeft(data);

    };

} catch (ex) {

    alert(ex.message);

}

			
function renderLeft(data) {

    clearTimeout(timeout);
    
    var id = Math.floor(Math.random() * 100000);

    var checkFlag = data.name != '100001' && data.name != '100002';
    
    if (checkFlag) { // 识别结果
        // 保证最多只有8个识别项
        if ($rightContainer.find('.discern-list').length == 8) {
            $rightContainer.find('.discern-list:last-child').remove();
        }

        $rightContainer.prepend(
            '<div class="discern-list">' +
                '<div class="discern-picture">' +
                    '<div>' +
                        '<img src="'+ data.image +'" />' +
                    '</div>' +
                '</div>' +
                '<div class="discern-desc">' +
                    '<p>'+ data.name +'</p>' +
                    '<p>'+ data.time +'</p>' +
                '</div>' +
            '</div>'
        )
    }

    var template;
    if (checkFlag) {
        template = '<p>欢迎您!</p><p>'+ data.name +'</p>';
    } else {
        template = '<p>欢迎贵宾!</p>';
    }

    var $dom = $([
        '<div class="discern-list ', checkFlag? "success" : "fail", len == 0? " customer-card-one" : "", '">',
            '<iframe width="169px" height="237px" style="opacity: 0;position: absolute; left: 0;background-color: transparent;" src="" frameborder="0"></iframe>',
            '<div class="discern-picture">',
                '<img src="', data.image ,'" />',
                '<div class="effect"></div>',
            '</div>',
            '<div class="discern-desc"></div>',
        '</div>'
    ].join('')).appendTo($leftContainer);
    
    $dom.find('.discern-desc').html(template);

    if (len === 0) {

        $(".customer-card-one").animate({left: 0}, 1000, '',function() {

            $(this).removeClass("customer-card-one");

        });

    } else {
        $dom.css('left', 219 * len +'px');
    }

    len === 1 && $leftContainer.css("transform", "translateX(109px)");
    len >= 2 && $leftContainer.css("transform", "translateX("+ -219 * (len - 2) +"px)");
    len >= 4 && $leftContainer.find('.discern-list').eq(0).remove();

    len++;

    timeout = setTimeout(function() {
        $leftContainer.stop().empty().css("transform", "translateX(0px)");
        len = 0;
    }, 20000);

}