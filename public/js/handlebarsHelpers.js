Handlebars.registerHelper("equalToZero", (num) => {
    return num === 0;
});

Handlebars.registerHelper("contains", (arr, val) => {
    if (!Array.isArray(arr)) {
        arr = [arr]
    }

    if (arr.indexOf(val) >= 0) {
        return true;
    }

    return false;
});

