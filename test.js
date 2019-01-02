// ;(function(global){
//     //DRAG AND DROP USING BUILT-IN API

//     var columns = document.getElementsByClassName('applicant-column');
//     var containers = document.getElementsByClassName('applicant-container');
//     var dragged;

//         //setting every element to draggable
//         for (let i = 0; i < containers.size(); i++) {
//             containers[i].draggable = true
//         }

//         document.addEventListener('dragover', function(e){
//             e.preventDefault();
            
            
//         })
//         document.addEventListener('dragstart', function(e){
//             e.dataTransfer.setData('text/plain', 'dummy');
//             dragged = e.target;

//             dragged.className += ' dragged'
//             dragged.style.opacity = 0.5;
//             // console.log(dragged);
//         })
    

//     document.addEventListener('drop', function(e){
//         e.preventDefault();
//         if(e.target.className === "applicant-container"){
//             dragged.parentNode.removeChild( dragged );
//             e.target.parentNode.appendChild( dragged); 
//             dragged.className += ' puff-in-center';
//         }
        
//         if(e.target.className === "col-container"){
//             dragged.parentNode.removeChild( dragged );
//             e.target.appendChild( dragged );        
//             dragged.className += ' puff-in-center';
//             console.log(dragged.className);
//         }
//         dragged.style.opacity = 1;
//     }, false)


//     document.addEventListener('dragend', function(e){
//         //removing the dragged class
//         dragged.className = dragged.className.replace(' dragged', '');
        

//         setTimeout(function(){
//             dragged.className = dragged.className.replace(' puff-in-center', '');
//         }, 200)
//     })
   
  
// })(window);


;(function(global){
    var columns = document.getElementById('columns'),
        columnsContainerDimensions = columns.getBoundingClientRect();

    var containers = document.getElementsByClassName('col-container');
    var dragged;

    var isDown = false,
        offset = [0,0],
        mousePos = {},
        z=1,
        containerBounds = getContainerBounds(containers);


    document.addEventListener('mousedown', function(e){
        if(e.target.className == 'applicant-container'){
            e.preventDefault();
            isDown = true;
            dragged = e.target;
            dragged.style.zIndex = z;
            offset = [
                dragged.offsetLeft - e.clientX,
                dragged.offsetTop - e.clientY
            ];
            z++;
        }
    })

    document.addEventListener('mouseup', function(e){
        isDown = false;
        if(!mousePos)return;
        if(!dragged)return;

        for (let i = 0; i < containerBounds.size(); i++) {
           
            const dropzone = getDropzone(i);
            
            if(dropzone != undefined){
                // console.log(dropzone);
                var dz = document.getElementById(dropzone);
                // console.log(dz);
                dragged.parentNode.removeChild(dragged);
                dz.appendChild(dragged)
                dragged.style.position = 'relative';
                dragged.style.left = '';
                dragged.style.top = '';
            }else{
                dragged.style.position = 'relative';
                dragged.style.left = '';
                dragged.style.top = '';
            }
        }
    })
    document.addEventListener('mousemove', function(e){
        e.preventDefault();
        
        if(isDown){
            mousePos = {
                x:e.clientX,
                y:e.clientY
            }
            dragged.style.position  = 'absolute';
            dragged.style.left = (mousePos.x + offset[0])+'px';
            dragged.style.top = (mousePos.y + offset[1])+'px';
        }
        
    })

    function getDropzone (i){
        if(mousePos.x > containerBounds[i].x && mousePos.x < containerBounds[i].x_end){
            if(mousePos.y > containerBounds[i].y && mousePos.y < containerBounds[i].y_end){
                return containerBounds[i].id;
            }
        }
    }

    function getElementBound(element){
        let pos = element.getBoundingClientRect();
        let rect = {
            x:pos.left,
            x_end:pos.left+pos.width,
            y:pos.top,
            y_end:pos.top+pos.height,
            id: element.id
        }
        return rect;
    }

    function getContainerBounds(containers){
        let obj = {};
        for (let i = 0; i < containers.size(); i++) {
            obj[i] = getElementBound(containers[i]);
        }
        return obj;
    }

    window.addEventListener('resize', function(e){
        containerBounds = getContainerBounds(containers);
    })
    
})(window);