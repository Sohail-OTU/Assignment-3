// immediately invoked function expression

(function(){
    function start(){
        console.log("app started")
    }
    window.addEventListener("load",start);
})();

function confirmDelete() {
    return confirm('Are you sure you want to delete this item?');
}