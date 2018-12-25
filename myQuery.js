/*!
 * myQuery JavaScript Library v1.0
 * https://github.com/ivusony/myQuery
 *
 *
 * Copyright Ivan Radulov

 * Date: 2018-12-20
 */

(function(global){

    //adding size method to Object prototype makind object iterable
    Object.prototype.size = function(){
        let counter = 0;
        for(let key in this){
            if(this.hasOwnProperty(key)){
                counter ++;
            }
        }
        return counter
    }

    //return methods
    function returnMethods(){
        const method = Object.create(HTMLCollection);
        //indexing methods
        method.eq = function(num){
                // console.log(this);
                const el = [this[num]];
                Object.setPrototypeOf(el, this);
                return el;
            }
        method.last = function(){
            return this.eq(this.size()-1)
        }
        
        //styling methods
        method.bg = function(color){
            //check if no color is provided or is not string
            if(!color || !typeof color==='string'){
                //if so, set it to transparent
                color = 'transparent'
            }
           for(let key of Object.keys(this)){
               this[key].style.background = color;
           }
        }
        method.delete = function(){
            this.css('display','none')
        }
        method.undelete = function(){
            this.css('display','block')
        }
        method.hide = function(){
            this.css('visibility', 'hidden')
        }
        method.unhide = function(){
            this.css('visibility', 'visible')
        }
        method.css = function(prop, value){
            for(let key of Object.keys(this)){
                this[key].style[prop]= value;
            }
        }
        //animations
        method.flash = function(freq){
            const el = {
                value   :   this,
                visible  :   true,
                freq    :   freq
            };
            //validate ease
            //if not provided or not a number
            if(!freq || !typeof freq==='Number'){
                //set to 1000
                el.freq = 1000
            };
            //animate
            function animator(freq){
                if(el.visible){
                    setTimeout(function(){
                        this.hide.call(el.value);
                        el.visible=false;
                        animator(el.freq);
                    }.bind(method), freq)
                }else{
                    setTimeout(function(){
                        this.unhide.call(el.value)
                        el.visible=true;
                        animator(el.freq);
                    }.bind(method), freq)
                }
            }
            animator.call(method, el.freq)
        }
        return method;
    }

    function nodeList(){
        const body = document.children[0].children[1].children;
        return body;
    }

    //selector criteria
    const matchSelector = (function(){
        return {
            TAG     : function(tagName){
                        const el = document.getElementsByTagName(tagName);
                        // console.log(el);
                        return el;
            },
            ID      : function(id){
                        const el = [document.getElementById(id)];
                        console.log(el.length);
                        if(el.length>1){return new Error('ID should be unique')}
                        // console.log(el);
                        return el;
            },
            CLASS   : function(className){
                        const el = document.getElementsByClassName(className);
                        // console.log(el);
                        return el;
            },
            NAME    : function(name){
                        const el = document.getElementsByName(name);
                        return el;
            }
        }
    })();

    //input sanitizer, determins the selector criteria
    function inputQuery(userQuery){

        if(!String.prototype.trim){
            // Make sure we trim BOM and NBSP
            const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            //adding trim to string prototype
            String.prototype.trim = function(){
                return this.replace(rtrim, '');
            }
        }
        
        const query = userQuery.trim();
        
        //finding element
        const elementMatched = (function(q){
            if(q[0]==='.'){
                return matchSelector.CLASS(q.slice(1, q.length))
            }else if(q[0]==='#'){
                return matchSelector.ID(q.slice(1, q.length));
            }else if(q[0]==='*'){
                return matchSelector.NAME(q.slice(1, q.length));
            }else{
                return matchSelector.TAG(q)
            }
        })(query); 
          
        if(!elementMatched){
            //if nothing found
            return new Error('No element found');
        }else{
            //returning element found
            return elementMatched
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

    global.myQuery = $ = myQuery;
    return myQuery;
})(window);