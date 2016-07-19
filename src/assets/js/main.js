(function ($) {

    $(document).ready(function () {
        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function () {
            $('.navbar-toggle:visible').click();
        });

        // aktivate Tooltips
        $('[data-toggle="tooltip"]').tooltip();
        
    });

    // Cookie Banner
    var EU_COOKIE_NAME = 'EU_COOKIE_LAW_CONSENT', EU_COOKIE_EXPIRES_IN_DAYS = 90;

    // Storing the consent in a cookie
    var setCookies = function(cookieName, days) {
        var d = new Date();
        var expiresInDays = days * 24 * 60 * 60 * 1000;
        d.setTime( d.getTime() + expiresInDays );
        var expires = "expires=" + d.toGMTString();
        document.cookie = cookieName + '=true; ' + expires + ";path=/";
    };

    // Let's see if we have a consent cookie already
    var isCookieAlreadySet = function(cookieName) {
        var userAcceptedCookies = false;
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i].trim();
            if (c.indexOf(cookieName) == 0) {
                userAcceptedCookies = c.substring(cookieName.length + 1, c.length);
            }
        }

        return userAcceptedCookies;
    };

    var hideContainer = function(selector) {
        $(selector).animate({
            opacity: 0,
            height: 0
        }, 200, function() {
            $(selector).hide(0);
        });
    };

    $(document).ready(function() {
        // No need to display this if user already accepted the policy
        if (isCookieAlreadySet(EU_COOKIE_NAME)) {
            return;
        }

        $('.eupopup-button').click(function() {
            setCookies(EU_COOKIE_NAME, EU_COOKIE_EXPIRES_IN_DAYS);
            hideContainer('.eupopup-container');
            return false;
        });

        // Ready to start!
        $('.eupopup-container').show();
    });

})(jQuery);
