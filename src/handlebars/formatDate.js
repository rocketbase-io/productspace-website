'use strict';

var dateformat = require('dateformat');

module.exports.register = function (handlebars) {
    handlebars.registerHelper('formatDate', function (date, format) {
        if (typeof format !== 'string' || format === 'today') {
            format = 'dd.mm.yyyy';
        }
        return dateformat(date, format);

    });
};