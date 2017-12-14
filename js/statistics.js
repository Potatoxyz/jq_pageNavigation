$(function () {
    var logisticsStatus=['全部','待上网','运输中','成功签收','到达待取','运输过久','投递失败'];
    var logisticsWay=['所有','顺风国际电商快递-顺风欧洲小包','CNY全球特惠-CNY','CNY全球通平邮','中邮北京平邮小包-燕文','欧邮宝-八达通','浩远dpd',
        '法国专线-专态','荷兰邮政小包A平邮-E裕小仓','FR平邮小包-CNY','上海DHL经济小包-DHL','CNY全球通挂号','法国专线挂号-云途','EQ精选十国邮局小包-网易速达'];
    var Country=['所有','美国','澳大利亚','英国','法国','德国','意大利','日本','俄罗斯','其他'];
    var time=['全部','今天','昨天','7天内','30天以内','自定义'];


    //加载选项
    function loadData(target,attr,name) {
        for(var i=0;i<attr.length;i++){
            $(target).append("<label><input class='option' type='radio' name="+name+">"+attr[i]+"</label>");
            $(target).children('label:eq(0)').addClass('option-selected');
        }
    }
    var Status=$("*[iterator*='status']");

    loadData(Status,logisticsStatus,'Status');

    var Way=$("*[iterator*='logisticsWay']");

    loadData(Way,logisticsWay,'Way');

    var receiveCountry=$("*[iterator*='receiveCountry']");

    loadData(receiveCountry,Country,'receiveCountry');

    var timeSelect=$("*[iterator*='timeSelect']");

    loadData(timeSelect,time,'time');



    //选项点击样式切换
    $("*[iterator]").children('label').bind('click',function () {
        $(this).addClass('option-selected');
        $(this).siblings().removeClass('option-selected');
    });


    //展开的收起和下拉
    var subSelectWrap=$('#sub-select-wrap');
    var currentHeight=$(subSelectWrap).height();
    $(subSelectWrap).height('0');
    $('.search-part .toggle-select-wrap button').bind('click',function () {
        $(this).addClass('none');
        $(this).siblings().removeClass('none');

        if($(this).text()=='展开'){
            $(subSelectWrap).animate({height:currentHeight});
        }
        else{
            $(subSelectWrap).animate({height:'0'});
        }
    });

    function LoadChart() {
        // Radialize the colors
        Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });
        // 构建图表
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: null,
                style: {
                    fontFamily: 'Arial',
                    color:'white',
                    fontSize:"20px"
                }
            },
            credits:{
                enabled: false // 禁用版权信息
            },
            title: {
                text: '2014年某网站各浏览器的访问量占比',
                style:{
                    color:"white"
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            fontSize:"14px"
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '浏览器占比',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['其他',   0.7]
                ]
            }]
        });
    }

    //加载饼图
    $.getJSON('http://localhost:8080/charts',function (data) {

    });
    LoadChart(Data);
});