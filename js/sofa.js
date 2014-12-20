/*jslint devel: true*/
/*global $*/
$(function () {
    'use strict';
    var $result = $('#result'),
        $measures = $('tr.measure');
    
    function countScore() {
        var $values = $measures.find('.clicked'),
            score = 0;
        $values.each(function (i, cell) {
            score += parseInt($(this).attr('class'), 10);
        });
        
        return score;
    }
    
    $measures.on('click', function (e) {
        var $cell = $(e.target);
            
        
        if ($cell.hasClass('clicked')) {
            $cell.removeClass('clicked');
        } else {
            $cell.addClass('clicked');
            $cell.siblings().removeClass('clicked');
        }
        $result.text('Score: ' + countScore());
    });
});