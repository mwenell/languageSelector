# languageSelector
Language selector is a Javascript library which selects languages on HTML pages by using :lang() selector.

# Features
- Switch between languages by clicking language images or by selecting language in drop-down list
- Insert one script tag and you have language support in your page
- No Javascript coding, HTML is enough
- Add language selectors with "LANGUAGE" HTML tag, e.g. one at top of the page and other in footer
- Use as many languages as you wish
- Tag different languages in your text by using standard "lang" parameter in your HTML tags
- When you are using this library, do not use :lang() selector in CSS

# Known Bugs or Missing Features
- Chinese (Simplified) zh-Hans and Chinese (Traditional) zh-Hant -> Chinese zh
- Not well tested yet, only Chrome 56.
- No update when HTML of language selectors is dynamically changed. Content can be changed dynamically and it works ok.
- No ready made language flags for all languages yet, does anybody have rights to free language flags which could be used here?
- Does not select the default language always correctly

# Installation
- Insert language.js into "language" folder in your website
- Add following tag in your HTML code as first child of body tag:
```
<script 
   id="language_script" 
   data-languages="[LANGUAGE LIST]" 
   data-debug="[1|0]" 
   src="/language/language.js">
</script>
```
Where
- id="language_script" must be defined and the value must be "language_script"
- data-languages="[LANGUAGE LIST]" is a list of all supported languages separated by ",", e.g. data-languages="en,fi,sv". The first language is the default language of the page. Notice: You must have text version of all language depended elements for each languages
- data-debug="[1|0]" will activate in debug mode logging to console, data-debug="1" will activate debug logging
- src="/language/language.js" is the URL to the javascript library file. Notice: This library needs only this one language.js file to be included as first child of body tag. Do not add this line at the end of body or middle.

- Insert language selectors (see below how)
- Translate your content by using "lang" attribute in your HTML code (see below how)

# What Language the User Will See
1. The language the user has selected before, stored in localstorage
2. Then language the user has selected as first preferred language in the browser, if supported on page
3. The language of the browser, if supported on page
4. The default language of the page

# Language Selectors
Language selector is the HTML element which user clicks or selects to change the language. It can be an image of language flag, text or almost any kind of visual element.
The library supports following language elements:
- Clickable HTML tag: Any HTML tag/element which user can click, e.g. img, div or p. The tag must have the lang="en" attribute (ISO 639-1) to define which language the selector will switch on, e.g. english flag image has lang="en" and finnish flag image has lang="fi"
- SELECT tag: Normal select list of language options where the option value is always the language code as en|fi|sv (ISO 639-1).
- INPUT tag: Normal text input where user or javascript can write the language code as en|fi|sv (ISO 639-1).

Language selectors must be inside of LANGUAGE tag. The library find all LANGUAGE tags and expect that all elements inside the tag are language selectors. See example code below.
```
	<language class="languageFrameClick">
		<img lang="fi" class="langFlag" id="fi" src="img/fi.png">
		<img lang="en" class="langFlag" id="en" src="img/en.png">
	</language>

    <language class="languageFrameSelect">
        <select>
            <option value="">Language/Kieli/Språk</option>
            <option value="en">English</option>fi>
            <option value="fi">Suomi/Finnish</option>fi>
        </select>
	</language>

    <language class="languageFrameInput">
        <input placeholder="en or fi">
	</language>
```

# Language Versions of Text
Use lang attribute in your HTML to mark different language versions in your HTML. See the example below and example.html HTML file to see how it works.
```
<p lang="en">This is english version of the text</p>
<p lang="fi">Tämä on suomenkielinen versio tekstistä</p>
<p lang="sv">Den här är svenska version om text</p>
```
You may use the lang attribute in any HTML tag like p, h1, h2, ol, li, div, img etc.

# How the Correct Lang is Displayed

The Javascript code generates as first child of body tag "style" tag which includes CSS styles to show the selected language and hide unselected ones. Below is and example of the content of style tag. Do not insert this into your HTML, the Javascript creates it automatically.
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
This "style" will show english language and hides both Finnish and Swedish languages.

# Language Change Callback
Whenever the language will be set or changed the library will call right after the new language is set function languageChangeCallback(newLang, element) if the function exists.

function languageChangeCallback(newLang, element)

where

- newLang is the new language of the page
- element is the HTML element of language selector which did the language change

See the following example code to see how it works. Isert this code anywhere in your HTML code.

```
function languageChangeCallback(newLang, element){
   if(typeof newLang == 'string'){
      // newLang variable has now the language code (en,fi,sv) as value, do somthing with it
   }
   if(typeof element != 'undefined){
      // element is a HTML element which has been used to change the language, 
      // e.g. image flag or language select tag
      // Use it to do what ever you want
   }
}
```
# Learn More
- Learn more about styling with languases at [W3C](https://www.w3.org/International/questions/qa-css-lang "W3C: Styling using language attributes")
- Learn more about [:lang()](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang "Mozilla Developer Network: :lang") CSS selector
- HTML uses [HTML ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "W3C: HTML Language Code Reference") language codes
- [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "Wikipedia: List of ISO 639-1 codes") language codes

