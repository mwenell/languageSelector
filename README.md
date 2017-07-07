# languageSelector
Language selector is a Javascript library which selects languages/translations on HTML pages by using :lang() selector or hreflang tag at head of DOM.
It is useful on multilanguage HTML pages which are using HTML lang property or hreflang in translations.

![Example Screenshot](https://raw.githubusercontent.com/mwenell/languageSelector/master/img/screenshot.png "Example Screenshot")

There are two ways to use it:
- Define hreflang tag and URL for each language version of the page at head of DOM (recommended)
- Inline HTML by using lang properties in HTML elements

# Test
Test the language selector:
- [hreflang example](https://kommentit.fi/language/example-hreflang-en.html "Example.html page") 
- [Inline HTML](https://kommentit.fi/language/example-inline-translations.html "Example-inline-translations.html page") 

# Features
- Insert one script tag and you have language support in your page
- Switchs between languages by clicking language images or by selecting language in drop-down list
- Create automatically flags of language select
- Selects automatically the language which user has preferred in browser his/her browser preferencies
- Supports both use of lang property in HTML inline translations and use of hreflang property in multifile translations (each language translation has own URL as e.g. example.com/en/xyz.html or example.com/xyz-en.html or en.example.com)
- No Javascript coding, HTML is all you need to manage
- Add "LANGUAGE" HTML tag in your page and define what languages you support
- Use as many languages as you wish, all major language flags are supported
- Limitations: When you are using this library, do not use :lang() selector in your CSS

# Known bugs
- Click on language flag image does not update the selected language in dropdown select element of language

# Example HTML Code
```
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="alternate" href="example-hreflang-en.html" hreflang="en">
    <link rel="alternate" href="example-hreflang-fi.html" hreflang="fi">
    
    <!-- Insert languageSelector CSS -->
    <link rel="stylesheet" href="language.css">
    
    <!-- CSS of this example page -->
    <link rel="stylesheet" href="example.css">

</head>
<body>
    <script id="language_script" data-debug="1" src="language.js"></script>

	<language class="languageFrameClick" data-type="flag">
	</language>

    <language class="languageFrameSelect" data-type="select">
	</language>

	<div class="textFrame">
        <p lang="en" class="placeHeadline">English Translation.</p>
    </div>

    <script>
        var testURL = "https://www.surveygizmo.com/s3/3374527/browser-support-test?version=" + languageSelector.version;
    </script>
    
    <div lang="en" class="textSupportTestFrame">
        <p class="placeHeadline">We need your help!</p>
        <p style="text-align: left;">Help us test how language selector works with your browser.</p>
        <ol style="text-align: left;">
            <li>test language selector in this page</li>
            <li>tell us if it worked or not</li>
            <li>see all test results in Google Sheet</li>
        </ol>
        <button onclick="location.href=testURL;">Report if the language selector works?</button>
    </div>
</body>
</html>
```

# Installation
- Create language folder in your your website
- Copy all files into the folder
- Add following tag in your HTML code as first child of body tag or inside head element:
```
<script 
   id="language_script" 
   data-languages="[LANGUAGE LIST]" 
   data-debug="[1|0]" 
   src="/language/language.js">
</script>
```
Where
- id = "language_script" must have value "language_script"
- data-languages = "[LANGUAGE LIST]" is a list of all supported languages separated by ",", e.g. data-languages="en,fi,sv". The first language is the default language of the page. Notice: You must have text version of all language depended elements for each languages
- data-debug = "[1|0]" will activate in debug mode logging to console, data-debug="1" will activate debug logging
- src = "/language/language.js" is the URL to the javascript library file. Notice: This library needs only this one language.js file to be included as first child of body tag. Do not add this line at the end of body or middle.

- Insert language.css in your head as follows:
```
<link rel="stylesheet" href="PATH_TO_LANGUGA_SELECTOR/language.css">
```

- Insert language selector tag as "LANGUAGE" HTML tag  (see later how) where you want to have it
- You have two options to do translations:
   - Translate your content in separate URLs and mark them with standard hreflang at head of each page's DOM
   - Translate your content by using "lang" attribute in your HTML code (see below how)

# Language Selector Tag
Language selector tag is the HTML element which user clicks or selects whe s/he wants to change the language. It can be an image of language flag, text or almost any kind of visual element.
The library supports following HTML elements:
- Clickable HTML tag: Any HTML tag/element which user can click, e.g. img, div or p. The tag must have the lang="en" attribute (ISO 639-1) to define which language it will select, e.g. english flag image has lang="en" and finnish flag image has lang="fi"
- SELECT tag: Normal select list of language options where the option value is always the language code as en|fi|sv (ISO 639-1).
- INPUT tag: Normal text input where user or javascript can write the language code as en|fi|sv (ISO 639-1).

Language selectors must be inside of LANGUAGE tag. The library finds all LANGUAGE tags automatically and expects that all HTML elements inside the tag are language selectors. See example code below.
```
	<language data-type="flag">
	</language>

    <language data-type="select">
	</language>
```
Where
- data-type = flag (flag images) | select (select element)

# Tranlations on Language Specific URLs (Use of hreflang at head of DOM)
Implement your translations in language specific URLs (html files) and mark in each HTML file what is the correct URL for it's tranlations in different languages. Remember to include the actual language and files own URL as well.

Use hreflang as in each of your HTML files to make translation linking to work correctly. See example below.
```
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="alternate" href="example-hreflang-en.html" hreflang="en">
    <link rel="alternate" href="example-hreflang-fi.html" hreflang="fi">
</head>
```
You may build the URL structure of your language translations in many ways, as for example:
- en.example.com, fi.example.com, sv.example.com ...
- example.com/en/, example.com/fi/, example.com/sv) ...
- example.com/index.html, example.com/index-fi.html, example.com/index-sv.html

The language selector will always go to the URL of the selected language.

# Inline Translations in the One Page (Use of Lang Property)
Use lang attribute in your HTML to mark different language translations in your HTML. See the example below and at example.html.
```
<p lang="en">This is english version of the text</p>
<p lang="fi">Tämä on suomenkielinen versio tekstistä</p>
<p lang="sv">Den här är svenska version om text</p>
```
You may use the lang attribute in any HTML tag like p, h1, h2, ol, li, div, img etc.

Notice: If you use lang property in html element, it will be showed only when the language is selected.

# How the Actual Language is Selected
1. Use the language the user has selected before, stored in localstorage
2. Use then language the user has selected as preferred languages in the browser, the first one which is supported on the page
3. Use the language of the browser, if supported on the page
4. Use the default language of the page (first language code in the script tag)
5. User clicks language selector and switch to new language

# How to design flag image and select elements
Use CSS to design flag images and select elements as you want. Use following CSS selector for flag images:
```
<style>
   language img {
      height: 100%;
      /* insert your design here */
   }
</style>
```
Use following CSS selector for select elements:
```
<style>
   language select {
      /* insert your design here */
   }
</style>
```

# How the Correct Translation is Showed or Hided in inline translations
The Javascript code generates as first child of head tag a "style" tag which includes CSS styles to show the selected language translations and hide unselected languages. Below is and example of the content of style tag. Do not insert this "style" tag into your HTML, Javascript creates it automatically.
```
<style>
   :not(LANGUAGE)>:lang(fi) {display: none}
   :not(LANGUAGE)>:lang(sv) {display: none}
</style>
<script 
   id="language_script" 
   data-languages="en,fi,sv" 
   data-debug="1" 
   src="/language/language.js">
</script>
```
This "style" will show english translation and hides both Finnish and Swedish translations.

# How to Get the Actual Language in Javascript
The language code of the selected language is in global variable: languageSelector.actualLanguage
See example how to use it:
```
<script>
switch(languageSelector.actualLanguage){
	case 'en':
		// Do something if English selected
		break;
	case 'fi':
	case 'sv':
		// Do something if Finnish or Swedish selected
		break;
	default:
		// Do something if no English, Finnish or Swedish selected
}
</script>
```

# Callback of Language Change
Whenever the language will be set or changed the library will call function languageChangeCallback(newLang, element) if the function exists.

function languageChangeCallback(newLang, element)

where

- newLang is the new language of the page
- element is the HTML element of language selector which did the language change

See the following example code to see how it works. Isert this code anywhere in your HTML code.

```
function languageChangeCallback(newLang, element){
   if(typeof newLang == 'string'){
      // newLang variable has now the language code (en,fi,sv) as value, do something with it
   }
   if(typeof element != 'undefined){
      // element is a HTML element which has been used to change the language, 
      // e.g. image flag or language select tag
      // Use it to do what ever you want
   }
}
```

# How to use languageSelector with server side code
Selected language is stored on clientside in cookie which name is "languageSelectorValue". Use it to create page content with correct language.

# Learn More
- Learn more about hreflang at W3C](https://www.w3.org/International/questions/qa-css-lang "W3C: Styling using language attributes")
- Learn more about styling with languases at [W3C](https://www.w3.org/International/questions/qa-css-lang "W3C: Styling using language attributes")
- Learn more about [:lang()](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang "Mozilla Developer Network: :lang") CSS selector
- HTML uses [HTML ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "W3C: HTML Language Code Reference") language codes
- [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "Wikipedia: List of ISO 639-1 codes") language codes
