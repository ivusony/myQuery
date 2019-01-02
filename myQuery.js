/*!
 * myQuery JavaScript Library v1.0
 * https://github.com/ivusony/myQuery
 *
 *
 * Copyright Ivan Radulov

 * Date: 2018-12-20
 */
"use strict";

(function(global){

    //adding size method to Object prototype makind object iterable
    Object.prototype.size = function(){
        var counter = 0;
        for(let key in this){
            if(this.hasOwnProperty(key)){
                counter ++;
            }
        }
        return counter;
    };

    //return methods
    function returnMethods(){
        const method = Object.create(HTMLCollection);
        //indexing methods
        method.eq = function(num){
                // console.log(this);
                const el = [this[num]];
                Object.setPrototypeOf(el, this);
                return el;
            };
        method.last = function(){
            return this.eq(this.size()-1);
        };
        
        //styling methods
        method.bg = function(color){
            //check if no color is provided or is not string
            if(!color || typeof color!='string'){
                //if so, set it to transparent
                color = 'transparent';
            }
        //    for(const key in Object.keys(this)){
        //        console.log(this);
        //        this[key].style.background = color
        //    }
            this.forEach(el=>{
                el.style.background = color;
            });
        };
        method.delete = function(){
            this.css('display','none');
        };
        method.undelete = function(){
            this.css('display','block');
        };
        method.hide = function(){
            this.css('visibility', 'hidden');
        };
        method.unhide = function(){
            this.css('visibility', 'visible');
        };
        method.css = function(prop, value){
            for(let key of Object.keys(this)){
                this[key].style[prop]= value;
            }
        };
        //animations
        method.flash = function(freq){
            const el = {
                value   :   this,
                visible  :   true,
                freq    :   freq
            };
            //validate ease
            //if not provided or not a number
            if(!freq || typeof freq!='number'){
                //set to 1000
                el.freq = 1000;
            }
            //animate
            function animator(freq){
                if(el.visible){
                    setTimeout(function(){
                        this.hide.call(el.value);
                        el.visible=false;
                        animator(el.freq);
                    }.bind(method), freq);
                }else{
                    setTimeout(function(){
                        this.unhide.call(el.value);
                        el.visible=true;
                        animator(el.freq);
                    }.bind(method), freq);
                }
            }
            animator.call(method, el.freq);
        };

        //event handler
        method.on = function(event, cb){
            //event converter
            function e(ev){
                const events = {
                    click   : 'click',
                    hover   : 'mouseover'
                };
                return events[ev];
            }
            //handling
            if(typeof cb != 'function' && typeof cb != 'object' && cb.constructor != Array){return}
            //this method accepts a single callback as well as an array of functions
            const eventsCallbacks = returnEvents();
            //if array
            if(typeof cb != 'function'){
                cb.forEach(fn=>{
                    eventsCallbacks.push(fn);
                });
            }else{
                //else if single cb
                eventsCallbacks.push(cb);
            }
            
            //For browsers that do not support Element.matches() or Element.matchesSelector()
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
            }
            const el = this;
            console.log(el);
            document.addEventListener(e(event), function(e){
                const selection = [];
             
                for(let i = 0; i< el.size(); i++){
                    selection.push(el[i]);
                }
                const target = e.target.outerHTML;

                selection.forEach(element => {
                    if(element.outerHTML===target){
                        eventsCallbacks.forEach(fn=>{
                            fn();
                        });
                    }
                });
                
            }.bind(this));
        };
        method.drag = function(){
            const elm = this;
            var z  = 1;
            elm.forEach(el=>{
                var mousePos={};
                var offset = [0,0];
                var isDown = false;

                    el.addEventListener('mousedown', function(e){
                        el.style.position = 'absolute';
                        this.style.zIndex = z;
                        // current.style.zIndex = 10
                        isDown = true;
                            offset = [
                                el.offsetLeft - e.clientX,
                                el.offsetTop - e.clientY
                            ];
                            z++;
                    }, true);
                    document.addEventListener('mouseup', function(e){
                        isDown = false;
                     }, true)
                
                    document.addEventListener('mousemove', function(e){
                       
                        e.preventDefault();
                        if(isDown){
                           mousePos = {
                                x:e.clientX,
                                y:e.clientY
                            }
                        };
                        el.style.left = (mousePos.x + offset[0])+'px';
                        el.style.top = (mousePos.y + offset[1])+'px';

                        
                    }, true)
            }) //end of foreach
           return this;
        },
        method.insert = function(element, attributes){
            if(!attributes || typeof attributes != 'object'){
                attributes = {
                    class       : '',
                    id          : '',
                    disabled    : false
                }
            }
            function createEl(el){
                var elm = document.createElement(el);
                elm.className = attributes.class;
                elm.id  = attributes.id;
                return elm;
            }
            const elm = createEl(element);
           
                 this[0].appendChild(elm);
                return elm;
                
        },
        method.addClass = function(className){
            this.forEach(el=>{
                el.className += ' ' + className
            })
            return this;
        },
        method.removeClass = function(className){
            this.forEach(el=>{
                let currentClasses = el.className;
                let newClasses = currentClasses.replace(className, '');
                el.className = newClasses;
            })
            return this;
        }

        Object.setPrototypeOf(method, returnEvents());
        return method;
    }
    //end of returnMethods()

    function returnEvents(){
        return [];
    }

    function nodeList(){
        const body = document.children[0].children[1].children;
        return body;
    }

    //selector function. Gets the selected elements, pushes them into array and returns the array
    const matchSelector = (function(){
        //htmlcollection object to array object convertor
        function html2Arr(htmlcollection){
            const newArray = [];
            //using for instead of for..in. For..in iterates through obj prototype
            for(let i = 0; i< htmlcollection.size(); i++){
                newArray.push(htmlcollection[i]);
            }
            return newArray;
        };
        //returning element or collection of elements in array, based od input
        return {
            TAG     : function(tagName){
                        const el = document.getElementsByTagName(tagName);
                        // console.log(el);
                        const ElementsArray = html2Arr(el);
                        return ElementsArray;
            },
            ID      : function(id){
                        const el = [document.getElementById(id)];
                        if(el.length>1){return new Error('ID should be unique')};
                        // console.log(el);
                        return el;
            },
            CLASS   : function(className){
                        const el = document.getElementsByClassName(className);
                        //returning array obj instead of htmlcollection object
                        const ElementsArray = html2Arr(el);
                        return ElementsArray;
            },
            NAME    : function(name){
                        const el = document.getElementsByName(name);
                        return el;
            }
        };
    })();

    //input sanitizer, determins the selector criteria
    function inputQuery(userQuery){
        if(!userQuery){return inputQuery}
        //if no trim method exists
        if(!String.prototype.trim){
            // Make sure we trim BOM and NBSP
            const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            //adding trim to string prototype
            String.prototype.trim = function(){
                return this.replace(rtrim, '');
            };
        }
        
        const query = userQuery.trim();
        
        //finding element using match element function
        const elementMatched = (function(q){
            if(q[0]==='.'){
                return matchSelector.CLASS(q.slice(1, q.length));
            }else if(q[0]==='#'){
                return matchSelector.ID(q.slice(1, q.length));
            }else if(q[0]==='*'){
                return matchSelector.NAME(q.slice(1, q.length));
            }else{
                return matchSelector.TAG(q);
            }
        })(query); 
          
        if(!elementMatched){
            //if nothing found
            return new Error('No element found');
        }else{
            //returning element found
            return elementMatched;
        }
    } 

    // //get element
    // function matchElement(query, fn){
    //     const selector = fn(); //the matchSelector function returning selector object
    //     const el = selector.ID(query);
    //     return el;
    // }



    function factory(query){
        const el = inputQuery(query);
        Object.setPrototypeOf(el, returnMethods());
       return el;
    }

    const myQuery = factory;

    global.myQuery = global.$ = myQuery;
    return myQuery;
})(window);