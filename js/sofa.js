/*jslint devel: true*/
/*global $*/
$(function () {
    'use strict';
    var $result       = $('#result'),
        $mortality    = $('#mortality'),
        $measures     = $('tr.measure'),
        $paoFioCalc   = $('tr#pao-fio-calc'),
        $buttons      = $('.calc-button'),
        $gammaCalc    = $('tr#gamma-calc'),
        $paoFioInputs = $('tr#pao-fio-calc').find('input'),
        $gammaInputs  = $('tr#gamma-calc').find('input');
    
    function countScore() {
        var $values = $measures.find('.clicked'),
            score = 0,
            mortality;
        
        $values.each(function (i, cell) {
            score += parseInt($(this).attr('class'), 10);
        });
        
        if (score < 7) {
            mortality = '<10%';
        } else if (score < 10) {
            mortality = '15-20%';
        } else if (score < 13) {
            mortality = '40-50%';
        } else if (score < 15) {
            mortality = '50-60%';
        } else if (score === 15) {
            mortality = '>80%';
        } else if (score > 15) {
            mortality = '>90%';
        }
        
        return [score, mortality];
    }
    
    $measures.on('click', function (e) {
        var $cell = $(e.target);
        
        if ($cell.hasClass('calc-button') || $cell.is('th')) {
            return null;
        }
        
        if ($cell.hasClass('clicked')) {
            $cell.removeClass('clicked');
        } else {
            $cell.addClass('clicked');
            $cell.siblings().removeClass('clicked');
        }
        $result.html('SOFA Score:<em>' + countScore()[0] + '</em/>');
        //$mortality.html('&#9760; ' + countScore()[1]);
        $result.attr('title', '\u2620 ' + countScore()[1]);
    });
    
    $buttons.each(function (i, button) {
        var $button = $(button),
            $calc = $button.parent().parent().next();
        
        $calc.hide();
        
        $button.on('click', function () {
            if ($button.attr('data-status') === 'off') {
                $button.attr('data-status', 'on');
                $calc.find('input').val('');
                $('#pao-fio').text('');
            } else {
                $button.attr('data-status', 'off');
                $button.parent().removeClass('dborder');
            }
            $calc.toggle();
        });
    });
    
    function calculatePaO2FiO2() {
        var paO2 = Number($paoFioInputs.eq(0).val().
                    replace(',', '.')), // , -> .
            fiO2 = Number($paoFioInputs.eq(1).val().
                    replace(',', '.')), // , -> .
            result = Math.round(paO2 / fiO2);
        
        if (fiO2 < 0.21 || fiO2 > 1.0) {
            return '';
        }
        
        return (isNaN(result) || !isFinite(result)) ?
                "" : result;
    }
    
    $paoFioInputs.each(function (i, input) {
        $(input).on('input paste', function () {
            $('#pao-fio').text(calculatePaO2FiO2());
        });
    });
    
    function calculateGamma() {
        var quantity  = Number($gammaInputs.eq(0).val().
                            replace(',', '.')),
            volume    = Number($gammaInputs.eq(1).val().
                            replace(',', '.')),
            rate      = Number($gammaInputs.eq(2).val().
                            replace(',', '.')),
            weight    = Number($gammaInputs.eq(3).val().
                            replace(',', '.')),
            result    = Number(((quantity * 1000 / volume) * rate / weight) / 60).toFixed(2);
        
        return (isNaN(result) || !isFinite(result)) ?
                "" : result;
    }
    
    $gammaInputs.each(function (i, input) {
        $(input).on('input paste', function () {
            $('#gamma').text(calculateGamma());
        });
    });
    
    $('footer').css({
        'position': 'absolute',
        'top': $(window).height() - 80,
        'left': '5%'
    });
});