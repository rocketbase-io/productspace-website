'use strict';

module.exports.register = function (handlebars) {
    handlebars.registerHelper('classToggle', function (index, firstClass, secondClass) {
        return (index % 2) === 0 ? firstClass : secondClass;
    });
};