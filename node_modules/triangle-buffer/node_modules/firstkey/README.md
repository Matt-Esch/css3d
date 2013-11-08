# firstKey [![Build Status][1]][2]

Returns the first key found on an object from a list of keys

## Example

        var obj = {
            word1: 'The',
            word2: 'quick',
            word5: 'jumped',
            word8: 'lazy'
        },
        
        key = firstKey(obj, 'word3', 'word5', 'word7');  // First key found is 'word5'


Pull the first property from a dom node that exists and reuse that property

 - Choosing the text property to use

        var div = document.createElement('div'),
            text = firstKey(div, 'textContent', 'innerText', 'innerHTML');
            
        div[text] = 'Let\'s use the best property for setting the text';
    
 - Identifying the vendor-specific property to use, so that you don't set them all needlessly
 
        var divElement = document.createElement('div'),
        
        transformProperty = firstKey(
            divElement.style,
            'transform',
            'webkitTransform',
            'MozTransform',
            'oTransform',
            'msTransform');

        transformOriginProperty = firstKey(
            divElement.style,
            'transformOrigin',
            'webkitTransformOrigin',
            'MozTransformOrigin',
            'oTransformOrigin',
            'msTransformOrigin');

## Installation

`npm install firstkey`

## Contributors

 - Matt-Esch

## MIT Licenced


  [1]: https://secure.travis-ci.org/Matt-Esch/firstKey.png
  [2]: http://travis-ci.org/Matt-Esch/firstKey
