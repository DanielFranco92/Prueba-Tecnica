//COROUSEL
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow,i) => {
    const itemNumber = movieLists[i].querySelectorAll("img").length;
    let clickCounter = 0;
    arrow.addEventListener("click",()=>{
        const ratio = Math.floor(window.innerWidth/300);
        clickCounter++;
        if(itemNumber - (4 + clickCounter) + (4 - ratio) >= 0){
            movieLists[i].style.transform = `translateX(${
                movieLists[i].computedStyleMap().get("transform")[0].x.value 
                - 300}px)`
        }else{
            movieLists[i].style.transform = "translateX(0)";
            clickCounter = 0;
        }
    })
})

//Activar y desactivar el modo oscuro
const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
    "input,.menu-link-item,.movie-list-item-desc,.movie-list-container,.movie-list-title,.navbar-container,.left-menu-icon,.toggle");

ball.addEventListener("click",()=>{
    items.forEach((item)=>{
        item.classList.toggle("active");
    })
    ball.classList.toggle("active");
})

// Desde el html TRAILER podemos cargar el iframe

function verTrailer(){  
    var ID = obtenerValorParametro("ID");        
    const iframe = document.querySelector('iframe');

    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'block';

    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        for(var item in data){
            if(data[item].id === ID){
                iframe.src = data[item].src;
            }
        }
        spinner.style.display = 'none';
    })
    .catch(error => {
        console.error(error);
        spinner.style.display = 'none';
    });
}

function obtenerValorParametro(nombreParametro) {
    var parametros = new URLSearchParams(location.search);
    return parametros.get(nombreParametro);
}

// BUSCAR PELICULA 
async function buscarPelicula(){
    EliminarListaImagenes();
    var Palabra = document.getElementById("BuscarPelicula").value;
    let dato = await fetchDatoObjecto();
    let Peliculas = PeliculasQueContengaEsaPalabra(dato, PalabraAMinuscula(Palabra));
    if(Peliculas === -1){
        SinResultado();
    }else{
        ConResultado();
        CrearListaImagenes(Peliculas);
    }
}

function PalabraAMinuscula(palabra){
    return palabra.toLowerCase();
}

function PeliculasQueContengaEsaPalabra(array, palabra){
    let PeliculaEncontrada = [];
    let j = 0;
    for(var i=0; i<array.length; i++){
        if(array[i].titulo.includes(palabra)){
            PeliculaEncontrada[j] = array[i];
            j++;
        }
    }
    if(PeliculaEncontrada.length >= 1){
        return PeliculaEncontrada;    
    }else{
        return -1; /*EN EL CASO DE QUE NO HAYA ENCONTRADA NADA EN EL ARRAY*/
    }
}

//Desde el MiLista HTML cargamos las imagenes al cargar la pagina

async function CargarListaDePeliculas(){
    let dato = await fetchDatoObjecto();
    CrearListaImagenes(dato);
}

async function fetchDatoObjecto() {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'block';
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        spinner.style.display = 'none';
        return data;
    } catch (error) {
        console.error(error);
        spinner.style.display = 'none';
    }
}

function CrearListaImagenes(array){
    //creamos el Div Lista
    var DivLista = document.createElement("div");
    DivLista.setAttribute("class","conteiner-search-list");
    for(let i=0; i<array.length; i++){
        //Creamos el DIV item. Este se encargar de almacenar todo los elementos que lleva(img,span,p,a,button)
        var DivItem = document.createElement("div");
        DivItem.setAttribute("class","container-search-item")
        //Creamos el elemento imagen
        var Img = document.createElement("img");
        Img.setAttribute("class","container-search-img");
        Img.setAttribute("src", array[i].imagen);
        //Lo ponemos dentro del Div ITEM
        DivItem.appendChild(Img);
        //Creamos el elemento span 
        var Span = document.createElement("span");
        Span.setAttribute("class","container-search-item-title");
        Span.innerHTML = array[i].titulo;
        //ponemos el span dentro del DIV ITEM
        DivItem.appendChild(Span);
        //Creamos el elemento P
        var Parrafo = document.createElement("p");
        Parrafo.setAttribute("class", "container-search-item-desc");
        Parrafo.innerHTML = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
        //Lo ponemos dentro del elemento DIV ITEM
        DivItem.appendChild(Parrafo);
        //CREAMOS EL ENLACE 
        var Enlace = document.createElement("a");
        Enlace.setAttribute("href","/trailer.html?ID="+array[i].id);
        //CREAMOS EL BOTON
        var button = document.createElement("button");
        button.setAttribute("class","container-search-item-button");
        button.innerHTML = "Play";
        //PONEMOS EL BOTON DENTRO DEL ENLACE
        Enlace.appendChild(button);
        //Y PONEMOS EL ENLACE DENTRO DEL DIV ITEM
        DivItem.appendChild(Enlace);
        //POR ULTIMO TODOS LOS "DIV ITEM" VAN DENTRO DE "DIV LISTA"
        DivLista.appendChild(DivItem);
    }
    //PONEMOS TODO DENTRO DE UN DIV CONTAINER
    document.querySelector(".container-search").appendChild(DivLista);
}

function EliminarListaImagenes(){
    var ListaImagenes = document.querySelector(".conteiner-search-list");
    if(ListaImagenes === null){
        return;
    }else{
        var elementos = document.getElementsByTagName("container-search-item");
        for(var i=0; i<elementos.length; i++){
            ListaImagenes.removeChild(elementos[i]);
        }
        ListaImagenes.parentNode.removeChild(ListaImagenes);
    }
}


//En el caso de que no haya encontrado resultado la busquedad

function SinResultado(){
    document.getElementById("ErrorPorFaltaDeResultado").style.display="flex";
}

// Volver a ocultar el div

function ConResultado(){
    document.getElementById("ErrorPorFaltaDeResultado").style.display="none";
}