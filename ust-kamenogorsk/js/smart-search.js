'use strict';

var _match = function(pattern, text, offset, options) {
    var insertions = 0;
    var matchIndexes = [];
    var iPattern = 0;
    for (var iText = offset; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            matchIndexes.push(iText);
            if (++iPattern === pattern.length) {
                return ({
                    insertions: insertions,
                    matchIndexes: matchIndexes,
                });
            }
        } else if (matchIndexes.length) {
            insertions++;
            if (options.maxInsertions > -1 &&
                insertions > options.maxInsertions) {
                return null;
            }
        }
    }
    return null;
};

var _find = function(pattern, text, options) {
    var match = false;
    var insertions = null;
    var matchIndexes = null;
    var iPattern = 0;
    if (options.caseSensitive === false) {
        pattern = pattern.toLowerCase();
        text = text.toLowerCase();
    }
    for (var iText = 0; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            var res = _match(pattern, text, iText, options);
            if (res && (match === false || res.insertions <= insertions)) {
                if (match === false || res.insertions < insertions) {
                    match = true;
                    insertions = res.insertions;
                    matchIndexes = res.matchIndexes;
                } else {
                    matchIndexes = matchIndexes.concat(res.matchIndexes);
                }
            }
        }
    }
    if (match) {
        return ({
            value: pattern,
            insertions: insertions,
            matchIndexes: matchIndexes,
        });
    }
    return null;
};

var _score = function(entryResults) {
    var patternsMinInsertions = {};
    var patternsMinMatchIndex = {};
    entryResults.forEach(function(fieldResults) {
        fieldResults.patterns.forEach(function(pattern) {
            if (patternsMinInsertions[pattern.value] === undefined ||
                pattern.insertions < patternsMinInsertions[pattern.value]) {
                patternsMinInsertions[pattern.value] = pattern.insertions;
                patternsMinMatchIndex[pattern.value] = pattern.matchIndexes;
            }
        });
    });
    var minInsertions = 0;
    var minMatchIndex = [];
    for (var pattern in patternsMinInsertions) {
        if (patternsMinInsertions.hasOwnProperty(pattern)) {
            minInsertions += patternsMinInsertions[pattern];
            minMatchIndex = minMatchIndex.concat(patternsMinMatchIndex[pattern]);
        }
    }
    return minInsertions + minMatchIndex.sort()[0] / 1000;
};

var _getFieldString = function(entry, field) {
    var path = field;
    var current = entry;
    for (var i = 0; i < path.length; i++) {
        if (current[path[i]] === undefined) {
            return null;
        } else {
            current = current[path[i]];
        }
    }
    if (typeof current !== 'string') {
        return null;
    }
    return current;
};

var _forEachObject = function(object, fn) {
    var _locals = [];

    (function _private(object) {
        for (var key in object) {
            _locals.push(key);
            if (typeof object[key] === 'object') {
                _private(object[key]);
            } else {
                fn([].concat(_locals));
            }
            _locals.pop();
        }
    })(object);
};

var _search = function(entries, patterns, fields, options) {
    var results = [];
    entries.forEach(function(entry) {
        var match = false;
        var entryMatch = [];
        var entryResults = [];
        _forEachObject(fields, function(field) {
            var fieldString = _getFieldString(entry, field);
            if (fieldString === null) {
                return;
            }
            var fieldMatch = [];
            var fieldResults = { field: field.join('.'), patterns: [] };
            patterns.forEach(function(pattern) {
                var res = _find(pattern, fieldString, options);
                if (res) {
                    fieldResults.patterns.push(res);
                    fieldMatch.push(pattern);
                    if (entryMatch.indexOf(pattern) === -1) {
                        entryMatch.push(pattern);
                    }
                }
            });
            if (fieldMatch.length === patterns.length) {
                entryResults.push(fieldResults);
                match = true;
            } else if (options.fieldMatching === false &&
                fieldResults.patterns.length > 0) {
                entryResults.push(fieldResults);
            }
        });
        if ((options.fieldMatching === true && match === true) ||
            (options.fieldMatching === false &&
                entryMatch.length === patterns.length)) {
            results.push({
                entry: entry,
                info: entryResults,
                score: _score(entryResults)
            });
        }
    });
    return results;
};

var _buildOptions = function(options) {
    var defaultOptions = {
        caseSensitive: false,
        fieldMatching: false,
        maxInsertions: -1,
    };
    if (options === undefined) {
        return defaultOptions;
    }
    for (var option in defaultOptions) {
        if (options[option] !== undefined) {
            defaultOptions[option] = options[option];
        }
    }
    return defaultOptions;
};

var sanitizeArray = function(array, caseSensitive) {
    if (array === undefined || array.length === undefined ||
        array.length === 0) {
        return [];
    }
    var values = {};
    var newArray = [];
    array.forEach(function(elem) {
        if (typeof elem !== 'string') {
            return;
        }
        var element = !caseSensitive ? elem.toLowerCase() : elem;
        if (element && (element in values) === false) {
            values[element] = true;
            newArray.push(element);
        }
    });
    return newArray;
};

function smartSearch(entries, patterns, fields, options) {
    options = _buildOptions(options);
    patterns = sanitizeArray([].concat(patterns), options.caseSensitive);
    fields = typeof fields === 'string' ? {
        [fields]: true
    } : fields;
    if (entries.length === 0 || patterns.length === 0) {
        return;
    }
    var results = _search(entries, patterns, fields, options);
    results.sort(function(a, b) {
        return (a.score - b.score);
    });
    return results;
}


function didYouMean(str, list, key) {
    if (!str) return null;

    // If we're running a case-insensitive search, smallify str.
    if (!didYouMean.caseSensitive) { str = str.toLowerCase(); }

    // Calculate the initial value (the threshold) if present.
    var thresholdRelative = didYouMean.threshold === null ? null : didYouMean.threshold * str.length,
        thresholdAbsolute = didYouMean.thresholdAbsolute,
        winningVal;
    if (thresholdRelative !== null && thresholdAbsolute !== null) winningVal = Math.min(thresholdRelative, thresholdAbsolute);
    else if (thresholdRelative !== null) winningVal = thresholdRelative;
    else if (thresholdAbsolute !== null) winningVal = thresholdAbsolute;
    else winningVal = null;

    // Get the edit distance to each option. If the closest one is less than 40% (by default) of str's length,
    // then return it.
    var winner, candidate, testCandidate, val,
        i, len = list.length;
    for (i = 0; i < len; i++) {
        // Get item.
        candidate = list[i];
        // If there's a key, get the candidate value out of the object.
        if (key) { candidate = candidate[key]; }
        // Gatekeep.
        if (!candidate) { continue; }
        // If we're running a case-insensitive search, smallify the candidate.
        if (!didYouMean.caseSensitive) { testCandidate = candidate.toLowerCase(); } else { testCandidate = candidate; }
        // Get and compare edit distance.
        val = getEditDistance(str, testCandidate, winningVal);
        // If this value is smaller than our current winning value, OR if we have no winning val yet (i.e. the
        // threshold option is set to null, meaning the caller wants a match back no matter how bad it is), then
        // this is our new winner.
        if (winningVal === null || val < winningVal) {
            winningVal = val;
            // Set the winner to either the value or its object, depending on the returnWinningObject option.
            if (key && didYouMean.returnWinningObject) winner = list[i];
            else winner = candidate;
            // If we're returning the first match, return it now.
            if (didYouMean.returnFirstMatch) return winner;
        }
    }

    // If we have a winner, return it.
    return winner || didYouMean.nullResultValue;
}

// Set default options.
didYouMean.threshold = 0.4;
didYouMean.thresholdAbsolute = 20;
didYouMean.caseSensitive = false;
didYouMean.nullResultValue = null;
didYouMean.returnWinningObject = null;
didYouMean.returnFirstMatch = false;

// Expose.
// In node...
if (typeof module !== 'undefined' && module.exports) {
    module.exports = didYouMean;
}
// Otherwise...
else {
    window.didYouMean = didYouMean;
}

var MAX_INT = Math.pow(2, 32) - 1; // We could probably go higher than this, but for practical reasons let's not.
function getEditDistance(a, b, max) {
    // Handle null or undefined max.
    max = max || max === 0 ? max : MAX_INT;

    var lena = a.length;
    var lenb = b.length;

    // Fast path - no A or B.
    if (lena === 0) return Math.min(max + 1, lenb);
    if (lenb === 0) return Math.min(max + 1, lena);

    // Fast path - length diff larger than max.
    if (Math.abs(lena - lenb) > max) return max + 1;

    // Slow path.
    var matrix = [],
        i, j, colMin, minJ, maxJ;

    // Set up the first row ([0, 1, 2, 3, etc]).
    for (i = 0; i <= lenb; i++) { matrix[i] = [i]; }

    // Set up the first column (same).
    for (j = 0; j <= lena; j++) { matrix[0][j] = j; }

    // Loop over the rest of the columns.
    for (i = 1; i <= lenb; i++) {
        colMin = MAX_INT;
        minJ = 1;
        if (i > max) minJ = i - max;
        maxJ = lenb + 1;
        if (maxJ > max + i) maxJ = max + i;
        // Loop over the rest of the rows.
        for (j = 1; j <= lena; j++) {
            // If j is out of bounds, just put a large value in the slot.
            if (j < minJ || j > maxJ) {
                matrix[i][j] = max + 1;
            }

            // Otherwise do the normal Levenshtein thing.
            else {
                // If the characters are the same, there's no change in edit distance.
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                // Otherwise, see if we're substituting, inserting or deleting.
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // Substitute
                        Math.min(matrix[i][j - 1] + 1, // Insert
                            matrix[i - 1][j] + 1)); // Delete
                }
            }

            // Either way, update colMin.
            if (matrix[i][j] < colMin) colMin = matrix[i][j];
        }

        // If this column's minimum is greater than the allowed maximum, there's no point
        // in going on with life.
        if (colMin > max) return max + 1;
    }
    // If we made it this far without running into the max, then return the final matrix value.
    return matrix[lenb][lena];
}

// if (typeof exports !== 'undefined') {
//     if (typeof module !== 'undefined' && module.exports) {
//         exports = module.exports = smartSearch;
//     }
//     exports.smartSearch = smartSearch;
// } else if (angular) {
//     angular
//         .module('ngSmartSearch', [])
//         .filter('smartSearch', function() {
//             return smartSearch;
//         });
// } else {
//     window.smartSearch = smartSearch;
// }



const data4 = [{
        link: "label_3120t.php",
        title: "Принтер этикеток 3120T",
        desc: "Легкий и удобный принтер этикеток со скоростью 127мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Принтер этикеток 3120T имеет функции: автоматической калибровки бумаги и функцию контроля температуры.",
        img: "../images/label/1.jpg",
        price: 45360,
        color: "black",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: true,
        winding: true,
        code: "4001"
    }, {
        link: "label_2408d.php",
        title: "Принтер этикеток 2408DC белый",
        desc: "Высокопроизводительный принтер GS-2408D со скоростью 203мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 104 мм. Данный принетер является отличным решением для розничной торговли, маркировки полок, а также для сервисов доставки.",
        img: "../images/2408D/1.png",
        price: 45360,
        color: "white",
        paperWidth: 104,
        interfaces: ["usb", "serial", "wifi", "bluetooth"],
        autoCut: true,
        winding: true,
        code: "4940"
    }, {
        link: "label_3120tub.php",
        title: "Принтер этикеток 3120TUB",
        desc: "Высокопроизводительный принтер 3120TUB со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TUB/1.jpg",
        price: 33390,
        color: "gray",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: false,
        winding: false,
        code: "4939"
    },
    {
        link: "label_3120tl.php",
        title: "Принтер этикеток 3120TL",
        desc: "Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TL/2.jpg",
        price: 44100,
        color: "black",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: true,
        winding: false,
        code: "1821"

    },
    {
        link: "label_3120tuc.php",
        title: "Принтер этикеток 3120TUC",
        desc: "Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 80 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TUC/1.jpg",
        price: 37080,
        color: "black",
        paperWidth: 80,
        interfaces: ["usb"],
        autoCut: true,
        winding: false,
        code: "4938"
    }, {
        link: "thermalprinter_5802.php",
        title: "Принтер чеков 5802",
        desc: "Принтер чеков 5802 с термопечатью обладает высоким уровнем обслуживания в любых сферах. Принтер чеков имеет компактные размеры корпуса и предназначен для печати на 58 мм термоленте.",
        img: "../images/thermalprinter/1.jpg",
        price: 15120,
        paperWidth: 58,
        printSpeed: 90,
        thermSource: 100,
        interfaces: ["USB"],
        autoCut: false,
        connections: ["autonomous"],
        code: "3001"
    }, {
        link: "thermalprinter_8256.php",
        title: "Принтер кассовых чеков 8256",
        desc: "Принтер кассовых чеков 8256 обладает не только замечательными техническими параметрами, но и высокоскоростной печатью 300мм/сек. Функциональные возможности принтера чеков существенно экономят время оператора и помогают бесперебойно обслуживать большой поток клиентов.",
        img: "../images/thermalprinter/9.jpg",
        price: 35280,
        paperWidth: 80,
        printSpeed: 300,
        thermSource: 100,
        interfaces: ["USB", "LAN"],
        autoCut: true,
        connections: ["autonomous"],
        code: "3002"
    }, {
        link: "thermalprinter_5860.php",
        title: "Мобильный термопринтер 5860 (bluetooth)",
        desc: "Мобильный термопринтер 5860 (bluetooth) легко синхронизируется с устройствами(Android) на смартфоне, планшете, компьютере и печатает на стандартной термоленте шириной 58 мм. Принтер чеков 5860 совместим с любыми программными обеспечениями и отлично впишется в малый или средний бизнес.",
        img: "../images/thermalprinter/10.png",
        price: 27720,
        paperWidth: 58,
        printSpeed: 50,
        thermSource: 80,
        interfaces: ["USB"],
        autoCut: false,
        connections: ["autonomous", "bluetooth"],
        code: "3004"
    }, {
        link: "thermalprinter_58B.php",
        title: "Принтер чеков Rongta 58 B",
        desc: "Принтер чеков Rongta 58B `обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте.",
        img: "../images/58Bwith wm/1.jpg",
        price: 12096,
        paperWidth: 58,
        printSpeed: 90,
        thermSource: 50,
        interfaces: ["USB"],
        autoCut: false,
        connections: ["autonomous"],
        code: "5382"
    }, {
        link: "thermalprinter_58A.php",
        title: "Принтер чеков Rongta 58A",
        desc: "Принтер чеков Rongta 58A обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте.",
        img: "../images/58Awith wm/3.jpg",
        price: 12600,
        paperWidth: 58,
        printSpeed: 90,
        thermSource: 50,
        interfaces: ["USB"],
        autoCut: false,
        connections: ["autonomous"],
        code: "5383"
    }, {
        link: "thermalprinter_58E.php",
        title: "Принтер чеков Rongta 58E",
        desc: "Принтер чеков Rongta 58 E обладает скоростью печати 90 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.",
        img: "../images/thermalprinter/1.jpg",
        price: 14742,
        paperWidth: 58,
        printSpeed: 100,
        thermSource: 100,
        interfaces: ["USB"],
        autoCut: false,
        connections: ["autonomous"],
        code: "5381"
    }, {
        link: "thermalprinter_RP328.php",
        title: "Принтер чеков Rongta RP 328",
        desc: "Принтер чеков Rongta RP 328 обладает скоростью печати 250 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 80мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.",
        img: "../images/RP328/1.jpg",
        price: 35280,
        paperWidth: 80,
        printSpeed: 250,
        thermSource: 100,
        interfaces: ["USB", "LAN", "Serial"],
        autoCut: true,
        connections: ["autonomous"],
        code: "5384"
    }, {
        link: "thermalprinter_RP326.php",
        title: "Принтер чеков RP 326",
        desc: "Принтер чеков RP 326 обладает скоростью печати 250 мм/сек. Термопринтер имеет компактные размеры корпуса и предназначен для печати на 58мм термоленте. Термопринтер чеков успешно используется в крупных торговых сетях, гостиницах и ресторанах, интернет-магазинах с большим клиентским потоком.",
        img: "../images/RP326/1.jpg",
        price: 42210,
        paperWidth: 58,
        printSpeed: 250,
        thermSource: 100,
        interfaces: ["USB", "LAN", "Serial"],
        autoCut: false,
        connections: ["autonomous"],
        code: "5387"
    },
    {
        link: "scanner_6900.php",
        title: "Сканер штрих кода 6900",
        desc: "Сканер штрих кода с подставкой обладает высоким уровнем обслуживания. Кнопка сканирования выдерживает не менее 100 нажатий в сек., поэтому может применяться в различных магазинах, супермаркетах, аптеках или же в любой торговли.",
        img: "../images/scanner/11.jpg",
        price: 11840,
        scanType: ["bar-code"],
        screenScan: false,
        connections: ["wired"],
        readType: "laser",
        scanMode: ["first", "second"],
        code: "2001"
    },
    {
        link: "scanner_t_5.php",
        title: "Сканер для считывания штрих кодов T5",
        desc: "Светодиодный сканер для считывания штрих кодов T5 может считывать любые штрих коды. Главным преимуществом сканера T5 является - считывание штрих-кодов прямо с экрана смартфона или монитора компьютера.",
        img: "../images/scanner/3.jpg",
        price: 15120,
        scanType: ["bar-code"],
        screenScan: false,
        connections: ["wired"],
        readType: "led",
        scanMode: ["first", "third", "fourth", "fifth"],
        code: "2002"
    },
    {
        link: "scanner_10t_2d.php",
        title: "Cканер QR и штрих-кодов 10T-2D",
        desc: "Cканер QR и штрих-кодов 10T- с 2D режимом считывания, сканирует любые штрих-коды: с экрана монитора, смартфона, а также считывает QR-коды. Применяется в розничной торговли, легкой промышленности, документообороте, а также в сфере банковских и коммунальных услуг.",
        img: "../images/scanner/9.png",
        price: 23940,
        scanType: ["bar-code", "qr-code"],
        screenScan: true,
        connections: ["wired"],
        readType: "image",
        scanMode: ["first", "second"],
        code: "2005"
    },
    {
        link: "scanner_1880.php",
        title: "Беспроводной сканер штрих кода 1880",
        desc: "Беспроводной сканер штрих кода с подставкой обладает высокой производительностью. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.",
        img: "../images/scanner/7.jpg",
        price: 20160,
        scanType: ["bar-code"],
        screenScan: true,
        connections: ["wired", "wifi"],
        readType: "laser",
        scanMode: ["first", "second"],
        code: "2004"
    },
    {
        link: "scanner_6100CG.php",
        title: "Беспроводной сканер штрих кода 6100 CG",
        desc: "Беспроводной сканер штрих кода обладает высокой производительностью. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.",
        img: "../images/6100CG/ava1.jpg",
        price: 20304,
        scanType: ["bar-code", "qr-code", "dmx-code"],
        screenScan: true,
        connections: ["wired", "wifi"],
        readType: "led",
        scanMode: ["first", "third", "fourth", "fifth"],
        code: "5311"
    },
    {
        link: "scanner_6600G.php",
        title: "Беспроводной сканер штрих кода 6600 G",
        desc: "Беспроводной сканер штрих кода обладает высокой производительностью. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.",
        img: "../images/6600G/ava1.jpg",
        price: 21855,
        scanType: ["bar-code", "qr-code", "dmx-code"],
        screenScan: true,
        connections: ["wired", "wifi"],
        readType: "image",
        scanMode: ["first", "fourth"],
        code: "5312"
    },
    {
        link: "scanner_6600B.php",
        title: "Беспроводной сканер штрих кода 6600 B (Bluetooth)",
        desc: "Беспроводной сканер штрих кода обладает высокой производительностью и подключается через bluetooth. Имеет три вида сканирования: Штрих-код, QR-код, DATA Matrix. Ударопрочный сканер имеет возможность работать на расстоянии. Может использоваться непрерывно в течение более 20 часов без зарядки. Главным преимуществом сканера является - автоматическое хранение на расстоянии.",
        img: "../images/6600B/ava.jpg",
        price: 23970,
        scanType: ["bar-code", "qr-code", "dmx-code"],
        screenScan: true,
        connections: ["wired", "wifi", "bluetooth"],
        readType: "image",
        scanMode: ["first", "fourth"],
        code: "5313"
    },
    {
        link: "stoika.php",
        title: "Стойка для сканера 6900",
        desc: "Стандартная стойка для сканера штрих-кода 6900 предназначена для непрерывного сканирования, то есть в режиме “Hands-Free”. Она надежно закрепляется у основания сканера.",
        img: "../images/scanner/30.png",
        price: 1260,
        code: "2009"
    },
    {
        link: "stoika_t5.php",
        title: "Стойка для сканера Т5",
        desc: "Стандартная стойка для сканера штрих-кода Т5 предназначена для непрерывного сканирования. Она надежно закрепляется у основания сканера.",
        img: "../images/rack/t5.jpg",
        price: 1890,
        code: "3941"
    }, {
        link: "stoika_universal.php",
        title: "Стойка для сканера Универсальная",
        desc: "Стандартная стойка для сканера штрих-кода Универсальная предназначена для непрерывного сканирования. Она надежно закрепляется у основания сканера.",
        img: "../images/rack/st1.jpg",
        price: 2115,
        code: "4843"
    },
    {
        link: "pos_3072.php",
        title: "Сенсорный монитор 3072, белый",
        desc: "Сенсорный моноблок 3072 имеет новый компактный дизайн. Сенсорный экран с высокой чувствительностью идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/p4.png",
        price: 163800,
        diagonal: 12.1,
        color: "white",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1001"
    },
    {
        link: "pos_3072_black.php",
        title: "Сенсорный монитор 3072, черный",
        desc: "Сенсорный моноблок 3072 имеет новый компактный дизайн. Сенсорный экран с высокой чувствительностью идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/3072.png",
        price: 163800,
        diagonal: 12.1,
        color: "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1002"
    },
    {
        link: "pos_t8_white.php",
        title: "Сенсорный моноблок Т8, белый",
        desc: "Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 32 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/24.jpg",
        price: 163800,
        diagonal: 15.6,
        color: "white",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1003"
    },
    {
        link: "pos_t8.php",
        title: "Сенсорный моноблок T8, черный",
        desc: "Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 32 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/21.png",
        price: 163800,
        diagonal: 15.6,
        color: "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1004"
    },
    {
        link: "pos_t8_white_printer.php",
        title: "Сенсорный моноблок T8 с принтером чеков, белый",
        desc: "Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью и с принтером чеков 58мм является главным отличием и достоинством. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/t8_white_printer.jpg",
        price: 182700,
        diagonal: 15.6,
        color: "white",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1005"
    },
    {
        link: "pos_t8_printer.php",
        title: "Сенсорный моноблок T8 с принтером чеков, черный",
        desc: "Сенсорный моноблок для кассы 15.6-дюймовым диагональю экрана с высокой чувствительностью и с принтером чеков 58мм является главным отличием и достоинством. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/t8_black_printer.png",
        price: 182700,
        diagonal: 15.6,
        "color": "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "1006"
    },
    {
        link: "pos_3021_white.php",
        title: "Сенсорный Моноблок 3021, белый",
        desc: "15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/3021_white/1.png",
        price: 138600,
        diagonal: 15,
        "color": "white",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "4491"
    },
    {
        link: "pos_3021_black.php",
        title: "Сенсорный Моноблок 3021, черный",
        desc: "15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/avatars/3021_black.jpg",
        price: 138600,
        diagonal: 15,
        color: "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        code: "4492"
    },
    {
        link: "pos_t8_white_64.php",
        title: "Сенсорный моноблок T8 Pro, белый",
        desc: "Сенсорный моноблок 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 64 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/avatars/T8.jpg",
        price: 189000,
        diagonal: 15.6,
        color: "white",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        code: "1007"
    },
    {
        link: "pos_t8_64.php",
        title: "Сенсорный моноблок T8 Pro, черный",
        desc: "Сенсорный монитор для кассы 15.6-дюймовым диагональю экрана с высокой чувствительностью является главным отличием и достоинством. Модель имеет жесткий диск типа SSD 64 ГБ. Дисплей покупателя имеет возможность показывать клиенту то, что он заказывает.",
        img: "../images/avatars/T8_PRO.jpg",
        price: 189000,
        diagonal: 15.6,
        color: "black",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        code: "1008"
    },
    {
        link: "pos_3021_white_pro.php",
        title: "Сенсорный Моноблок 3021 PRO, белый",
        desc: "15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/3021_white/pro_logo.jpg",
        price: 154980,
        diagonal: 15,
        color: "white",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        code: "4493"
    },
    {
        link: "pos_3021_pro_black.php",
        title: "Сенсорный Моноблок 3021 PRO, черный",
        desc: "15-дюймовый сенсорный моноблок 3021 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/3021_black/pro_logo.jpg",
        price: 154980,
        diagonal: 15,
        color: "black",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        code: "4494"
    },
    {
        link: "pos_3068.php",
        title: "Сенсорный Моноблок 3068",
        desc: "Сенсорный моноблок 3068 отличается от других моноблоков с размером дисплея. Диогональ экрана состовляет 17 дюймов. Модель имеет жесткий диск типа SSD 32 ГБ. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/3068/3068.jpg",
        price: 163800,
        diagonal: 17,
        color: "black",
        ram: 4,
        ssd: 32,
        clientDisplay: true,
        code: "4495"
    },
    {
        link: "pos_t6.php",
        title: "Сенсорный моноблок T6",
        desc: "15,6-дюймовая сенсорный моноблок Touch Touch LVDS с высокой чувствительностью и широким экраном отвечает всем современным требованиям. Модель имеет превосходный дизайн. А также имеет дисплей для клиента с двумя линиями.",
        img: "../images/p2.png",
        price: 205380,
        diagonal: 15.6,
        color: "black",
        ram: 4,
        ssd: 32,
        clientDisplay: true,
        code: "1009"
    },
    {
        link: "pos_3068_pro.php",
        title: "Сенсорный Моноблок 3068 PRO",
        desc: "Сенсорный моноблок 3068 PRO отличается от других моноблоков с размером дисплея. Диогональ экрана состовляет 17 дюймов. Модель имеет жесткий диск типа SSD 64 ГБ. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/3068/3068_pro.jpg",
        price: 176400,
        diagonal: 17,
        color: "black",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        code: "4496"
    },
    {
        link: "pos_t3.php",
        title: "Сенсорный моноблок T3",
        desc: "Сенсорный моноблок 15-дюймовым диагональю экрана с высокой чувствительностью и с модной экранной панелью на спине является главным отличием и достоинством. Экранная панель имеет возможность показывать клиенту, что он заказывает.",
        img: "../images/p3.png",
        price: 205000,
        diagonal: 15,
        color: "black",
        ram: 4,
        ssd: 32,
        clientDisplay: true,
        code: "1013"
    },
    {
        link: "pos_1701.php",
        title: "Сенсорный Моноблок 1701",
        desc: "15-дюймовый сенсорный моноблок 1701 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/1701/ava.png",
        price: 130000,
        diagonal: 15,
        color: "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5150"
    },
    {
        link: "pos_1701_pro.php",
        title: "Сенсорный Моноблок 1701 PRO",
        desc: "15-дюймовый сенсорный моноблок 1701 PRO — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/1701/pro.png",
        price: 156090,
        diagonal: 15,
        color: "black",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5151"
    },
    {
        link: "pos_1702.php",
        title: "Сенсорный Моноблок 1702",
        desc: "15-дюймовый сенсорный моноблок 1702 — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/1702/ava.png",
        price: 130000,
        diagonal: 15,
        color: "white",
        ram: 2,
        ssd: 34,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5146"
    }, {
        link: "pos_1702_pro.php",
        title: "Сенсорный Моноблок 1702 PRO",
        desc: "15-дюймовый сенсорный моноблок 1702 PRO — это коммерческое решение для предприятий любого масштаба, работающих в сфере торговли, в ресторанном и гостиничном бизнесе. Служат долго и идеально справляются с задачами автоматизации обслуживания клиентов. Поддерживает все виды периферийных устройств. Имеет конструкцию без вентилятора, что обеспечивает низкий уровень шума.",
        img: "../images/1702/pro.png",
        price: 156090,
        diagonal: 15,
        color: "white",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5147"
    }, {
        link: "pos_1905.php",
        title: "Сенсорный Моноблок 1905",
        desc: "Сенсорный монитор 1905 белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/1905/ava.png",
        price: 130000,
        diagonal: 15,
        color: "white",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5148"
    },
    {
        link: "pos_1905_pro.php",
        title: "Сенсорный Моноблок 1905 PRO",
        desc: "Сенсорный монитор 1905 PRO белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/1905/logo.png",
        price: 162540,
        diagonal: 15,
        color: "white",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        displayType: "capacitive",
        code: "5149"
    }, {
        link: "pos_r10.php",
        title: "Сенсорный Моноблок R10",
        desc: "Сенсорный монитор R10 белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/R10/avaa.png",
        price: 130000,
        diagonal: 15,
        color: "black",
        ram: 2,
        ssd: 32,
        clientDisplay: true,
        displayType: "resistive",
        code: "5158"
    },
    {
        link: "pos_r10_pro.php",
        title: "Сенсорный Моноблок R10 PRO",
        desc: "Сенсорный монитор R10 PRO белый имеет новый компактный дизайн, сенсорный монитор с высокой чувствительностью. Идеально подойдет для автоматизации любой торговли: супермаркетов, магазинов, кафе или же аптек.",
        img: "../images/R10/pro.png",
        price: 148450,
        diagonal: 15,
        color: "black",
        ram: 4,
        ssd: 64,
        clientDisplay: true,
        displayType: "resistive",
        code: "5159"
    },
    {
        link: "pos_376.php",
        title: "Pos-система для магазина",
        price: "93981",
        img: "../images/monitor/8.jpg",
        code: "1010"
    }, {
        link: "pos_td_35.php",
        title: "Pos-система TD-35",
        price: "140300",
        img: "../images/monitor/20.jpg",
        code: "1014"
    }, {
        link: "pos_mk_600.php",
        title: "Микрокиоск Zebra MK500",
        price: "197750",
        img: "../images/23.jpg",
        code: "1011"
    }, {
        link: "display_black.php",
        title: "Дисплей покупателя, черный",
        price: "25200",
        img: "../images/25.jpg",
        code: "1015"
    }, {
        link: "display_white.php",
        title: "Дисплей покупателя, белый",
        price: "25200",
        img: "../images/26.jpg",
        code: "1016"
    }, {
        link: "schityvatel_magnit.php",
        title: "Считыватель магнитных карт",
        price: "18900",
        img: "../images/monitor/27.png",
        code: "1017"
    }, {
        link: "Sistemnyy-blok-AMD.php",
        title: "Системный блок AMD",
        price: "155800",
        img: "../images/block-sistemy/block-1/ava.png",
        code: ""
    }, {
        link: "Sistemnyy-blok-Core-i3.php",
        title: "Системный блок Core i3",
        price: "156490",
        img: "../images/block-sistemy/block-2/ava.png",
        code: ""
    }, {
        link: "Sistemnyy-blok-Core-i5.php",
        title: "Системный блок Core i5",
        price: "176700",
        img: "../images/block-sistemy/block-3/ava.png",
        code: ""
    },
    {
        link: "Sistemnyy-blok-Core-i7.php",
        title: "Системный блок Core i7",
        price: "236400",
        img: "../images/block-sistemy/block-4/2.png",
        code: ""
    }, {
        link: "Sistemnyy-blok-Core-i7-gtx.php",
        title: "Системный блок Core i7 GTX",
        price: "381900",
        img: "../images/block-sistemy/block-5/ava.png",
        code: ""
    }, {
        link: "Monitor-SAMSUNG-LS22.php",
        title: "Монитор 21.5″ SAMSUNG LS22",
        price: "59300",
        img: "../images/perif/first/ava.png",
        code: ""
    }, {
        link: "Monitor-SAMSUNG-LS24.php",
        title: "Монитор 21.5″ SAMSUNG LS24",
        price: "69200",
        img: "../images/perif/second/ava.png",
        code: ""
    }, {
        link: "Klaviatura-Delux-DLK-6010UB.php",
        title: "Клавиатура, Delux, DLK-6010UB",
        price: "2808",
        img: "../images/perif/third/ava.png",
        code: ""
    }, {
        link: "Klaviatura-Delux-DLD-1505OGB.php",
        title: "Клавиатура, Delux, DLD-1505OGB",
        price: "5940",
        img: "../images/perif/fourth/ava.png",
        code: ""
    }, {
        link: "Mysh'-Delux-DLM-391-OUB.php",
        title: "Мышь Delux, DLM-391 OUB",
        price: "1776",
        img: "../images/perif/fifth/ava.png",
        code: ""
    }, {
        link: "Mysh'-Delux-DLM-516-OGB.php",
        title: "Мышь Delux, DLM-516 OGB",
        price: "3216",
        img: "../images/perif/six/ava.png",
        code: ""
    }, {
        link: "Komplekt-Klaviatura-Mysh'-Delux-DLD-6075OUB.php",
        title: "Комплект Клавиатура + Мышь, Delux, DLD-6075OUB",
        price: "4296",
        img: "../images/perif/seven/ava.png",
        code: ""
    }, {
        link: "Komplekt-Klaviatura-Mysh'-Delux-DLD-1505OGB.php",
        title: "Комплект Клавиатура + Мышь, Delux, DLD-1505OGB",
        price: "5940",
        img: "../images/perif/eight/ava.png",
        code: ""
    },
    {
        link: "scanner_2306.php",
        title: "Стационарный сканер штрих кодов 2306",
        price: "35280",
        img: "../images/2306/1.jpg",
        code: "4907"
    }, {
        link: "scanner_70-2D.php",
        title: "Стационарный сканер штрих кодов 70-2D",
        price: "44100",
        img: "../images/70-2D/1.jpg",
        code: "4908"
    }, {
        link: "scanner_2310.php",
        title: "Стационарный сканер штрих кодов 2310",
        price: "69300",
        img: "../images/2310/11.jpg",
        code: "4909"
    }, {
        link: "till_410b.php",
        title: "Кассовый ящик 410В",
        price: "16748",
        img: "../images/till/1.jpg",
        code: "6001"
    },
    {
        link: "till_405a.php",
        title: "Денежный ящик 405A",
        price: "18960",
        img: "../images/till/2.jpg",
        code: "6002"
    }, {
        link: "till_170.php",
        title: "Денежный ящик 170",
        price: "29925",
        img: "../images/till/with.jpg",
        code: "5305"
    }, {
        link: "scale_mk_a.php",
        title: "Весы настольные электронные MK_A",
        price: "37007",
        img: "../images/scale/3.jpg",
        code: "5002"
    }, {
        link: "scale_th_11.php",
        title: "Весы товарные MK_TH11",
        price: "54458",
        img: "../images/scale/7.jpg",
        code: "5006"
    }, {
        link: "scale_mk_th.php",
        title: "Весы торговые MK_TH21(RU)",
        price: "55289",
        img: "../images/scale/8.jpg",
        code: "5007"
    }, {
        link: "scale_tbs_a.php",
        title: "Весы товарные ТВ-S_A01/TB3",
        price: "60940",
        img: "../images/scale/60.jpg",
        code: "5014"
    }, {
        link: "scale_mk_ab.php",
        title: "Весы влагозащищенные MK_AB11",
        price: "61660",
        img: "../images/scale/4.jpg",
        code: "5003"
    }, {
        link: "scale_tbs_t3.php",
        title: "Весы торговые TB-S_T3 (платформа + терминал)",
        price: "73516",
        img: "../images/scale/9.jpg",
        code: "5008"

    }, {
        link: "scale_mk_ra.php",
        title: "Весы электронные со стойкой MK_RA11",
        price: "86313",
        img: "../images/scale/5.jpg",
        code: "5004"
    }, {
        link: "scale_tbs_aruew.php",
        title: "Весы товарные ТВ-S_A(RUEW)3",
        price: "90080",
        img: "../images/scale/70.jpg",
        code: "5015"
    }, {
        link: "scale_tbs_ra.php",
        title: "Весы товарные ТВ-S_RA с регистрацией товароучетных операций",
        price: "96285",
        img: "../images/scale/91.jpg",
        code: "5017"
    }, {
        link: "scale_mk_ab_ruew.php",
        title: "Весы электронные влагозащищенные MK_AB2(RUEW)",
        price: "103598",
        img: "../images/scale/6.jpg",
        code: "5005"
    }, {
        link: "scale_tbs_aruew_rs.php",
        title: "Весы товарные ТВ-S_A RUEW с интерфейсами RS, USB, Ethernet, WiFi",
        price: "116340",
        img: "../images/scale/80.jpg",
        code: "5016"
    }, {
        link: "scale_tbs_ab.php",
        title: "Весы товарные ТВ-S_AB с влагозащищенным терминалом",
        price: "116949",
        img: "../images/scale/90.jpg",
        code: "5016"

    }, {
        link: "scale_4d.php",
        title: "Весы паллетные электронные 4D-PM_1A(RUEW)",
        price: "235672",
        img: "../images/scale/93.jpg",
        code: "5019"
    }, {
        link: "scale_tm30.php",
        title: "Весы электронные TM30A",
        price: "86696",
        img: "../images/scale/1.jpg",
        code: "5001"
    }, {
        link: "scale_mk_rp_10.php",
        title: "Весы торговые с печатью этикеток МК_RP10",
        price: "131021",
        img: "../images/scale/10.jpg",
        code: "5009"
    }, {
        link: "scale_mk_r2p_10.php",
        title: "Весы электронные с печатью этикеток МК_R2P10-1",
        price: "149580",
        img: "../images/scale/20.jpg",
        code: "5010"
    }, {
        link: "scale_rl_10.php",
        title: "Весы торговые с печатью этикеток МК_RL10-1",
        price: "176172",
        img: "../images/scale/30.jpg",
        code: "5011"

    }, {
        link: "scale_tbs_rl.php",
        title: "Весы торговые с печатью этикеток TB-S_RL1",
        price: "180881",
        img: "../images/scale/50.jpg",
        code: "5013"
    }, {
        link: "scale_mk_r2l.php",
        title: "Весы торговые с печатью этикеток МК_R2L10-1",
        price: "182266",
        img: "../images/scale/40.jpg",
        code: "5012"
    }, {
        link: "scale_tb_m.php",
        title: "Весы ТВ-M_RP с принтером этикеток",
        price: "189967",
        img: "../images/scale/92.jpg",
        code: "5018"
    }, {
        link: "scale_RLS1100.php",
        title: "Весы Rongta RLS1100 с принтером этикеток",
        price: "158920",
        img: "../images/rongta_rls/1rongta.jpg",
        code: "4488"
    }, {
        link: "scale_RLS1100C.php",
        title: "Весы Rongta RLS1100 C с принтером этикеток",
        price: "158920",
        img: "../images/rongta_rlsc/rongta_2mfruits_wm.png",
        code: "5089"
    }, {
        link: "scanpal_eda_50.php",
        title: "ТСД терминал Honeywell ScanPal EDA50",
        price: "231650",
        img: "../images/terminal/1.png",
        code: "7001"
    }, {
        link: "dors_1015.php",
        title: "Счетчики банкнот DORS CT1015",
        price: "30988",
        img: "../images/schetchiki/11.jpg",
        code: "8001"
    }, {
        link: "dors_1040.php",
        title: "Счетчики банкнот жидкокристаллические DORS CT1040",
        price: "53582",
        img: "../images/schetchiki/2.png",
        code: "8002"
    }, {
        link: "dors_600.php",
        title: "Счетчики банкнот светодиодные DORS 600 М2",
        price: "106907",
        img: "../images/schetchiki/3.png",
        code: "8003"
    }, {
        link: "magner_35.php",
        title: "Счетчики банкнот светодиодные Magner 35S",
        price: "246239",
        img: "../images/schetchiki/6.jpg",
        code: "8006"
    }, {
        link: "magner_2003.php",
        title: "Счетчики банкнот жидкокристаллические Magner 35-2003",
        price: "209536",
        img: "../images/schetchiki/7.jpg",
        code: "8007"
    }, {
        link: "magner_75.php",
        title: "Счетчики банкнот жидкокристаллические Magner 75 D",
        price: "301716",
        img: "../images/schetchiki/8.png",
        code: "8008"
    }, {
        link: "dors_750.php",
        title: "Счетчики монохромные жидкокристаллические DORS 750",
        price: "351107",
        img: "../images/schetchiki/4.jpg",
        code: "8004"
    }, {
        link: "dors_800.php",
        title: "Счетчики банкнот цветные сенсорные DORS 800",
        price: "432632",
        img: "../images/schetchiki/5.jpg",
        code: "8005"
    }, {
        link: "magner_100.php",
        title: "Счетчики банкнот графические Magner 100",
        price: "708158",
        img: "../images/schetchiki/9.png",
        code: "8009"
    }, {
        link: "magner_150.php",
        title: "Счетчики банкнот графические Magner 150",
        price: "767000",
        img: "../images/schetchiki/10.jpg",
        code: "8010"
    }, {
        link: "magner_175.php",
        title: "Счетчики банкнот жидкокристаллические Magner 175",
        price: "1235000",
        img: "../images/schetchiki/20.png",
        code: "8011"

    }, {
        link: "dors_50.php",
        title: "Ультрафиолетовые детекторы банкнот DORS 50",
        price: "5345",
        img: "../images/detector/1.jpg",
        code: "9001"
    }, {
        link: "dors_60.php",
        title: "Ультрафиолетовые детекторы банкнот DORS 60",
        price: "8315",
        img: "../images/detector/2.jpg",
        code: "9002"
    }, {
        link: "dors_125.php",
        title: "Ультрафиолетовые детекторы банкнот DORS",
        price: "8639",
        img: "../images/detector/3.jpg",
        code: "9003"
    }, {
        link: "dors_1000.php",
        title: "Инфракрасные детекторы банкнот DORS 1000 M3",
        price: "33854",
        img: "../images/detector/4.jpg",
        code: "9004"
    }, {
        link: "dors_1100.php",
        title: "Инфракрасные детекторы банкнот DORS 1100",
        price: "53454",
        img: "../images/detector/5.jpg",
        code: "9005"
    }, {
        link: "dors_1170.php",
        title: "Инфракрасные детекторы банкнот DORS 1170D",
        price: "86380",
        img: "../images/detector/6.jpg",
        code: "9006"
    }, {
        link: "dors_1250.php",
        title: "Инфракрасные детекторы банкнот DORS 1250",
        price: "100968",
        img: "../images/detector/8.jpg",
        code: "9008"
    }, {
        link: "dors_230.php",
        title: "Автоматические детекторы банкнот DORS 230",
        price: "117229",
        img: "../images/detector/10.jpg",
        code: "9010"
    }, {
        link: "dors_1300.php",
        title: "Инфракрасные детекторы банкнот DORS 1300",
        price: "148482",
        img: "../images/detector/9.jpg",
        code: "9009"
    }, {
        link: "radio_frequency.php",
        title: "Радиочастотные антикражные ворота",
        price: "82934",
        img: "../images/eas/4.jpg",
        code: "9030"
    }, {
        link: "mini_square.php",
        title: "Радиочастотная бирка Mini square",
        price: "31",
        img: "../images/eas/7.jpg",
        code: "9031"
    }, {
        link: "radio_golf.php",
        title: "Радиочастотная бирка Golf",
        price: "84",
        img: "../images/eas/8.png",
        code: "9032"
    }, {
        link: "radio_bottle.php",
        title: "Радиочастотная бирка Bottle tag",
        price: "185",
        img: "../images/eas/14.jpg",
        code: "9033"
    }, {
        link: "puller_universal.php",
        title: "Съемник универсальный",
        price: "10462",
        img: "../images/eas/6.jpg",
        code: "9035"
    },
    {
        link: "radio_label.php",
        title: "Самоклеющиеся радиочастотные защитные этикетки",
        price: "6380",
        img: "../images/eas/10.jpg",
        code: "9036"
    },
    {
        link: "radio_deactivator.php",
        title: "Радиочастотный деактиватор",
        price: "38277",
        img: "../images/eas/10.jpg",
        code: "9037"
    }, {
        link: "acoustomagnetic.php",
        title: "Акустомагнитная противокражная система",
        price: "165867",
        img: "../images/eas/1.jpg",
        code: "9038"
    }, {
        link: "acoustomagnetic_tag.php",
        title: "Акустомагнитная бирка Карандаш",
        price: "57",
        img: "../images/eas/2.jpg",
        code: "9039"
    }, {
        link: "loop.php",
        title: "Антикражный тросик",
        price: "5742",
        img: "../images/eas/9.jpg",
        code: "9034"
    }, {
        link: "acoustomagnetic_bottle.php",
        title: "Акустомагнитная бирка Bottle tag",
        price: "204",
        img: "../images/eas/13.png",
        code: "9040"
    }, {
        link: "acoustomagnetic_label.php",
        title: "Акустомагнитная этикетка лист",
        price: "1403",
        img: "../images/eas/3.jpg",
        code: "9041"
    }, {
        link: "acoustomagnetic_deactivator.php",
        title: "Акустомагнитный деактиватор",
        price: "63795",
        img: "../images/eas/5.png",
        code: "9042"
    }
]

let list = []
data4.forEach(function(a) {
    let list2 = a.title.split(" ")
    list2.forEach(function(b) {
        list.push(b)
    })
})



document.querySelector(".search-btn").addEventListener("click", function(e) {
    let reversed = false;

    let info = document.querySelector('#txtSearch').value


    var patterns = info.split(" ");
    console.log(patterns);

    var fields = { title: true, code: true, };
    let searchedWord = document.querySelector('#txtSearch').value
    if (localStorage.getItem("searched-word") === null) {
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    } else {
        localStorage.removeItem('searched-word');
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    }

    startSearch()

    function startSearch() {

        var results = smartSearch(data4, patterns, fields);
        // console.log(patterns);
        // console.log(results);
        // results.forEach(function(result) {
        //     console.log(result.entry);



        let sorted = []
        results.filter(function(a) {
            if (a.score < 2) {
                sorted.push(a.entry)
                return a.entry;
            }
        })




        // console.log(searchArray);


        document.querySelector('#txtSearch').value = ``


        if (localStorage.getItem("searched-cards") === null) {
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        } else {
            localStorage.removeItem('searched-cards');
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        }




        var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
        if (sorted.length > 0) {
            window.location.href = "search.html"
        } else {
            if (reversed == false) {
                patterns.reverse()
                reversed = true;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }

                }
            } else {
                patterns.reverse()
                reversed = false;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }
                }
            }
        }




    }


})

document.querySelector('#txtSearch').addEventListener('keypress', function(e) {
    let reversed = false;
    if (e.key === 'Enter') {
        let info = document.querySelector('#txtSearch').value


        var patterns = info.split(" ");
        console.log(patterns);

        var fields = { title: true, code: true, };
        let searchedWord = document.querySelector('#txtSearch').value
        if (localStorage.getItem("searched-word") === null) {
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        } else {
            localStorage.removeItem('searched-word');
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        }

        startSearch()

        function startSearch() {

            var results = smartSearch(data4, patterns, fields);
            // console.log(patterns);
            // console.log(results);
            // results.forEach(function(result) {
            //     console.log(result.entry);



            let sorted = []
            results.filter(function(a) {
                if (a.score < 2) {
                    sorted.push(a.entry)
                    return a.entry;
                }
            })




            // console.log(searchArray);


            document.querySelector('#txtSearch').value = ``


            if (localStorage.getItem("searched-cards") === null) {
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            } else {
                localStorage.removeItem('searched-cards');
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            }




            var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
            if (sorted.length > 0) {
                window.location.href = "search.html"
            } else {
                if (reversed == false) {
                    patterns.reverse()
                    reversed = true;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }

                    }
                } else {
                    patterns.reverse()
                    reversed = false;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }
                    }
                }
            }




        }

    }
});





document.querySelector(".search-btn2").addEventListener("click", function(e) {
    let reversed = false;

    let info = document.querySelector('#txtSearch2').value


    var patterns = info.split(" ");
    console.log(patterns);

    var fields = { title: true, code: true, };
    let searchedWord = document.querySelector('#txtSearch2').value
    if (localStorage.getItem("searched-word") === null) {
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    } else {
        localStorage.removeItem('searched-word');
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    }

    startSearch()

    function startSearch() {

        var results = smartSearch(data4, patterns, fields);
        // console.log(patterns);
        // console.log(results);
        // results.forEach(function(result) {
        //     console.log(result.entry);



        let sorted = []
        results.filter(function(a) {
            if (a.score < 2) {
                sorted.push(a.entry)
                return a.entry;
            }
        })




        // console.log(searchArray);


        document.querySelector('#txtSearch').value = ``


        if (localStorage.getItem("searched-cards") === null) {
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        } else {
            localStorage.removeItem('searched-cards');
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        }




        var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
        if (sorted.length > 0) {
            window.location.href = "search.html"
        } else {
            if (reversed == false) {
                patterns.reverse()
                reversed = true;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }

                }
            } else {
                patterns.reverse()
                reversed = false;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }
                }
            }
        }




    }



})

document.querySelector('#txtSearch2').addEventListener('keypress', function(e) {
    let reversed = false;
    if (e.key === 'Enter') {
        let info = document.querySelector('#txtSearch2').value


        var patterns = info.split(" ");
        console.log(patterns);

        var fields = { title: true, code: true, };
        let searchedWord = document.querySelector('#txtSearch2').value
        if (localStorage.getItem("searched-word") === null) {
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        } else {
            localStorage.removeItem('searched-word');
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        }

        startSearch()

        function startSearch() {

            var results = smartSearch(data4, patterns, fields);
            // console.log(patterns);
            // console.log(results);
            // results.forEach(function(result) {
            //     console.log(result.entry);



            let sorted = []
            results.filter(function(a) {
                if (a.score < 2) {
                    sorted.push(a.entry)
                    return a.entry;
                }
            })




            // console.log(searchArray);


            document.querySelector('#txtSearch').value = ``


            if (localStorage.getItem("searched-cards") === null) {
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            } else {
                localStorage.removeItem('searched-cards');
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            }




            var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
            if (sorted.length > 0) {
                window.location.href = "search.html"
            } else {
                if (reversed == false) {
                    patterns.reverse()
                    reversed = true;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }

                    }
                } else {
                    patterns.reverse()
                    reversed = false;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }
                    }
                }
            }




        }
    }
});


function errorMsg() {
    iziToast.warning({ title: '', message: 'По такому запросу продуктов не найдено' });
}

// settings関数で初期設定 全体に適応させたい場合
// iziToast.settings({
//     timeout: 3000, // default timeout
//     resetOnHover: true,
//     // icon: '', // icon class
//     transitionIn: 'flipInX',
//     transitionOut: 'flipOutX',
//     position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
//     onOpen: function() {
//         // console.log('callback abriu!');
//     },
//     onClose: function() {
//         // console.log("callback fechou!");
//     }
// });