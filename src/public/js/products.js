
document.getElementById("nextPageBtn").onclick = () =>{
    const nextPageValue = document.getElementById("nextPageValue").value
    const currentLimit = document.getElementById("currentLimit").value
    const currentQuery = document.getElementById("currentQuery").value

    const url = `/products/?page=${nextPageValue}&limit=${currentLimit}&query=${currentQuery}`
    document.location.href = url 
}

document.getElementById("prevPageBtn").onclick = () =>{
    const prevPageValue = document.getElementById("prevPageValue").value
    const currentLimit = document.getElementById("currentLimit").value
    const currentQuery = document.getElementById("currentQuery").value

    const url = `/products/?page=${prevPageValue}&limit=${currentLimit}&query=${currentQuery}`
    document.location.href = url
}

document.getElementById("limit").addEventListener("keyup", (e) =>{
    if(e.key === "Enter"){
        const limit = document.getElementById("limit").value
        const currentPage = document.getElementById("currentPage").value
        const currentQuery = document.getElementById("currentQuery").value

        const url = `/products/?page=${currentPage}&limit=${limit}&query=${currentQuery}`
        document.location.href = url
    }
})

document.getElementById("toPage").addEventListener("keyup", (e) =>{
    if(e.key === "Enter"){
        const currentLimit = document.getElementById("currentLimit").value
        const page = document.getElementById("toPage").value
        const currentQuery = document.getElementById("currentQuery").value
        
        const url = `/products/?page=${page}&limit=${currentLimit}&query=${currentQuery}`
        document.location.href = url
    }
})

document.getElementById("button-addon1").onclick = () =>{
    const currentLimit = document.getElementById("currentLimit").value
    const currentPage = document.getElementById("currentPage").value  
    const query = document.getElementById("query").value  

    const url = `/products/?page=${currentPage}&limit=${currentLimit}&query=${query}`
    document.location.href = url
}

document.getElementById("sort").onchange = () =>{
    const order = document.getElementById("sort").value
    console.log(order)
    const currentLimit = document.getElementById("currentLimit").value
    const currentPage = document.getElementById("currentPage").value 
    const currentQuery = document.getElementById("currentQuery").value

    const url = `/products/?page=${currentPage}&limit=${currentLimit}&query=${currentQuery}&sort=${order}`
    document.location.href = url
}

document.querySelectorAll(".addToCartBtn").forEach(button => {
    button.onclick = () => {
        const productId = button.parentElement.querySelector(".productId").value;
        const stock = button.parentElement.querySelector(".stock").value
        console.log(productId);
        console.log(stock);
        if (stock > 0) {
            fetch(`/api/carts/cartId/product/${productId}`, { method: "post" })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Product added to cart',
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(error => {
                    console.log("Error: " + error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Product couldn\'t be added to cart, no stock for the moment',
                    });
                });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product couldn\'t be added to cart, no stock for the moment',
            });
        }
    };
});



