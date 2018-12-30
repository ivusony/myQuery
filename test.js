;(function(){
    // const dragged = $('.applicant-container').drag();

    // dragged.forEach(element => {
    //     element.addEventListener('drag', function(e){
    //         console.log('I am dragged')
    //     })
    // });

    document.addEventListener('dragstart', function(e){
        
        e.preventDefault();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'some_dummy_data');
        var draggedElement = e.target;
            draggedElement.style.opacity = 0.5;
            console.log('dragstart');
    },false)

    document.addEventListener('dragover',function( e ) {
        // prevent default to allow drop
        e.preventDefault();
    }, false);

    document.addEventListener('drop', function(e){
        e.preventDefault();
        console.log(e.target);
        e.target.style.opacity = '';
    },false)
    
    const columns = document.getElementsByClassName('applicant-column');

    for (let i = 0; i < columns.size(); i++) {
        (function(index){
            columns[index].addEventListener('mouseover', function(e){
               
            })
        })(i)
    }

    // var draggedElement;

    // document.addEventListener('drag', function(e){
    //     console.log('draged');
    // }, false)
})();