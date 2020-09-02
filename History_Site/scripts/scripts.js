

var buttons = document.querySelectorAll("button");



for(button of buttons) {
    button.addEventListener("click", function() {
        let content = this.nextElementSibling;
        this.classList.toggle("active");

        /**by default, content.style.height does not reflect the property set in the css
         * even if a height property is set, the value is stil "", it only changes when manipuated by Javascript
         */
        if(content.style.height)
            content.style.height = null;
        else
            content.style.height = content.scrollHeight + "px";
        
    });
}