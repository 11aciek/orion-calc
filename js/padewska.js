/*jslint browser: true, devel: true, bitwise: true, eqeq: true, nomen: true, plusplus: true, sloppy: true, indent: 4*/
/*global $*/

$(function () {
    var bmiNumber = 30,
        $button = $('a#bmiButton'),
        $bmiCalc = $('span#bmiCalc'),
        $masa = $('input#masa'),
        $wzrost = $('input#wzrost'),
        $bmi = $('input#bmi'),
        $c = $bmi.parent().siblings().filter('span.pkt').children(),
        $checks = $('[type=checkbox]'),
        $summary = $('div#summary'),
        $interpretation = $('div#interpretation');
    
    // Liczymy bmi; jeśli bzdura pokazuje --
    
    function tryBmi() {
        var kg = Number($masa.val()),
            m = Number($wzrost.val() / 100);
        // dopuszczamy wartości > 20 kg i > 1m
        // bmi jest tylko dla dorosłych
        if ((!isNaN(kg)) && (!isNaN(m))
                && (kg >= 20) && (m > 1)) {
            return Math.floor(kg / (m * m));
        } else {
            return '--';
        }
    }
    
    // liczenie punktów
    
    function countPoints() {
        var checkPoints = [],
            points,
            p;
        
        /*zbieramy wszystkie zaczekowane czekboksy i wrzucamy
        do checkPoints*/
        
        for (p in $checks) {
            if ($checks.hasOwnProperty(p)) {
                if ($checks[p].checked) {
                    checkPoints.push(Number($checks[p].value));
                }
            }
        }
        
        // teraz to sumujemy, jeśli tablica pusta to 0
        
        if (checkPoints.length) {
            points = checkPoints.reduce(function (a, b) {
                return a + b;
            });
        } else {
            points = 0;
        }
        
        //wyswietlanie punktów
        $('div#result').text(points);
        
        if (points >= 4) {
            $summary.css('background-color', '#E3403E');
            $interpretation.text("duże ryzyko ŻChŻŻ");
        } else {
            $summary.css('background-color', '#3685E6');
            $interpretation.text("niskie ryzyko ŻChZZ");
        }
    }
    
    $bmiCalc.hide(); //chowamy kalkulator
    
    //odchaczamy wszystkie czekboksy przy ładowaniu/odświeżaniu
    $checks.each(function () {$(this).prop('checked', false); });
    
    //to dla FF i Opery - kliknięcie na kalkulator bezpieczne
    $('input.bmi').on('click', function (e) {e.preventDefault(); });
    
    //odpalenie i wyłączenie kalkulatora bmi
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
    
    // ręczne wprowadzenie bmi
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
    //czekowanie zlicza punkty
    $checks.on('change click', function () {
        countPoints();
    });
    //ładne zaparkowanie okienka z punktami
    $(window).scroll(function () {
        var x = $(document).height() - 130;
        //liczymy wielkość przewiniętego obszaru ekranu
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 25) {
            $summary.css({
                'position': 'absolute',
                'top': x
            });
        } else {
            $summary.css({
                'position': 'fixed',
                'top': ''
            });
        }
    });
});