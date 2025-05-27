document.addEventListener("click", function dateChange() {
    startDate.max = new Date().toISOString().split('T')[0];
    console.log(startDate.max)
    endDate.max = new Date().toISOString().split('T')[0];
    console.log(endDate.max)
});

function dateChange() {
    let endDate = document.getElementById("endDate")
    if (document.getElementById("startDate").value != '') {
        endDate.min = new Date(document.getElementById("startDate").value).toISOString().split('T')[0]
        endDate.disabled = false
    } else if (document.getElementById("startDate").value) {

    }
    else {
        endDate.min = ''
        endDate.value = ''
        endDate.disabled = true
    }

}

console.log("INDO")