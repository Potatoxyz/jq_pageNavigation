$(function () {
    var logisticsStatus=['全部','待上网','运输中','成功签收','到达待取','运输过久','投递失败'];
    var logisticsWay=['所有','顺风国际电商快递-顺风欧洲小包','CNY全球特惠-CNY','CNY全球通平邮','中邮北京平邮小包-燕文','欧邮宝-八达通','浩远dpd',
        '法国专线-专态','荷兰邮政小包A平邮-E裕小仓','FR平邮小包-CNY','上海DHL经济小包-DHL','CNY全球通挂号','法国专线挂号-云途','EQ精选十国邮局小包-网易速达'];
    var Country=['所有','美国','澳大利亚','英国','法国','德国','意大利','日本','俄罗斯','其他'];
    var time=['全部','今天','昨天','7天内','30天以内','自定义'];
    var SearchType = ['订单号', '跟踪号', '包裹号'];
    $('.datepicker').datepicker({
        autoclose: true,
        format:'yyyy/mm/dd'
    });

    $('#searchType').bind('dblclick',function () {
       $('#searchModal').modal();
    });
    $('#import').bind('click',function () {
        $('#importModal').modal();
    });

    function loadData(target,attr) {
        for(var i=0;i<attr.length;i++){
            $(target).append('<span class="option">'+attr[i]+'</span>');
            $(target).children('span:eq(0)').addClass('option-selected');
        }
    }

    var Status=$("*[iterator*='status']");

    loadData(Status,logisticsStatus);


    var Way=$("*[iterator*='logisticsWay']");

    loadData(Way,logisticsWay);

    var receiveCountry=$("*[iterator*='receiveCountry']");

    loadData(receiveCountry,Country);

    var searchType = $("*[iterator*='searchType']");

    loadData(searchType, SearchType);

    var timeSelect=$("*[iterator*='timeSelect']");

    loadData(timeSelect,time,'time');

    var datepart=$('#date').detach();
    $(timeSelect).append(datepart);


    $('#select').click(function () {
        $(this).removeClass('btn-default').addClass('btn-primary');
        $(this).siblings().addClass('btn-default').removeClass('btn-primary');

        $('#sub-select-wrap').removeClass('none');
        $('#sub-search-wrap').addClass('none');
        $('.toggle-select-wrap').removeClass('none');
    });
    $('#search').click(function () {
        $(this).removeClass('btn-default').addClass('btn-primary');
        $(this).siblings().addClass('btn-default').removeClass('btn-primary');

        $('#sub-select-wrap').addClass('none');
        $('#sub-search-wrap').removeClass('none');
        $('.toggle-select-wrap').addClass('none');
    });


    $("*[iterator]").children('span').bind('click',function () {
        $(this).addClass('option-selected');
        $(this).siblings().removeClass('option-selected');
    });

    $(timeSelect).children('span').click(function () {
        $('#date').addClass('none');
    });
    $(timeSelect).children('span:last-of-type').click(function () {
        $('#date').removeClass('none');
    });

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


    //******************翻页部分
    //添加tr和td的dom元素
    function LoadTableData(data,index) {
        var newTr=document.createElement('tr');
        $(newTr).append('<td><input type="checkbox"></td>');
        document.getElementById('tbody').appendChild(appendData(newTr,data,index));
    }
    function appendData(target,data,index) {
        $(target).append('<td>'+'<p>'+data[index].packageNum+'</p>'+'<p>'+data[index].TraceNum+'</p>'+'</td>' + '<td>'+data[index].LogisticsWay+'</td>' + '<td>'+data[index].DeliverTime+'</td>' + '<td>'+data[index].OnlineTime+'</td>' + '<td>'+data[index].GetTime+'</td>' + '<td>'+data[index].NewInfo+'</td>' + '<td>'+data[index].packageStatu+'</td>');
        return target;
    }

    //替换表格中的值
    function chageValue(data) {
        var trs=$('#tbody').children('tr');
        // console.log('changeValue');
//            console.log(trs[0].children[1].children[0]);
        for(var c=0;c<data.length;c++){
            trs[c].children[0].innerHTML='<input type="checkbox">';
            trs[c].children[1].children[0].innerText=data[c].orderNumber;
            trs[c].children[1].children[1].innerText=data[c].trackingNumber;
            trs[c].children[2].innerText=data[c].shippingName;
            trs[c].children[3].innerText=data[c].pushTime;
            trs[c].children[4].innerText=data[c].onlineTime;
            trs[c].children[5].innerText=data[c].finishedTime;
            trs[c].children[6].innerText=data[c].NewInfo;
            trs[c].children[7].innerText=data[c].status;
        }
    }

    //select的值同步更新,PageSizechange事件
    var pageSize=5;
    var page=1;
    $('.pageSize').bind('change',function () {
        $('.pageSize').val($(this).val());
           console.log('pageSizeChange');
           pageSize=$(this).val();
        get_jsonp(page,pageSize);
    });
    var defaultOpts = {
        totalPages: 5,
        visiblePages: 8,
        first:'首页',
        last:'尾页',
        prev:'<< 上一页',
        next:'下一页 >>',
        onPageClick: function (evet, page) {
            // console.log(pageSize);
            get_jsonp(evet, page,pageSize);
        }
    };
    var $pagination=$('.sync-pagination');
    $pagination.twbsPagination(defaultOpts);


    var firstClick=1;
    function get_jsonp(evt,page,pageSize) {
//            console.log(page);
//            console.log(pageSize);
        $.getJSON("http://localhost:51114/ShippingTracking/TrackingPageList",{CurrentPage:page,PageSize:pageSize},
            function(data) {
                // console.log(data);
                var items=data.result.items;
                var pageCount=data.result.pageInfo.pageCount;
                // console.log(items);
                var domNum=$('#tbody').children().length;
                var dataLength=items.length;
                //dom数量过多，删除dom
                if(items.length<pageSize&&firstClick!==1){
//                    console.log('lessData');
                    var less=pageSize-items.length;
                    for(var les=1;les<less;les++){
                        $('#tbody').children('tr:nth-last-child('+les+'1)').remove();
                    }
                    // $('#tbody').children('tr:nth-last-child(1)').remove();
                    // $('#tbody').children('tr:nth-last-child(2)').remove();
                    // console.log($('#tbody').children('tr').length);
                    chageValue(items);
                }
                //初始化添加dom
                if(domNum==0){
                    // console.log(domNum);
                    // console.log(dataLength);
                    for(var d=0;d<items.length;d++){
                        LoadTableData(items,d);
                    }
                   // console.log('loadData');
                }
                //pageSize未改变，dom数刚好相等，替换值
                if(domNum==dataLength){
                       // console.log('chagePage');
                    chageValue(items);
                }
                //tr数量不够,添加dom
                if(domNum<dataLength&&domNum!=0){
                   // console.log('add');
//                    console.log(dataLength);
//                    console.log(domNum);
                    var lessNum=items.length-$('#tbody').children().length;
                    for(var le=0;le<lessNum;le++){
                        LoadTableData(items,le);
                    }
                    chageValue(items);
                }

                if(firstClick==1){
                    var totalPages = pageCount;
                    $pagination.twbsPagination('destroy');
                    $pagination.twbsPagination($.extend({}, defaultOpts, {
                        totalPages: totalPages
                    }));
                }
                firstClick++;
            });
    }


//        selectThisPage
    $('#selectThisPage').bind('click',function () {
        var num=$('#tbody').children('tr').length;
        if($('#selectThisPage')[0].checked){
            for(var i=0;i<num;i++){
                $('tr td input')[i].setAttribute('checked','true');
            }
        }
        else {
            for(var j=0;j<num;j++){
                $('tr td input')[j].removeAttribute('checked');
            }
        }
    });
});