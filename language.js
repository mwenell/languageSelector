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

//
// Version 0.1
//

var languageSelector = {
    defaultLanguage: 'en', // Default language if no language available
    nameOfSelectorFrame: 'LANGUAGE', // Name of the language selector frame element
    idOfScript: 'language_script', // ID of the script element
    opacityValueOfSelectedLanguageElement: "0.5", // Opacity value for selected language selector element
    
    // null = no language selector | frame element of selectors
    frameElementsOfSelectorFlags: null,
    
    // null = no selectors | array of language selectors or empty array if no selectors
    elementsOfLanguageSelectors: null,
    
    elementOfScript: null,
    
    actualLanguage: null,
    languageArray: null,
    languageList: [],
    
    debugMode: false,
    
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
            // Define the default language to be the first language in data-languages list
            languageSelector.defaultLanguage = languageSelector.languageArray[0];
            // Validate languages and build list of languages
            for(var c = 0; c < languageSelector.languageArray.length; c++){
                var lang = languageSelector.validateISO6391(languageSelector.languageArray[c]);
                if(lang == ''){
                    // Invalid language code, cannot continue
                    languageSelector.log('languageSelector: Invalid language code ' + languageSelector.languageArray[c] + 'in script parameter (data-languages)');
                    return;
                }
                languageSelector.languageList[lang] = true;
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
            // There are frame tag of language selectors
            for(var i = 0; i < languageSelector.frameElementsOfSelectorFlags.length; i++){
                var elements = languageSelector.frameElementsOfSelectorFlags[i].childNodes;
                var language = '';
                if(elements.length > 0){
                    languageSelector.log("languageSelector: Has found following language selector elements:");
                    for(var c = 0; c < elements.length; c++){
                        if(typeof elements[c].getAttribute != 'undefined'){
                            switch(elements[c].tagName) {
                                case 'SELECT':
                                    elements[c].addEventListener('change', languageSelector.changeLanguageSelect);
                                    languageSelector.elementsOfLanguageSelectors.push(elements[c]);
                                    languageSelector.log(elements[c]);
                                    break;
                                case 'INPUT':
                                    elements[c].addEventListener('change', languageSelector.changeLanguageInput);
                                    languageSelector.elementsOfLanguageSelectors.push(elements[c]);
                                    languageSelector.log(elements[c]);
                                    break;
                                default:
                                    language = elements[c].getAttribute('lang');
                                    if(language != null && language != '') {
                                        elements[c].addEventListener('click', languageSelector.changeLanguageClick);
                                        languageSelector.elementsOfLanguageSelectors.push(elements[c]);
                                        languageSelector.log(elements[c]);
                                    }
                            }
                        }
                    }
                }
            }
        }
        languageSelector.setLanguage(languageSelector.getLang(), true); // Update which language selector is seleted
    },
    
    
    //
    // changeLanguageClick(el) is an event callback when user has clicked change clickable language element
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
            if(typeof languageChangeCallback == 'function') languageChangeCallback(newLang, this);
        }
    },
    
    
    //
    // changeLanguageInput(el) is an event callback when user has changed language in INPUT element
    //
    
    changeLanguageInput: function(el){
        if(typeof this.value == 'string'){
            languageSelector.setLanguage(this.value);
            if(typeof languageChangeCallback == 'function') languageChangeCallback(newLang, this);
        }
    },
    
    
    //
    // setLanguage(lang) select new language and store the language value in localstorage
    //
    
    setLanguage: function(lang, refresh){
        lang = (typeof lang == 'string' ? languageSelector.isSupportedLanguage(lang) : languageSelector.getLang());
        refresh = refresh || false;
        if(lang == '' || (lang == languageSelector.actualLanguage && !refresh)) return; // Already selected or unsupported language
        languageSelector.actualLanguage = lang;
        if(typeof Storage !== 'undefined') {
            localStorage.setItem('language', lang);
        }
        document.body.insertBefore(languageSelector.getStyleElement(languageSelector.lang), languageSelector.elementOfScript);
        languageSelector.setSelector();
        languageSelector.log('languageSelector: Set language ' + lang + ' on');
    },
    
    //
    //  setSelector() view the selected language selectors as selected
    //
    
    setSelector: function() {
        if(languageSelector.elementsOfLanguageSelectors != null && languageSelector.elementsOfLanguageSelectors.length > 0){
            for(var c = 0; c < languageSelector.elementsOfLanguageSelectors.length; c++){
                if(typeof languageSelector.elementsOfLanguageSelectors[c].tagName == 'string'){
                    switch(languageSelector.elementsOfLanguageSelectors[c].tagName){
                        case 'SELECT':
                        case 'INPUT':
                                languageSelector.elementsOfLanguageSelectors[c].value = languageSelector.actualLanguage;
                            break;
                        default:
                            if(languageSelector.elementsOfLanguageSelectors[c].getAttribute('lang') == languageSelector.actualLanguage){
                                // The element is the selected language element
                                try {
                                languageSelector.elementsOfLanguageSelectors[c].style.opacity = languageSelector.opacityValueOfSelectedLanguageElement;
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
                if(languageSelector.actualLanguage != languageSelector.languageArray[c])
                    styleString += ':not(' + languageSelector.nameOfSelectorFrame + ')>:lang(' + languageSelector.languageArray[c] + ') {display: none;} ';
            }
            returnValue.innerHTML = styleString;
        }
        return returnValue;
    },
    
    
    //
    // getLang() reads the language from a) localstorage (user has selected before), b) supported language selected in browser or c) default language
    //
    
    getLang: function(){
        if(languageSelector.actualLanguage != null) return languageSelector.actualLanguage;
        var lang = null;
        if(typeof Storage !== 'undefined') {
            lang = localStorage.getItem('language');
        }
        if(typeof lang != 'string') {
            // Try user's preferred languages
            if(typeof window.navigator.languages[0] == 'string'){
                for(var c = 0; c < window.navigator.languages.length; c++){
                    lang = languageSelector.isSupportedLanguage(window.navigator.languages[c]);
                    if(lang != '') return lang;
                }
            }
            
            // Try preferred language of the user as e.g. browser language
            if(typeof window.navigator.language == 'string') {
                lang = languageSelector.isSupportedLanguage(window.navigator.language);
                if(lang != '') return lang;
            }
            
            // Try IE OS language
            if(typeof window.navigator.browserLanguage == 'string'){
                lang = languageSelector.isSupportedLanguage(window.navigator.browserLanguage);
                if(lang != '') return lang;
            }

            // Try IE User Language
            if(typeof window.navigator.userLanguage == 'string'){
                lang = languageSelector.isSupportedLanguage(window.navigator.userLanguage);
                if(lang != '') return lang;
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
    // Validate the language code to be ISO 639-1 compatible and return validated language code
    //
    
    validateISO6391: function(lang){
        var correctLangReg = /^[a-z]{2}|^zh[-]Han[st]/;
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
languageSelector.init();
