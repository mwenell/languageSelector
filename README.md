# languageSelector
Language selector is a Javascript library which selects languages/translations on HTML pages by using :lang() selector.
It is useful on multilanguage HTML pages which are using HTML lang property in translations.

# Features
- Switch between languages by clicking language images or by selecting language in drop-down list
- Insert one script tag and you have language support in your page
- No Javascript coding, HTML is enough
- Add language selectors switch with "LANGUAGE" HTML tag, e.g. one at top of the page and other in footer
- Use as many languages as you wish
- Tag different language translations in your text by using standard "lang" parameter in your HTML tags
- When you are using this library, do not use :lang() selector in CSS

# Known Bugs or Missing Features
- Not well tested yet, only Chrome 56.
- Does not create HTML code of language selector switch, must be done by yourself

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

- Insert language switch bar by using "LANGUAGE" tag  (see below how)
- Translate your content by using "lang" attribute in your HTML code (see below how)

# Language Selector Switch
Language selector switch is the HTML element which user clicks or selects whe s/he wants to change the language. It can be an image of language flag, text or almost any kind of visual element.
The library supports following HTML elements:
- Clickable HTML tag: Any HTML tag/element which user can click, e.g. img, div or p. The tag must have the lang="en" attribute (ISO 639-1) to define which language it will select, e.g. english flag image has lang="en" and finnish flag image has lang="fi"
- SELECT tag: Normal select list of language options where the option value is always the language code as en|fi|sv (ISO 639-1).
- INPUT tag: Normal text input where user or javascript can write the language code as en|fi|sv (ISO 639-1).

Language selectors must be inside of LANGUAGE tag. The library finds all LANGUAGE tags automatically and expects that all HTML elements inside the tag are language selectors. See example code below.
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

# How to Get Images of Language Flag
You can get png and svg images for most languages from [Google region-flags project](https://github.com/googlei18n/region-flags "Google region flag project"). Use them and design your own language UI.

# Translations
Use lang attribute in your HTML to mark different language translations in your HTML. See the example below and at example.html.
```
<p lang="en">This is english version of the text</p>
<p lang="fi">Tämä on suomenkielinen versio tekstistä</p>
<p lang="sv">Den här är svenska version om text</p>
```
You may use the lang attribute in any HTML tag like p, h1, h2, ol, li, div, img etc.

# How the language is selected
1. The language the user has selected before, stored in localstorage
2. Then language the user has selected as preferred languages in the browser, the first one which is supported on the page
3. The language of the browser, if supported on the page
4. The default language of the page (first language code in the script tag)
5. User clicks language selector and switch to new language

# How the Correct Translation is Showed or Hided

The Javascript code generates as first child of body tag a "style" tag which includes CSS styles to show the selected language translations and hide unselected languages. Below is and example of the content of style tag. Do not insert this "style" tag into your HTML, Javascript creates it automatically.
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
# Learn More
- Learn more about styling with languases at [W3C](https://www.w3.org/International/questions/qa-css-lang "W3C: Styling using language attributes")
- Learn more about [:lang()](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang "Mozilla Developer Network: :lang") CSS selector
- HTML uses [HTML ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "W3C: HTML Language Code Reference") language codes
- [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "Wikipedia: List of ISO 639-1 codes") language codes
