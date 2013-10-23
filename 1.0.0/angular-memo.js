/*
 Angular Memo - The Angular.js Notification Genie
 
 Author : Austin Anderson
 License : MIT
 
 Possible Options:
 
  scope.memoOpts = {
    "ease" : "easeOutQuart",
    "content" : "Check me ouut",
    "title" : "ye sy es",
    "eventType" : "hover",
    "width" : "600px",
    "fadeOut" : 2300,
    "toggle" : true,
    "theme" : "light",
    "icon" : "http://image.com/img.png"
    }
    
  memo-top-right='memoOpts'
  
  or as JSON in the directive :
  
  memo-top-right='{"ease" : "easeOutQuart","content" : "Hey there fella!","title" : "Top right is great","width" : "300px", "attachment" : "#wrap"}'
  
  Classes for styling:
  
  |memo-outer
    |memo-shell
      |memo-title
      |memo-x
      |memo-content
   
   Notes:
   
   The web notification aspect isn't totally standardized. It works fine in FF and Chrome, though.

   Two memos can't occupy the same space.. and will overlap.. I would suggest using fadeOut if you are planning on doing that sort of thing.
   
   If you want a full screen memo, make "width" 100%.
   
   Beware of using certain event types. "hover" won't work for instance, and "mousedown" is buggy.
   
   icon is only used for the memo-web-notify directive
   
   html is allowed in both the title and the content
    
*/
var Memo = angular.module('memo', []);

//the actually notification directive. It has a slideIn and slideOut function for each directive type
Memo.directive("memoSlideHandle", function ($timeout) {
    var slides = {
        slideIn: {
            memoRight: function (scope) {
                $timeout(function () {

                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.right = "0px";
                }, 100);
            },
            memoLeft: function (scope) {
                $timeout(function () {
                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.left = "0px";
                }, 100);
            },
            memoTopRight: function (scope) {
                scope.theme.memoOuter.top = ~scope.height + "px";
                $timeout(function () {
                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.right = "0px";
                    scope.theme.memoOuter.top = "0px";
                }, 100);
            },
            memoTopLeft: function (scope) {
                scope.theme.memoOuter.top = ~scope.height + "px";
                $timeout(function () {
                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.left = "0px";
                    scope.theme.memoOuter.top = "0px";
                }, 100);
            },
            memoBottomLeft: function (scope) {
                scope.theme.memoOuter.bottom = ~scope.height + "px";
                $timeout(function () {
                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.left = "0px";
                    scope.theme.memoOuter.bottom = "0px";
                }, 100);
            },
            memoBottomRight: function (scope) {
                scope.theme.memoOuter.bottom = ~scope.height + "px";
                $timeout(function () {
                    scope.theme.memoOuter.opacity = "1";
                    scope.theme.memoOuter.right = "0px";
                    scope.theme.memoOuter.bottom = "0px";
                }, 100);
            },
            memoWebNotify: function (scope) {
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission(function (status) {
                        if (Notification.permission !== status) {
                            Notification.permission = status;
                        }
                    });
                }
                if ( !! !Notification || Notification.permission == "denied") {
                    scope.theme.memoOuter.top = ~scope.height + "px";
                    $timeout(function () {
                        scope.theme.memoOuter.opacity = "1";
                        scope.theme.memoOuter.right = "0px";
                        scope.theme.memoOuter.top = "0px";
                    }, 100);
                }
            }
        },
        slideOut: {
            memoRight: function (scope) {
                var self = this;
                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    scope.theme.memoOuter.right = ~scope.width.replace("px", "") + "px";
                }, 300);

            },
            memoLeft: function (scope) {
                var self = this;

                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    self.remove();
                    scope.theme.memoOuter.left = ~scope.width.replace("px", "") + "px";
                }, 300);

            },
            memoTopRight: function (scope) {
                var self = this;

                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    self.remove();
                    scope.theme.memoOuter.top = ~scope.height + "px";
                }, 300);

            },
            memoTopLeft: function (scope) {
                var self = this;

                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    self.remove();
                    scope.theme.memoOuter.top = ~scope.height + "px";
                }, 300);

            },
            memoBottomLeft: function (scope) {
                var self = this;

                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    self.remove();
                    scope.theme.memoOuter.bottom = ~scope.height + "px";
                }, 300);

            },
            memoBottomRight: function (scope) {
                var self = this;

                scope.theme.memoOuter.opacity = "0";
                $timeout(function () {
                    self.remove();
                    scope.theme.memoOuter.bottom = ~scope.height + "px";
                }, 300);

            },
            memoWebNotify: function (scope) {
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission(function (status) {
                        if (Notification.permission !== status) {
                            Notification.permission = status;
                        }
                    });
                }
                if ( !! !Notification || Notification.permission == "denied") {
                    var self = this;

                    scope.theme.memoOuter.opacity = "0";
                    $timeout(function () {
                        self.remove();
                        scope.theme.memoOuter.top = ~scope.height + "px";
                    }, 300);
                }
            }
        }

    };
    return {
        scope: false,
        link: function (scope, el, attr) {
            var type = scope.bindingName;

            //web notify is good, procede with launch...            
            if (Notification && type == "memoWebNotify" && Notification.permission != "denied") {
                new Notification(scope.title,{body : scope.content, icon : scope.icon});
            }
            //wait until the height is ready for the top and bottom notifications                     
            scope.$watch("height", function (val, old) {
                //sort of crappy, checking the opacity to determine slideOut or slideIn
                if ($("." + scope.cssName).css('opacity') == 1) {
                    slides.slideOut[type].call(el, scope);
                    if (!scope.toggle) {
                        $timeout(function () {
                            slides.slideIn[type].call(el, scope);
                            if (scope.fadeOut) {
                                $timeout(function () {
                                    slides.slideOut[type].call(el, scope);
                                }, scope.fadeOut);
                            }
                        }, 300);
                    }
                } else {
                    slides.slideIn[type].call(el, scope);
                    if (scope.fadeOut) {
                        $timeout(function () {
                            slides.slideOut[type].call(el, scope);
                        }, scope.fadeOut);
                    }
                }

            }, true);


            $(el).find('.memo-x').click(function () {
                scope.$apply(slides.slideOut[type].call(el, scope));

            });
        }
    }
});

//memoCommon is a sort of extended from class for the rest of the directives
Memo.service("memoCommon", function ($q, $compile, $timeout, $sce) {
    return {
        template: "<div class='memo-outer {{cssName}}' ng-style='theme.memoOuter' memo-slide-handle>\
                            <div class='memo-shell' ng-style='theme.memoShell'>\
                            <div class='memo-title'  ng-style='theme.memoTitle'  ng-bind-html='title'></div>\
                             <div class='memo-x'  ng-style='theme.memoX'>X</div>\
                              <div class='memo-content' ng-style='theme.memoContent' ng-bind-html='content'>\
                             </div>\
                             </div>\
                             </div>",
        eases: {
            easeOutSine: "all 200ms cubic-bezier(0.39, 0.575, 0.565, 1)",
            easeOutQuart: "all 600ms cubic-bezier(0.165, 0.84, 0.44, 1)",
            easeOutQuart: "all 600ms cubic-bezier(0.39, 0.575, 0.565, 1))"
            //add more eases
        },
        //uses obj.call to bind the this of the element about to get bound
        bind: function (handler, cb) {
            return $(this).on(handler, cb);
        },
        updateCont: function (content, cssName) {
            $('.' + cssName).find('.memo-content').html(content);
        },
        //updates the head manually every $watch
        updateHead: function (content, cssName) {
            $('.' + cssName).find('.memo-title').html(content);
        },
        //the defaults for each link function for the directives
        setDefaults: function (ob, scope, cb) {
            var self = this;
            scope.width = !! !ob.width ? "400px" : ob.width;
            scope.template = this.template;
            scope.original = ob;

            scope.fadeOut = !! !ob.fadeOut ? false : ob.fadeOut;
            scope.attachment = !! !ob.attachment ? "body" : ob.attachment;
            scope.toggle = !! !ob.toggle ? false : ob.toggle;
            scope.handler = !! !ob.eventType ? "click" : ob.eventType;
            scope.ease = !! !ob.ease ? "slide" : ob.ease;

            scope.icon = !! !ob.icon ? "" : ob.icon;
            
            scope.customTheme.memoOuter["-moz-transition"] = this.eases.easeOutSine;
            scope.customTheme.memoOuter["-webkit-transition"] = this.eases.easeOutSine;
            scope.customTheme.memoOuter["transition"] = this.eases.easeOutSine;
            cb();
            var cont = !! !scope.$parent[ob.content.replace(/ /g, '')] ? "content" : ob.content,
                head = !! !scope.$parent[ob.title.replace(/ /g, '')] ? "title" : ob.title;

            scope.$parent.$watch(cont, function (val) {
                self.updateCont(val, scope.cssName);
            }, true);
            scope.$parent.$watch(head, function (val) {
                self.updateHead(val, scope.cssName);
            }, true);

            scope.theme = !! !ob.theme ? $.extend(true, this.themes.light(), scope.customTheme) : $.extend(true, this.themes[ob.theme](), scope.customTheme);

        },
        //builds the template and compiles it
        build: function (scope, template) {
            var def = $q.defer();
            scope.$apply(function () {
                scope.compiled = $compile(template)(scope);
                def.resolve(scope);
            });
            return def.promise;
        },
        //removes a memo
        remove: function () {

        },
        //conditionally adds the new notification to the DOM
        add: function (payload) {
            payload.then(function (scope) {
                if ($('.' + scope.cssName).length != 0) {

                } else {
                    var newEl = $(scope.compiled);
                    $(scope.attachment).prepend(newEl);
                }
                $timeout(function () {
                    scope.height = $('.' + scope.cssName).height();
                }, 20);

            });
        },
        //gets the config object per directive
        getConfig: function (scope, attr, name) {
            var def = $q.defer();
            if (attr[name][0] == "{") {
                attr.$observe(name, function (val) {
                    if (angular.isDefined(val)) {
                        def.resolve(angular.fromJson(val));
                    }
                }, true);
            } else {
                if (angular.isDefined(scope.$parent[attr[name]])) {
                    def.resolve(scope.$parent[attr[name]]);
                } else {
                    console.log("No Model/Json Config Object Found!");
                    return;
                }
            }

            return def.promise;
        },
        //themes are used by ng-style per notification
        themes: {
            "dark": function () {
                return {
                    memoOuter: {
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "position": "fixed",
                        "opacity": "0",
                        "color": "#353535",
                        "-moz-transition": "0.2s ease all",
                        "-webkit-transition": "0.2s ease all",
                        "transition": "0.2s ease all",
                        "text-shadow": "0 -1px 0 rgba(2,2,2,0.45)",
                        "box-shadow": "0 0 3px 0 rgba(2,2,2,0.3)",
                        "border": "0 solid rgba(255,255,255,1)",
                        "z-index": 999,
                        "background": "rgba(2,2,2,0.1)"
                    },
                    memoShell: {
                        "border": "1px solid rgba(255,255,255,0.3)",
                        "border-radius": "4px",
                        "padding": "3px",
                        "position": "relative"
                    },
                    memoContent: {
                        "padding": "9px",
                        "background": "#676767",
                        "font-size": "1.1em",
                        "box-shadow": "0 1px 0 0 rgba(155, 155, 155, 0.2) inset",
                        "color": "#EDEDED"
                    },
                    memoTitle: {
                        "padding": "0.2em",
                        "font-size": "1.3em",
                        "padding-left": "9px",
                        "font-weight": "bold",
                        "position": "relative",
                        "box-shadow": "inset  0 -1px 0 0 rgba(5, 5, 5, 0.3)  ",
                        "color": "#DADADA",
                        "background": "#545454",
                        "padding-bottom": "7px"
                    },
                    memoX: {
                        "position": "absolute",
                        "right": "0px",
                        "top": "0px",
                        "padding": "5px",
                        "color": "#3F3F3F",
                        "padding-right": "10px",
                        "cursor": "pointer"
                    }
                };

            },
            "light": function () {
                return {
                    memoOuter: {
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "position": "fixed",
                        "opacity": "0",
                        "color": "#353535",
                        "-moz-transition": "0.2s ease all",
                        "-webkit-transition": "0.2s ease all",
                        "transition": "0.2s ease all",
                        "text-shadow": "0 1px 0 rgba(255,255,255,0.95)",
                        "box-shadow": "0 0 3px 0 rgba(2,2,2,0.3)",
                        "border": "0 solid rgba(255,255,255,1)",
                        "z-index": 999
                    },
                    memoShell: {
                        "border": "1px solid rgba(255,255,255,0.3)",
                        "border-radius": "4px",
                        "padding": "3px",
                        "position": "relative"
                    },
                    memoContent: {
                        "padding": "9px",
                        "background": "#FCFCFC",
                        "font-size": "1.1em",
                        "color": "#666666"
                    },
                    memoTitle: {
                        "padding": "0.2em",
                        "font-size": "1.3em",
                        "padding-left": "9px",
                        "font-weight": "bold",
                        "position": "relative",
                        "box-shadow": "0 1px 0 0px rgba(2, 2, 2, 0.1)",
                        "color": "#3D3D3D",
                        "background": "#F7F7F7",
                        "padding-bottom": "7px"
                    },
                    memoX: {
                        "position": "absolute",
                        "right": "0px",
                        "top": "0px",
                        "padding": "5px",
                        "padding-right": "10px",
                        "cursor": "pointer"
                    }
                };

            }

        }
    }
});

Memo.directive("memoRight", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoRight"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoRight";
            scope.cssName = "memo-right";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoRight").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.right = ~scope.width.split('px')[0] + "px";
                    scope.customTheme.memoOuter.width = scope.width;

                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});
Memo.directive("memoLeft", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoLeft"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoLeft";
            scope.cssName = "memo-left";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoLeft").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.left = ~scope.width.split('px')[0] + "px";
                    scope.customTheme.memoOuter.width = scope.width;



                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});

Memo.directive("memoTopRight", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoTopRight"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoTopRight";
            scope.cssName = "memo-top-right";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoTopRight").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.right = "0px";
                    scope.customTheme.memoOuter.width = scope.width;

                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});

Memo.directive("memoTopLeft", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoTopLeft"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoTopLeft";
            scope.cssName = "memo-top-left";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoTopLeft").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.left = "0px";
                    scope.customTheme.memoOuter.width = scope.width;


                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});
Memo.directive("memoBottomLeft", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoBottomLeft"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoBottomLeft";
            scope.cssName = "memo-bottom-left";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoBottomLeft").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.left = "0px";
                    scope.customTheme.memoOuter.bottom = "0px";
                    scope.customTheme.memoOuter.width = scope.width;


                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});
Memo.directive("memoBottomRight", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoBottomLeft"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoBottomRight";
            scope.cssName = "memo-bottom-right";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoBottomRight").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.right = "0px";
                    scope.customTheme.memoOuter.bottom = "0px";
                    scope.customTheme.memoOuter.width = scope.width;


                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});

Memo.directive("memoWebNotify", function (memoCommon, $sce) {
    var methods = {

    };
    return {
        scope: {
            memoRight: "@memoWebNotify"
        },
        controller: function ($scope, $element, $attrs) {

            $scope.customTheme = {
                memoOuter: {
                    "opacity": 0
                },
                memoShell: {

                },
                memoContent: {

                },
                memoTitle: {

                },
                memoX: {}
            };
        },
        link: function (scope, el, attr, cont) {

            scope.bindingName = "memoWebNotify";
            scope.cssName = "memo-web-notify";

            var gotConfig = memoCommon.getConfig(scope, attr, "memoWebNotify").
            then(function (ob) {
                memoCommon.setDefaults(ob, scope, function () {
                    scope.customTheme.memoOuter.right = "0px";
                    scope.customTheme.memoOuter.width = scope.width;

                    var evented = memoCommon.bind.call(el, scope.handler, function () {
                        scope.title = !! !scope.$parent[ob.title] ? $sce.trustAsHtml(ob.title) : $sce.trustAsHtml(scope.$parent[ob.title]);
                        scope.content = !! !scope.$parent[ob.content] ? $sce.trustAsHtml(ob.content) : $sce.trustAsHtml(scope.$parent[ob.content]);

                        scope.$apply(memoCommon.add(memoCommon.build.call(el, scope, scope.template)));
                    });
                });
            });
        }
    }
});

Memo.directive("memoLocale", function (memoCommon) {
    var methods = {

    };
    return {

        scope: "=",
        controller: function ($scope, $element, $attrs) {

        },
        link: function (scope, el, attr) {


        }
    }
});