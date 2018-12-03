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

var clickFlag = true;
var $leftContainer = $('.wrap-left .discern-container');
var $rightContainer = $('.wrap-right .discern-container');
var template = {
    success: 
    `
    <div class="discern-list success">
        <div class="discern-picture">
            <img src="./image/successPic.png" />
        </div>
        <div class="discern-desc">
            <p>欢迎您!</p>
            <p>黄雅莉</p>
        </div>
    </div>
    `,
    fail:
    `
    <div class="discern-list fail">
        <div class="discern-picture">
            <img src="./image/failPic.png" />
        </div>
        <div class="discern-desc">
            <p>欢迎贵宾!</p>
        </div>
    </div>
    `
};

var i = 0;

$('.wrap-left .title').click(function() {
    // 保证最多只有3个识别项
    if($leftContainer.find('.discern-list').length == 3) {
        $leftContainer.find('.discern-list:first-child').remove();
    }
    // 载入识别HTML模板
    var $dom = $(clickFlag? template.success : template.fail);
    $leftContainer.append($dom);

    if (clickFlag) {
        // 保证最多只有8个识别项
        if($rightContainer.find('.discern-list').length == 8) {
            $rightContainer.find('.discern-list:last-child').remove();
        }

        $rightContainer.prepend(
            `
            <div class="discern-list">
                <div class="discern-picture">
                    <img src="./image/successPic.png" />
                </div>
                <div class="discern-desc">
                    <p>姓名${i}</p>
                </div>
            </div>
            `
        )

        i++;
    }

    // 20秒后自动销毁识别项
    setTimeout(() => {
        $dom.fadeOut(()=> {
            $dom.remove();
        });
    }, 20000);

    clickFlag = !clickFlag;
});

function resetLayout() {
    var length = $leftContainer.find('.discern-list').length;
}