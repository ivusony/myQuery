;(function(global){
    // $('.applicant-container').drag()



    var columns = document.getElementsByClassName('applicant-column');
    var containers = document.getElementsByClassName('applicant-container');
    var dragged;

    for(let i=0; i<columns.size(); i++){
        columns[i].addEventListener('dragover', function(e){
            e.preventDefault();
            // console.log(columns[i].id);
            
        })
    }
    for(let i=0;i<containers.size();i++){
        containers[i].addEventListener('dragstart', function(e){
            e.dataTransfer.setData('text/plain', 'dummy');
            
            dragged = e.target;

            dragged.className += ' dragged'
            dragged.style.opacity = 0.5;
            // console.log(dragged);
        })
    }
    for(let i=0;i<containers.size();i++){
        document.addEventListener('dragend', function(e){
            // console.log(e.target);
            let currentClasses = dragged.className;
        // console.log(currentClasses);
        let newClasses = currentClasses.replace(' dragged', '');
        dragged.className = newClasses += ' puff-in-center';
        })
    }
    document.addEventListener('drop', function(e){
        e.preventDefault();
           
        if(e.target.className === "column applicant-column"){

        dragged.parentNode.removeChild( dragged );
        e.target.appendChild( dragged );
        dragged.style.opacity = 1;
        }
    })
    
    
})(window);