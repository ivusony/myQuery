(function(global){
 
    function methods(){
        const temp = Object.create(HTMLCollection);
        temp.bg = function(color){
           for(let key of Object.keys(this)){
               this[key].style.background = color;
           }
        };
        return temp;
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
                        return el;
            },
            ID      : function(id){
                        const el = document.getElementById(id);
                        return el;
            },
            CLASS   : function(className){
                        const el = document.getElementsByClassName(className);
                        return el;
            }
        }
    })();
        
    

    //input sanitizer, determins the selector criteria
    function inputQuery(userQuery){
       if(!String.prototype.trim){
        // Make sure we trim BOM and NBSP
        const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
           String.prototype.trim = function(){
            return this.replace(rtrim, '');
           }
       }

       const query = userQuery.trim();

       const elementMatched = (function(q){
            if(q[0]==='.'){
                return matchSelector.CLASS(q.slice(1, q.length))
            }else if(q[0]==='#'){
                return matchSelector.ID(q.slice(1, q.length))
            }else{
                return matchSelector.TAG(q)
            }
       })(query); 
          
       if(!elementMatched){
           return new Error('No element found');
       }else{
           return elementMatched
       }

       

    } 

    //get element
    function matchElement(query, fn){
        const selector = fn(); //the matchSelector function returning selector object
        const el = selector.ID(query);
        return el;
    }



    function factory(query){
        const el = inputQuery(query);
        Object.setPrototypeOf(el, methods());
       return el;
    }

    const myQuery = factory;

    global.myQuery = $ = myQuery;
    return myQuery;
})(window);