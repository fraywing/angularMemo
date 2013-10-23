angularMemo
===========

http://www.angularmemo.com

###Requirements

1. jQuery
2. $sce service for icon HTML ("on" by default with Angular 1.2.x)

##How to Use:

1. Include the angular-memo.js file in your page.
2. Add "memo" to your main app module.
3. Choose and add the directive attribute to your button (see the **Directives** section), like:

```javascript
memo-top-right={OPTIONS}
```
From this point, you can add the ```options``` object via inline JSON, like:

```javascript
<button memo-top-left='{"ease" : "easeOutQuart","content" : "I say HEYY YEAH","title" : "Whats Going on?","width" : "600px", "attachment" : "#wrap"}')>
</button>
```
or in your controller, add a model to the scope:

```javascript
$scope.coolThang = {
    "ease" : "easeOutQuart",
    "content" : "Check me ouut",
    "title" : "Heck Yeaaah",
    "width" : "600px",
    "eventType" : "click",
    "theme" : "dark",
    "fadeOut" : 1000
    };
```
###Directives

angularMemo has been split into readable directives for explicit functionality.

```memo-right```

```memo-left```

```memo-top-right```

```memo-top-left```

```memo-bottom-right```

```memo-bottom-left```

```memo-web-notify```

##Options:

```ease``` **string** Ease type. ```easeOutSine``` and ```easeOutQuart``` currently supported

```content``` **string** Content of notification, can be html

```attach```  **string** jQuery selector for where to append the notification

```title```  **string** Title of notification, can be html

```eventType``` **string** Defaults to ```click```

```width``` **string** The width of the notification, 100% for full screen

```fadeOut``` **int** In milliseconds, If ```false```, notification requires user close.

```toggle``` **boolean** When you click the button again, does it go away, or redisplay?

```theme``` **string** Either ```dark``` or ```light``` at the moment

```icon``` **string** A url to an image. ONLY FOR THE WEB NOTIFICATION DIRECTIVE


####Notes:
   
   The web notification aspect isn't totally standardized. It works fine in FF and Chrome, though.

   Two memos can't occupy the same space.. and will overlap.. I would suggest using fadeOut if you are planning on doing that sort of thing.
   
   If you want a full screen memo, make ```width``` 100%.
   
   Beware of using certain event types. ```hover``` won't work for instance, and ```mousedown``` is buggy.
   
   ```icon``` is only used for the memo-web-notify directive
   
   html is allowed in both the title and the content


## License
This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).
