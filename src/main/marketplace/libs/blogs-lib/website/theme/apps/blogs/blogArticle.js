(function ($, window) {
    $(function () {
        var articlesGrid = $('.blog-articles-grid');
        if (articlesGrid.length > 0) {
            adjustHeightArticleGrid();
            
            var timer = null;
            $(window).on('resize', function () {
                timer = setTimeout(function () {
                    adjustHeightArticleGrid();
                }, 250);
            });
        }
    });
    
    window.adjustHeightArticleGrid = function () {
        $('[data-type="component-blogArticleList"]').each(function () {
            var articlesGrid = $(this).find('.blog-articles-grid');
            if (articlesGrid.length > 0 && articlesGrid.filter('.blog-article-full-height-thumb').length === 0) {
                articlesGrid.find('.blog-article-item').each(function () {
                    var article = $(this);
                    var thumb = article.find('.blog-article-thumb');
                    var body = article.find('.blog-article-body');
                    
                    thumb.css('bottom', body.innerHeight() + 'px');
                });
            }
        });
    };
    
})(jQuery, window);