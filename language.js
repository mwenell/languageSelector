// MIT License
// Copyright (c) 2017 Mika Wenell

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

// Source code and documentation: https://github.com/mwenell/languageSelector

var languageSelector = {
    version: '1.4.1',
    defaultLanguage: 'en', // Default language if no language available
    nameOfSelectorFrame: 'LANGUAGE', // Name of the language selector frame element
    idOfScript: 'language_script', // ID of the script element
    flagPath: 'flags/', // Where are the flag images as EN.png
    
    cookieKeyName: 'languageSelectorValue', // Cookie name for selected language
    cookieExpirationDays: 3650,
    
    styleId: 'languageSelectorStyle',
    
    // null = no language selector | frame element of selectors
    frameElementsOfSelectorFlags: null,
    
    // null = no selectors | array of language selectors or empty array if no selectors
    elementsOfLanguageSelectors: null,
    
    elementOfScript: null,
    
    actualLanguage: null,
    languageList: {},
    languageArray: new Array(),
    languageHreflangs: {}, // Elements of all hreflang elements at head
    
    debugMode: false,
    
    languageCoutryList: {
        "sq": "AL",
        "hy": "AM",
        "ps": "AR",
        "az": "AZ",
        "bs": "BA",
        "bg": "BG",
        "be": "BY",
        "zh": "CN",
        "cs": "CZ",
        "de": "DE",
        "da": "DK",
        "et": "EE",
        "es": "ES",
        "gl": "ES",
        "fi": "FI",
        "fo": "FO",
        "fr": "FR",
        "en": "GB",
        "ka": "GE",
        "el": "GR",
        "hr": "HR",
        "hu": "HU",
        "id": "ID",
        "he": "IL",
        "hi": "IN",
        "fa": "IR",
        "is": "IS",
        "it": "IT",
        "ja": "JP",
        "sw": "KE",
        "ky": "KG",
        "ko": "KR",
        "kk": "KZ",
        "lt": "LT",
        "lv": "LV",
        "mk": "MK",
        "mn": "MN",
        "mt": "MT",
        "dv": "MV",
        "ms": "MY",
        "nl": "NL",
        "nb": "NO",
        "nn": "NO",
        "mi": "NZ",
        "tl": "PH",
        "ur": "PK",
        "pl": "PL",
        "pt": "PT",
        "ro": "RO",
        "ru": "RU",
        "sv": "SE",
        "sl": "SI",
        "sk": "SK",
        "sr": "SP",
        "sy": "SY",
        "th": "TH",
        "tr": "TR",
        "uk": "UA",
        "uz": "UZ",
        "vi": "VN",
        "zu": "ZA"
    },
    
    languageNameList: {
        "sq": "Albanian",
        "hy": "Armenian",
        "ps": "Pashto",
        "az": "Azeri",
        "bs": "Bosnian",
        "bg": "Bulgarian",
        "be": "Belarusian",
        "zh": "Chinese",
        "cs": "Czech",
        "de": "German",
        "da": "Danish",
        "et": "Estonian",
        "es": "Spanish",
        "gl": "Galician",
        "fi": "Finnish",
        "fo": "Faroese",
        "fr": "French",
        "en": "English",
        "ka": "Georgian",
        "el": "Greek",
        "hr": "Croatian",
        "hu": "Hungarian",
        "id": "Indonesian",
        "he": "Hebrew",
        "hi": "Hindi",
        "fa": "Farsi",
        "is": "Icelandic",
        "it": "Italian",
        "ja": "Japanese",
        "sw": "Swahili",
        "ky": "Kyrgyz",
        "ko": "Korean",
        "kk": "Kazakh",
        "lt": "Lithuanian",
        "lv": "Latvian",
        "mk": "FYRO Macedonian",
        "mn": "Mongolian",
        "mt": "Maltese",
        "dv": "Divehi",
        "ms": "Malay",
        "nl": "Dutch",
        "nb": "Norwegian",
        "nn": "Norwegian",
        "mi": "Maori",
        "tl": "Tagalog",
        "ur": "Urdu",
        "pl": "Polish",
        "pt": "Portuguese",
        "ro": "Romanian",
        "ru": "Russian",
        "sv": "Swedish",
        "sl": "Slovenian",
        "sk": "Slovak",
        "sr": "Serbian",
        "sy": "Syriac",
        "th": "Thai",
        "tr": "Turkish",
        "uk": "Ukrainian",
        "uz": "Uzbek",
        "vi": "Vietnamese",
        "zu": "Zulu"
    },
    
    //
    // Initialize the languageSelector. 
    // This is called automatically when loading this library.
    //
    
    init: function() {
        languageSelector.elementOfScript = document.getElementById(languageSelector.idOfScript);
        // Read in debug status
        languageSelector.debugMode = (typeof languageSelector.elementOfScript.dataset.debug == 'string' && languageSelector.elementOfScript.dataset.debug == "1" ? true : false);
        languageSelector.log("languageSelector: Started");
        // Read in all possible languages from script data-languages
        var langListStr = (typeof languageSelector.elementOfScript.dataset.languages == 'string' ? languageSelector.elementOfScript.dataset.languages : '');
        
        if(langListStr != ''){
            languageSelector.languageArray = langListStr.split(',');
        }
        
        languageSelector.updateHreflangValues();
        if(languageSelector.languageArray.length > 0){
            // Define the default language to be the first language in data-languages list
            languageSelector.defaultLanguage = languageSelector.languageArray[0];
            // Validate languages and build list of languages
            for(var c = 0; c < languageSelector.languageArray.length; c++){
                var lang = languageSelector.validateISO6391(languageSelector.languageArray[c]);
                if(lang == ''){
                    // Invalid language code, cannot continue
                    languageSelector.log('languageSelector: Invalid language code ' + (languageSelector.languageArray[c] == "" ? '(empty)' : languageSelector.languageArray[c]) + ' in script parameter (data-languages)');
                    return;
                }
                languageSelector.languageList[lang] = lang;
            }
            
            // Set the actual language on
            languageSelector.setLanguage(languageSelector.getLang(), true);
            // Init all language selector elements as img, select etc. after the whole DOM has been loaded
            document.addEventListener('DOMContentLoaded', languageSelector.initLanguageSelectors);
            languageSelector.log("languageSelector: Following languages activated: " + langListStr);
        } else {
            // There was no language list in script data-languages variable -> cannot continue
            languageSelector.log('languageSelector: No languages defined: data-languages = ' + langListStr);
        }
    },
    
    //
    // initLanguageSelectors() adds event listener to follow language changes by user
    // Language change can happen by a click of any element, change of select option or 
    // change of input value if the element is inside language tag and has correct lang tag. 
    //
    
    initLanguageSelectors: function(){
        // Find all frame elements of language selectors
        languageSelector.frameElementsOfSelectorFlags = document.getElementsByTagName(languageSelector.nameOfSelectorFrame);
        if(languageSelector.frameElementsOfSelectorFlags.length > 0) {
            languageSelector.elementsOfLanguageSelectors = [];
            // Frame tag of language selectors found
            for(var i = 0; i < languageSelector.frameElementsOfSelectorFlags.length; i++){
                var elements = languageSelector.frameElementsOfSelectorFlags[i].childNodes;
                var language = '';
                var langFlags = {};
                if(elements.length > 0){
                    languageSelector.log("languageSelector: Has found following language selector elements:");
                    for(var c = 0; c < elements.length; c++){
                        if(typeof elements[c].getAttribute != 'undefined'){
                            switch(elements[c].tagName) {
                                case 'SELECT':
                                    elements[c].addEventListener('change', languageSelector.changeLanguageSelect);
                                    languageSelector.elementsOfLanguageSelectors.push(elements[c]);
                                    var optionElements = elements[c].getElementsByTagName('OPTION');
                                    if(optionElements.length > 0){
                                        for(var n = 0; n < optionElements.length; n++){
                                            langFlags[optionElements[n].value] = optionElements[n];
                                        }
                                    }
                                    languageSelector.log(elements[c]);
                                    break;
                                case 'IMG':
                                    language = elements[c].getAttribute('lang');
                                    if(language != null && language != '') {
                                        langFlags[language] = elements[c];
                                        elements[c].addEventListener('click', languageSelector.changeLanguageClick);
                                        languageSelector.elementsOfLanguageSelectors.push(elements[c]);
                                        if(language == languageSelector.actualLanguage) {
                                            elements[c].className += ' selected';
                                        }
                                        languageSelector.log(elements[c]);
                                    }
                            }
                        }
                    }
                }
                // Insert missing flags
                if(languageSelector.languageArray.length > 0){
                        for(var n = 0; n < languageSelector.languageArray.length; n++){
                            // Check that each of language flags exists
                            if(typeof langFlags[languageSelector.languageArray[n]] == 'undefined'){
                                if(typeof languageSelector.frameElementsOfSelectorFlags[i].dataset.type == 'undefined' || languageSelector.frameElementsOfSelectorFlags[i].dataset.type.toUpperCase() != 'SELECT'){
                                    languageSelector.insertFlag(languageSelector.frameElementsOfSelectorFlags[i], languageSelector.languageArray[n]);
                                } else {
                                    languageSelector.insertSelectOption(languageSelector.frameElementsOfSelectorFlags[i], languageSelector.languageArray[n]);
                                }
                            }
                        }
                }
            }
        }
        
        languageSelector.setLanguage(languageSelector.getLang(), true); // Update which language selector is seleted
    },
    
    //
    // insertFlag(languageTag, language) function inserts a flag image element into the LANGUAGE tag
    //
    
    insertFlag: function(languageTag, language){
        if(languageTag && typeof language == 'string'){
            var lang = languageSelector.validateISO6391(language);
            if(lang && typeof languageSelector.elementOfScript.src == 'string'){
                var imgElement = document.createElement('IMG');
                imgElement.lang = lang;
                var thisScriptFile = languageSelector.elementOfScript.src;
                var thisScriptBaseURL = thisScriptFile.substr(0, thisScriptFile.search(/\w+\.js$|\w+\.js\?.*$/));
                var country = '';
                if(lang.length == 2){
                    // Language code does not include country code: en, use language - country list to select correct flag
                    if(typeof languageSelector.languageCoutryList[lang] == 'string'){
                        // Language - coutry code exists
                        country = languageSelector.languageCoutryList[lang];
                    } else {
                        // Unsupported language code
                        languageSelector.log('languageSelector: Unsupported language code: ' + lang);
                        return;
                    }
                } else {
                    // Language code includes country code as well: en-GB, use the country code to show the correct flag
                    country = lang.substring(3, 6);
                }
                imgElement.src =  thisScriptBaseURL + languageSelector.flagPath + country.toUpperCase() + '.png';
                imgElement.addEventListener('click', languageSelector.changeLanguageClick);
                if(language == languageSelector.actualLanguage) {
                    imgElement.className += ' selected';
                }
                languageSelector.elementsOfLanguageSelectors.push(imgElement);
                languageTag.appendChild(imgElement);
            }
        }
    },
    
    //
    // insertSelectOption(languageTag, language) function inserts language option in SELECT elements in LANGUAGE tag
    //
    
    insertSelectOption: function(languageTag, language){
        if(languageTag && typeof language == 'string'){
            var lang = languageSelector.validateISO6391(language);
            if(lang && typeof languageSelector.elementOfScript.src == 'string'){
                var selectElements = languageTag.getElementsByTagName('SELECT');
                if(selectElements.length == 0){
                    // No existing SELECT element, create a new one
                    var selectElement = document.createElement('SELECT');
                    selectElement.addEventListener('change', languageSelector.changeLanguageSelect);
                    languageTag.appendChild(selectElement);
                }
                selectElements = languageTag.getElementsByTagName('SELECT');
                for(var i = 0; i < selectElements.length; i++){
                    // Insert missing languages in each LANGUAGE tag
                    var optionElement = document.createElement('OPTION');
                    optionElement.value = language;
                    optionElement.text = languageSelector.languageNameList[language];
                    if(languageSelector.actualLanguage == language){
                        // This is the selected language
                        optionElement.selected = true;
                    }
                    selectElements[i].appendChild(optionElement);
                }
            }
        }
    },
    
    //
    // changeLanguageClick(el) is an event callback when user has clicked change language element
    //
    
    changeLanguageClick: function(el){
        var newLang = this.getAttribute('lang');
        if(newLang == null || newLang == '') return;
        languageSelector.setLanguage(newLang);
        if(typeof languageChangeCallback == 'function') languageChangeCallback(newLang, this);
    },

    
    //
    // changeLanguageSelect(el) is an event callback when user has changed language in SELECT element
    //
    
    changeLanguageSelect: function(el){
        if(typeof this.options[this.selectedIndex].value == 'string'){
            languageSelector.setLanguage(this.options[this.selectedIndex].value);
            if(typeof languageChangeCallback == 'function') languageChangeCallback(this.options[this.selectedIndex].value, this);
        }
    },
    
    //
    // setLanguage(lang) select new language and store the language value in cookies
    //
    
    setLanguage: function(lang, refresh){
        lang = (typeof lang == 'string' ? languageSelector.isSupportedLanguage(lang) : languageSelector.getLang());
        refresh = refresh || false;
        
        if(lang == '' || (lang == languageSelector.actualLanguage && !refresh)) return; // Already selected or unsupported language
        languageSelector.actualLanguage = lang;
        setCookie(languageSelector.cookieKeyName, lang, languageSelector.cookieExpirationDays);
        if(languageSelector.redirectHrefLang(lang)){
            // NOPE
        } else {
            document.documentElement.lang = '';
            var heads = document.getElementsByTagName('head');
            if(typeof heads[0] != 'undefined'){
                var head = heads[0];
                head.appendChild(languageSelector.getStyleElement(languageSelector.lang));
                languageSelector.log('languageSelector: Language <style> has been inserted in <head>');
            } else {
                languageSelector.log('languageSelector: ERROR: No <head> available, cannot select language.');
            }
            languageSelector.setSelector();
        }
        languageSelector.log('languageSelector: Set language ' + lang + ' on');
    },
    
    //
    // redirectHrefLang(lang) change the current page to new page with selected language based on hreflang tags
    //
    
    redirectHrefLang: function (lang){
        var heads = document.getElementsByTagName('head');
        if(typeof heads[0] == 'undefined'){
            languageSelector.log('LanguageSelector: No head element found on page');
            return false;
        }

        var hrefLangTags = heads[0].getElementsByTagName('link');
        if(!hrefLangTags || hrefLangTags.length == 0){
            languageSelector.log('LanguageSelector: No Link element with hreflang found on the page head.');
            return false;
        }
        
        var hrefLangURL = '';
        var baseURLLen = window.location.href.indexOf("?");
        if(baseURLLen < 0) baseURLLen = window.location.href.length;
        var actualBaseURL = window.location.href.substring(0, baseURLLen);
        // Find all hreflang metadata
        languageSelector.log('LanguageSelector: Has found folowing link elements in head with hrefLang:');
        for (var i = 0; i < hrefLangTags.length; i++){
            languageSelector.log('LanguageSelector: Link ' + (i + 1) + ' : hreflang = ' + hrefLangTags[i].hreflang);
            if(hrefLangTags[i].hreflang == lang || hrefLangTags[i].hreflang.substring(0,lang.length) == lang){
                // hreflang is matching
                hrefLangURL = hrefLangTags[i].href;
                if(actualBaseURL != hrefLangURL){
                    // The language page has been found, open it
                    languageSelector.log('LanguageSelector: Language match found: hreflang = ' + hrefLangTags[i].hreflang + ' href = ' + hrefLangTags[i].href);
                    window.location.replace (hrefLangURL + window.location.search);
                    return true;
                }
            }
        }
        languageSelector.log('LanguageSelector: No hreflang found.');
        return false;
    },
    
    //
    // Read in all hreflang values
    //
    
    updateHreflangValues: function(){
        var heads = document.getElementsByTagName('head');
        if(!heads || typeof heads[0] == 'undefined'){
            languageSelector.log('LanguageSelector: No head element found on page');
            return false;
        }

        var hrefLangTags = heads[0].getElementsByTagName('link');

        if(!hrefLangTags || hrefLangTags.length == 0){
            languageSelector.log('LanguageSelector: No Link element with hreflang found on the page head.');
            return false;
        }
        // Find all hreflang metadata
        languageSelector.languageHreflangs = {};
        languageSelector.log('LanguageSelector: Has found folowing link elements in head with hrefLang:');
        for (var i = 0; i < hrefLangTags.length; i++){
            if(typeof hrefLangTags[i].hreflang == 'string' && hrefLangTags[i].hreflang != ''){
                languageSelector.log('LanguageSelector: Link ' + (i + 1) + ' : hreflang = ' + hrefLangTags[i].hreflang);
                languageSelector.languageHreflangs[hrefLangTags[i].hreflang] = hrefLangTags[i];
                languageSelector.languageList[hrefLangTags[i].hreflang] = hrefLangTags[i].hreflang;
                languageSelector.languageArray.push(hrefLangTags[i].hreflang);
            }
        }
    },
    
    //
    //  setSelector() views the selected language selectors as selected
    //
    
    setSelector: function() {
        if(languageSelector.elementsOfLanguageSelectors != null && languageSelector.elementsOfLanguageSelectors.length > 0){
            for(var c = 0; c < languageSelector.elementsOfLanguageSelectors.length; c++){
                if(typeof languageSelector.elementsOfLanguageSelectors[c].tagName == 'string'){
                    switch(languageSelector.elementsOfLanguageSelectors[c].tagName){
                        case 'SELECT':
                                languageSelector.elementsOfLanguageSelectors[c].value = languageSelector.actualLanguage;
                            break;
                        case 'IMG':
                            languageSelector.elementsOfLanguageSelectors[c].className = languageSelector.elementsOfLanguageSelectors[c].className.replace(/\ selected/g, '');
                            if(languageSelector.elementsOfLanguageSelectors[c].getAttribute('lang') == languageSelector.actualLanguage){
                                // The element is the selected language element
                                try {
                                languageSelector.elementsOfLanguageSelectors[c].className += ' selected';
                                } catch(e) {
                                    // NOPE
                                }
                            } else {
                                try {
                                languageSelector.elementsOfLanguageSelectors[c].style.opacity = "1";
                                } catch(e) {
                                    // NOPE
                                }                                
                            }
                            break;
                    }

                }
            }
        }
    },

    //
    // getStyleElement() creates the style element which show the elements of selected language and hides elements of other languages.
    // Rteurnvalue is the style element.
    //
    
    getStyleElement: function(){
        var returnValue = document.getElementById(languageSelector.styleId);
        if(returnValue == null) {
            returnValue = document.createElement("style");
            returnValue.id = languageSelector.styleId;
        }
        if(languageSelector.languageArray != null){
            var styleString = '';
            if(languageSelector.actualLanguage == null) languageSelector.getLang();
            for(var c = 0; c < languageSelector.languageArray.length; c++){
                if(languageSelector.actualLanguage != languageSelector.languageArray[c]){
                    styleString += ':not(' + languageSelector.nameOfSelectorFrame + ')>:lang(' + languageSelector.languageArray[c] + ') {display: none!important;} ';
                    styleString += languageSelector.nameOfSelectorFrame + '>:lang(' + languageSelector.languageArray[c] + ') {cursor: pointer;} ';
                } else {
                    styleString += languageSelector.nameOfSelectorFrame + '>:lang(' + languageSelector.languageArray[c] + ') {cursor: default;} ';
                }
            }
            returnValue.setAttribute('type', 'text/css');
            returnValue.innerHTML = styleString;
        }
        return returnValue;
    },
    
    
    //
    // getLang() reads the language from a) cookie (user has selected before), b) supported language selected in browser or c) default language
    //
    
    getLang: function(){
        if(languageSelector.actualLanguage != null && languageSelector.actualLanguage != '') return languageSelector.actualLanguage;
        var lang = null;
        lang = getCookie(languageSelector.cookieKeyName);

        if(typeof languageSelector.languageList[lang] == 'undefined') lang = null;
        
        if(typeof lang != 'string' || lang == '') {
            // Try user's preferred languages
            if(typeof window.navigator.languages != 'undefined' && typeof window.navigator.languages[0] == 'string'){
                for(var c = 0; c < window.navigator.languages.length; c++){
                    lang = languageSelector.isSupportedLanguage(window.navigator.languages[c]);
                    if(lang != '' && typeof languageSelector.languageList[lang] != 'undefined') return lang;
                }
            }
            // Try preferred language of the user as e.g. browser language
            if(typeof window.navigator.language == 'string') {
                lang = languageSelector.isSupportedLanguage(window.navigator.language);
                if(lang != '' && typeof languageSelector.languageList[lang] != 'undefined') return lang;
            }
            // Try IE OS language
            if(typeof window.navigator.browserLanguage == 'string'){
                lang = languageSelector.isSupportedLanguage(window.navigator.browserLanguage);
                if(lang != '' && typeof languageSelector.languageList[lang] != 'undefined') return lang;
            }
            // Try IE User Language
            if(typeof window.navigator.userLanguage == 'string'){
                lang = languageSelector.isSupportedLanguage(window.navigator.userLanguage);
                if(lang != '' && typeof languageSelector.languageList[lang] != 'undefined') return lang;
            }
            
            // No preferred language, use default language
            lang = languageSelector.defaultLanguage;
        }
        return lang;
    },
    
    
    //
    // isSupportedLanguage(lang) tests if the lang is supported
    //
    
    isSupportedLanguage: function(lang){
        lang = languageSelector.validateISO6391(lang);
        if(typeof languageSelector.languageList[lang] != 'undefined') return lang;
        languageSelector.log('languageSelector warning: Found unsupported language selector in use (' + lang + ')');
        return false;
    },
    
    //
    // Validate the language code to be ISO 639-1 compatible and return validated language code or 
    //
    
    validateISO6391: function(lang){
        var correctLangReg = /^[a-z]{2}$|^[a-z]{2}[-][A-Z]{2}$|^Cy-az-AZ$|^Lt-az-AZ$|^Cy-sr-SP$|^Lt-sr-SP$|^Cy-uz-UZ$|^Lt-uz-UZ$|^kok-IN$|^kok$|^zh[-]Han[st]/;
        languages = correctLangReg.exec(lang);
        if(languages == null) return '';
        return languages[0];
    },
    
    
    // 
    // Log if debug mode is on in script tag, Use <script data-debug="1" ...> to activate
    //
    
    log: function(msg){
        if(languageSelector.debugMode) console.log(msg);
    }
}

//
// Cookie management functions
//

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

languageSelector.init();
