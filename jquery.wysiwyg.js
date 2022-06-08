(function($) {

    const pluginName = 'wysiwyg';

    $.fn[pluginName] = function(options) {
        let defaults = {
            color: 'red',
            x:5,y:5,
            color1: 'red',
            color2: 'yellow',
            player1: 'Player 1',
            player2: 'Player 2',
        };

         $.extend(defaults, options);

         this.css('color', defaults.color);

    };

})(jQuery);

