/*jslint browser: true, devel: true, bitwise: true, eqeq: true, nomen: true, plusplus: true, sloppy: true, indent: 4*/
/*global $*/
/* TODO: interpretation, in, komentarze */

$(function () {
    var bmiNumber = 30,
        $button = $('a#bmiButton'),
        $bmiCalc = $('span#bmiCalc'),
        $masa = $('input#masa'),
        $wzrost = $('input#wzrost'),
        $bmi = $('input#bmi'),
        $c = $bmi.parent().siblings().filter('span.pkt').children(),
        $checks = $('[type=checkbox]');
    
    function tryBmi() {
        var kg = Number($masa.val()),
            m = Number($wzrost.val() / 100);
        
        if ((!isNaN(kg)) && (!isNaN(m))
                && (kg >= 20) && (m > 1)) {
            return Math.floor(kg / (m * m));
        } else {
            return '--';
        }
    }
    
    function countPoints() {
        var checkPoints = [],
            points,
            p;
        
        for (p in $checks) {
            if ($checks[p].checked) {
                checkPoints.push(Number($checks[p].value));
            }
        }
        
        if (checkPoints.length) {
            points = checkPoints.reduce(function (a, b) {
                return a + b;
            });
            
            
            
            if (points >= 4) {
                $('div#summary').css('background-color', '#E3403E');
                $('div#interpretation').text("duże ryzyko ŻChŻŻ");
            } else {
                $('div#summary').css('background-color', '#3685E6');
                $('div#interpretation').text("niskie ryzyko ŻChZZ");
            }
        } else {
            points = 0;
        }
        
        $('div#result').text(points);
    }
    
    $bmi.val('--');
    $bmiCalc.hide();
    $('input.bmi').on('click', function (e) {e.preventDefault(); });
    
    $button.on('click', function (e) {
        var $status = $(this).attr('data-status');
        e.preventDefault();
        
        if ($status === 'on') {
            $bmiCalc.fadeIn(500);
            $('input#masa').focus();
            $(this).attr('data-status', 'off');
        } else {
            $bmiCalc.fadeOut(500);
            $(this).attr('data-status', 'on');
        }
    });
    
    $bmi.on('change input paste', function () {
        var b = Number($(this).val());
        
        if (b >= 30) {
            $c.prop('checked', true);
        } else {
            $c.prop('checked', false);
        }
        countPoints();
    });
    
    $masa.on('input paste', function () {
        $bmi.val(tryBmi());
        if (Number($bmi.val()) >= bmiNumber) {
            $c.prop('checked', true);
        } else {
            $c.prop('checked', false);
        }
        countPoints();
    });
    
    $wzrost.on('input paste', function () {
        $bmi.val(tryBmi());
        if (Number($bmi.val()) >= bmiNumber) {
            $c.prop('checked', true);
        } else {
            $c.prop('checked', false);
        }
        countPoints();
    });
    
    $checks.on('change click', function () {
        countPoints();
    });
});